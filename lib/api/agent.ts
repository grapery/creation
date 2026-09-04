import { getAuthToken, request } from './client';

export interface AgentAccessTokenResponse {
    agentAccessToken: string;
    tokenType?: string;
    expiresAt?: number;
    expiresInSec?: number;
    requestId?: string;
    jti?: string;
    agent?: string;
    operation?: string;
    agentEndpoint?: string;
    agentEndpointBase?: string;
}

export interface AgentCreationMessageRequest {
    message: string;
    clientRequestId: string;
    context: {
        surface?: 'fragment_create' | 'fragment_edit' | 'storyboard_create' | 'storyboard_edit';
        targetType: 'fragment' | 'storyboard' | 'story' | 'branch';
        draftId?: string | null;
        storyId?: string | null;
        parentStoryboardId?: string | null;
        selectedImageIndex?: number | null;
    };
    options: {
        imageCount?: number;
        sceneCount?: number;
        planningOnly?: boolean;
        style?: string;
        mood?: string;
        length?: string;
        language?: string;
        visibility?: string;
        aspectRatio?: string;
        consistencyLevel?: string;
        referenceImages?: string[];
        includeGenerationTrace?: boolean;
    };
}
export interface AgentGenerationEventPayload {
    status?: string;
    message?: string;
    progress?: number;
    step?: string;
    /** 服务端 progress/completed 事件实际携带的步骤名（analyzing/writing/…） */
    currentStep?: string;
    taskId?: string;
    runId?: string;
    fragmentId?: string;
    draftFragmentId?: string;
    draftId?: string;
    storyboardId?: string;
    draftStoryboardId?: string;
    sceneCount?: number;
    intent?: string;
    imageCount?: number;
    tokensUsed?: number;
    result?: {
        id?: string;
        content?: string;
        imageUrls?: string[];
        caption?: string;
    };
    output?: {
        content?: string;
        imageUrls?: string[];
        [key: string]: unknown;
    };
    error?: string;
    assistantMessage?: string;
    intentType?: string;
}

/** Issue short-lived agent access token via Grapery. */
export async function issueAgentAccessToken(params: {
    agent?: string;
    operation: 'chat' | 'generate';
    sessionId: string;
    maxTokens?: number;
    maxImages?: number;
}): Promise<AgentAccessTokenResponse> {
    return request('/api/v1/agent-access-tokens', 'POST', {
        agent: params.agent || 'fragment',
        operation: params.operation,
        sessionId: params.sessionId,
        maxTokens: params.maxTokens ?? 0,
        maxImages: params.maxImages ?? 4,
    });
}

/**
 * Stream creation session messages from grapery-agent (SSE).
 * Proxied via Next rewrite `/api/agent/*` → AGENT_ORIGIN `/api/v1/agent/*`.
 */
export async function* streamCreationMessage(
    sessionId: string,
    token: string,
    body: AgentCreationMessageRequest,
    signal?: AbortSignal
): AsyncGenerator<{ event: string; data: AgentGenerationEventPayload }> {
    const auth = getAuthToken();
    const res = await fetch(`/api/agent/creation/sessions/${sessionId}/messages/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
            'X-Agent-Access-Token': token,
            ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
        },
        body: JSON.stringify(body),
        signal,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Agent stream failed (${res.status})`);
    }
    if (!res.body) {
        throw new Error('Agent stream returned empty body');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent = 'message';
    let dataLines: string[] = [];

    const flush = (): { event: string; data: AgentGenerationEventPayload } | null => {
        if (dataLines.length === 0) return null;
        const raw = dataLines.join('\n');
        dataLines = [];
        try {
            return { event: currentEvent, data: JSON.parse(raw) as AgentGenerationEventPayload };
        } catch {
            return { event: currentEvent, data: { message: raw } };
        }
    };

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';
        for (const line of lines) {
            if (line === '') {
                const item = flush();
                if (item) yield item;
                currentEvent = 'message';
                continue;
            }
            if (line.startsWith('event:')) {
                currentEvent = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
                dataLines.push(line.slice(5).trim());
            }
        }
    }
    const last = flush();
    if (last) yield last;
}
