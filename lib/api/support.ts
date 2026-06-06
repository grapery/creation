import axios from "axios";

import { APIError } from "./client";
import type { FeedbackCategory } from "../types";

type SupportFeedbackResponse = {
    id: string;
    status: string;
    message: string;
};

export const support = {
    submitPublicFeedback: async (params: {
        category: FeedbackCategory;
        content: string;
        contactInfo: string;
    }): Promise<SupportFeedbackResponse> => {
        const response = await axios.post("/api/public/support/feedback", params);
        const payload = response.data;

        if (payload && typeof payload.code === "number") {
            if (payload.code === 1) {
                return (payload.data ?? payload) as SupportFeedbackResponse;
            }
            throw new APIError(payload.message || payload.msg || "提交失败", payload.code);
        }

        return payload as SupportFeedbackResponse;
    },
};
