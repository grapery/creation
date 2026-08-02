import { request } from './client';

export type ShareKind = 'fragment' | 'storyboard' | 'story' | 'character';

export interface ShareIssueResult {
    shareUrl: string;
    token: string;
    exp: number;
}

export const shareApi = {
    /** POST /api/v1/share/issue — mint a signed share URL (auth required). */
    issue: async (
        kind: ShareKind,
        id: string,
        platform = 'web'
    ): Promise<ShareIssueResult> => {
        return request('/api/v1/share/issue', 'POST', { kind, id, platform });
    },
};

/**
 * Issue a signed share link (when logged in) and open the system share sheet
 * or copy to clipboard. Falls back to the current page URL if issue fails.
 */
export async function shareContent(opts: {
    kind: ShareKind;
    id: string;
    title?: string;
    text?: string;
}): Promise<{ shareUrl: string; copied: boolean }> {
    let shareUrl =
        typeof window !== 'undefined' ? window.location.href : '';

    try {
        const issued = await shareApi.issue(opts.kind, opts.id, 'web');
        if (issued?.shareUrl) {
            shareUrl = issued.shareUrl;
        }
    } catch (e) {
        console.warn('share issue failed, falling back to current URL', e);
    }

    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.share) {
        try {
            await navigator.share({
                title: opts.title,
                text: opts.text,
                url: shareUrl,
            });
            return { shareUrl, copied: false };
        } catch (e) {
            if ((e as Error).name === 'AbortError') {
                return { shareUrl, copied: false };
            }
        }
    }

    try {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
    } catch {
        /* ignore */
    }

    return { shareUrl, copied };
}
