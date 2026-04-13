/**
 * 统一的API错误处理工具
 * 用于在组件中处理API错误并显示友好提示
 */

import { APIError } from './client';
import { ErrorCodes, ErrorType, getErrorInfo, isAuthError } from './error-codes';
import { showError, showWarning, showInfo } from '@/lib/toast-utils';

// 错误处理选项
export interface ErrorHandlerOptions {
    // 是否显示Toast提示
    showToast?: boolean;
    // 自定义错误消息
    customMessage?: string;
    // 认证错误时的回调
    onAuthError?: () => void;
    // 网络错误时的回调
    onNetworkError?: () => void;
    // 默认错误回调
    onDefaultError?: (error: Error) => void;
    // 是否静默处理（不显示任何提示）
    silent?: boolean;
}

// 默认选项
const defaultOptions: ErrorHandlerOptions = {
    showToast: true,
    silent: false,
};

/**
 * 处理API错误并显示友好提示
 * @param error 错误对象
 * @param options 处理选项
 */
export function handleAPIError(
    error: unknown,
    options: ErrorHandlerOptions = {}
): void {
    const opts = { ...defaultOptions, ...options };

    // 静默模式不显示任何提示
    if (opts.silent) {
        return;
    }

    // 非APIError类型的错误
    if (!(error instanceof APIError)) {
        const err = error as Error;

        // 网络错误
        if (err.message?.includes('Network Error') ||
            err.message?.includes('ECONNREFUSED') ||
            err.message?.includes('timeout')) {
            if (opts.onNetworkError) {
                opts.onNetworkError();
            } else if (opts.showToast) {
                showWarning(
                    '网络连接失败',
                    '请检查网络连接后重试'
                );
            }
            return;
        }

        // 其他未知错误
        if (opts.onDefaultError) {
            opts.onDefaultError(err);
        } else if (opts.showToast) {
            showError(
                '操作失败',
                opts.customMessage || err.message || '请稍后重试'
            );
        }
        return;
    }

    // APIError处理
    const apiError = error as APIError;
    const errorCode = apiError.code;
    const errorInfo = getErrorInfo(errorCode, apiError.message);

    // 认证错误特殊处理
    if (isAuthError(errorCode)) {
        if (opts.onAuthError) {
            opts.onAuthError();
        }
        // 认证错误由全局处理器处理，这里不显示Toast
        return;
    }

    // 根据错误类型显示不同级别的提示
    if (opts.showToast && errorInfo.shouldShowToast) {
        const message = opts.customMessage || errorInfo.description;

        switch (errorInfo.type) {
            case ErrorType.SYSTEM:
                showError(errorInfo.title, message);
                break;
            case ErrorType.VALIDATION:
                showWarning(errorInfo.title, message);
                break;
            case ErrorType.BUSINESS:
                showInfo(errorInfo.title, message);
                break;
            default:
                showError(errorInfo.title, message);
        }
    }

    // 执行默认错误回调
    if (opts.onDefaultError) {
        opts.onDefaultError(apiError);
    }
}

/**
 * 创建带默认错误处理的异步函数包装器
 * @param fn 异步函数
 * @param options 错误处理选项
 */
export function withErrorHandling<T>(
    fn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
): Promise<T | null> {
    return fn().catch((error) => {
        handleAPIError(error, options);
        return null;
    });
}

/**
 * React Hook: 使用错误处理的异步操作
 * 返回一个包装函数，自动处理错误
 */
export function useAsyncWithErrorHandling() {
    return async <T>(
        fn: () => Promise<T>,
        options: ErrorHandlerOptions = {}
    ): Promise<T | null> => {
        try {
            return await fn();
        } catch (error) {
            handleAPIError(error, options);
            return null;
        }
    };
}

// 导出错误码供组件使用
export { ErrorCodes, ErrorType, getErrorInfo, isAuthError };
