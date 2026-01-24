import React from "react";
import { Loader2, Chrome, Apple, MessageCircle } from "lucide-react";

export type OAuthProvider = "google" | "apple" | "wechat";

interface OAuthProviderButtonProps {
    provider: OAuthProvider;
    title: string;
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export function OAuthProviderButton({
    provider,
    title,
    isLoading = false,
    disabled = false,
    onClick,
}: OAuthProviderButtonProps) {
    const getIcon = () => {
        switch (provider) {
            case "google":
                return <Chrome className="h-5 w-5" />;
            case "apple":
                return <Apple className="h-5 w-5" />;
            case "wechat":
                return <MessageCircle className="h-5 w-5" />;
        }
    };

    const getVariantStyles = () => {
        switch (provider) {
            case "google":
                return "bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800";
            case "apple":
                return "bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800";
            case "wechat":
                return "bg-white text-green-600 border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-green-500 dark:hover:bg-gray-800";
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
                w-full
                flex
                items-center
                justify-center
                gap-3
                px-6
                py-3
                rounded-full
                text-sm
                font-semibold
                transition-all
                duration-200
                ${getVariantStyles()}
                ${disabled || isLoading ? "opacity-70 cursor-not-allowed" : ""}
            `}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <span className="h-5 w-5 flex items-center justify-center">
                    {getIcon()}
                </span>
            )}
            <span>{title}</span>
        </button>
    );
}
