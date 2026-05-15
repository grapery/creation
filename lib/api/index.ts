/**
 * API模块统一导出
 */

// API客户端
export {
    apiClient,
    paymentClient,
    chatClient,
    request,
    getAuthToken,
    setTokens,
    clearTokens,
    getRefreshToken,
    getUserIdFromToken,
    setupAuthListeners,
    APIError,
    ServiceType,
} from './client';

// 错误码和处理
export {
    ErrorCodes,
    ErrorType,
    ErrorCodeMap,
    getErrorInfo,
    isAuthError,
    canRefreshToken,
    shouldRedirectToLogin,
    type ErrorCode,
    type ErrorInfo,
} from './error-codes';

// 错误处理工具
export {
    handleAPIError,
    withErrorHandling,
    useAsyncWithErrorHandling,
    type ErrorHandlerOptions,
} from './error-handler';

// API服务
export { auth } from './auth';
export { stories } from './stories';
export { characters } from './characters';
export { payment } from './payment';
export { storyboards } from './storyboards';
export { profile } from './profile';
export { comments } from './comments';
export { notifications } from './notifications';
export { settings } from './settings';
export { vip } from './vip';
export { chat } from './chat';
export { assets } from './assets';
export { tags } from './tags';
export { fragments } from './fragments';
export { creation } from './creation';
export { plaza } from './plaza';
export { devices } from './devices';

// New services
export { interactions, follows, likes, bookmarks } from './interactions';
export { search } from './search';
export { badges } from './badges';
export { tokenUsage } from './token-usage';
export { feedback } from './feedback';
export { referrals } from './referrals';
export { ai } from './ai';
export { upload } from './upload';
export { styles } from './styles';
export { legal } from './legal';
