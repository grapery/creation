/**
 * API Error Codes
 * 与后端 grapery/internal/transport/http/response.go 保持一致
 */

// 错误码常量
export const ErrorCodes = {
  SUCCESS: 1,
  ERROR: 0,
  INVALID_PARAMS: -1,
  UNAUTHORIZED: -2,
  FORBIDDEN: -3,
  NOT_FOUND: -4,
  INTERNAL_ERROR: -5,
  DUPLICATE_ENTRY: -6,
  RATE_LIMIT_EXCEED: -7,
  TOKEN_EXPIRED: -8,
  INVALID_TOKEN: -9,
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// 错误类型枚举
export enum ErrorType {
  AUTH = 'auth',           // 认证相关错误
  VALIDATION = 'validation', // 参数验证错误
  BUSINESS = 'business',   // 业务逻辑错误
  SYSTEM = 'system',       // 系统错误
  NETWORK = 'network',     // 网络错误
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType;
  title: string;
  description: string;
  action?: {
    type: 'relogin' | 'retry' | 'wait' | 'check_input' | 'none';
    label?: string;
  };
  shouldShowToast: boolean;
  shouldBlockUI: boolean;
}

// 错误码到错误信息的映射
export const ErrorCodeMap: Record<number, ErrorInfo> = {
  [ErrorCodes.INVALID_PARAMS]: {
    type: ErrorType.VALIDATION,
    title: '参数错误',
    description: '请检查输入内容是否正确',
    action: { type: 'check_input', label: '检查输入' },
    shouldShowToast: true,
    shouldBlockUI: false,
  },
  [ErrorCodes.UNAUTHORIZED]: {
    type: ErrorType.AUTH,
    title: '请先登录',
    description: '您需要登录才能访问此功能',
    action: { type: 'relogin', label: '去登录' },
    shouldShowToast: false, // 由LoginPrompt处理
    shouldBlockUI: true,
  },
  [ErrorCodes.FORBIDDEN]: {
    type: ErrorType.AUTH,
    title: '权限不足',
    description: '您没有权限执行此操作',
    action: { type: 'none' },
    shouldShowToast: true,
    shouldBlockUI: false,
  },
  [ErrorCodes.NOT_FOUND]: {
    type: ErrorType.BUSINESS,
    title: '资源不存在',
    description: '请求的内容不存在或已被删除',
    action: { type: 'none' },
    shouldShowToast: true,
    shouldBlockUI: false,
  },
  [ErrorCodes.INTERNAL_ERROR]: {
    type: ErrorType.SYSTEM,
    title: '服务器错误',
    description: '服务器出现问题，请稍后重试',
    action: { type: 'retry', label: '重试' },
    shouldShowToast: true,
    shouldBlockUI: false,
  },
  [ErrorCodes.DUPLICATE_ENTRY]: {
    type: ErrorType.BUSINESS,
    title: '记录已存在',
    description: '该内容已经存在，无需重复操作',
    action: { type: 'none' },
    shouldShowToast: true,
    shouldBlockUI: false,
  },
  [ErrorCodes.RATE_LIMIT_EXCEED]: {
    type: ErrorType.BUSINESS,
    title: '操作过于频繁',
    description: '请稍后再试',
    action: { type: 'wait', label: '稍后重试' },
    shouldShowToast: true,
    shouldBlockUI: false,
  },
  [ErrorCodes.TOKEN_EXPIRED]: {
    type: ErrorType.AUTH,
    title: '登录已过期',
    description: '您的登录状态已过期，请重新登录',
    action: { type: 'relogin', label: '重新登录' },
    shouldShowToast: false, // 尝试刷新Token，失败后再提示
    shouldBlockUI: true,
  },
  [ErrorCodes.INVALID_TOKEN]: {
    type: ErrorType.AUTH,
    title: '请重新登录',
    description: '登录状态无效，请重新登录',
    action: { type: 'relogin', label: '去登录' },
    shouldShowToast: false,
    shouldBlockUI: true,
  },
};

// 获取错误信息
export function getErrorInfo(code: number, fallbackMessage?: string): ErrorInfo {
  const info = ErrorCodeMap[code];
  if (info) {
    return info;
  }

  // 未知错误码的默认处理
  return {
    type: ErrorType.BUSINESS,
    title: '操作失败',
    description: fallbackMessage || '请稍后重试',
    action: { type: 'retry', label: '重试' },
    shouldShowToast: true,
    shouldBlockUI: false,
  };
}

// 判断是否为认证错误
export function isAuthError(code: number): boolean {
  const authCodes: number[] = [ErrorCodes.UNAUTHORIZED, ErrorCodes.TOKEN_EXPIRED, ErrorCodes.INVALID_TOKEN];
  return authCodes.includes(code);
}

// 判断是否可以尝试刷新Token
export function canRefreshToken(code: number): boolean {
  return code === ErrorCodes.TOKEN_EXPIRED;
}

// 判断是否需要直接跳转登录
export function shouldRedirectToLogin(code: number): boolean {
  const redirectCodes: number[] = [ErrorCodes.UNAUTHORIZED, ErrorCodes.INVALID_TOKEN];
  return redirectCodes.includes(code);
}
