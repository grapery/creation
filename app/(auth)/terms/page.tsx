"use client";

import { FileText } from "lucide-react";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import {
    TERMS_OF_SERVICE_LAST_UPDATED,
    TERMS_OF_SERVICE_MARKDOWN,
} from "@/lib/legal/terms-of-service";

export default function TermsOfServicePage() {
    return (
        <LegalDocumentPage
            title="服务协议"
            apiPath="/api/legal/terms"
            fallbackMarkdown={TERMS_OF_SERVICE_MARKDOWN}
            fallbackLastUpdated={TERMS_OF_SERVICE_LAST_UPDATED}
            icon={FileText}
        />
    );
}
