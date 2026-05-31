"use client";

import { Shield } from "lucide-react";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import {
    PRIVACY_POLICY_LAST_UPDATED,
    PRIVACY_POLICY_MARKDOWN,
} from "@/lib/legal/privacy-policy";

export default function PrivacyPolicyPage() {
    return (
        <LegalDocumentPage
            title="隐私政策"
            apiPath="/api/legal/privacy"
            fallbackMarkdown={PRIVACY_POLICY_MARKDOWN}
            fallbackLastUpdated={PRIVACY_POLICY_LAST_UPDATED}
            icon={Shield}
        />
    );
}
