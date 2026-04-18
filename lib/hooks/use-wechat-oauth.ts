import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api/auth';

declare global {
  interface Window {
    // WeChat JS SDK global
    WechatJSBridge?: any;
  }
}

export function useWeChatOAuth() {
  const router = useRouter();

  const signIn = () => {
    const appId = process.env.NEXT_PUBLIC_WECHAT_APP_ID;

    if (!appId) {
      throw new Error('WeChat App ID is not configured');
    }

    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_WECHAT_REDIRECT_URI ||
      `${window.location.origin}/auth/wechat/callback`
    );
    const state = generateState();

    // 保存state到sessionStorage用于验证
    sessionStorage.setItem('wechat_oauth_state', state);

    // 跳转到微信授权页面（使用QRConnect扫码登录）
    const authUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;

    window.location.href = authUrl;
  };

  const handleCallback = async (code: string, state: string) => {
    // 验证state防止CSRF攻击
    const savedState = sessionStorage.getItem('wechat_oauth_state');
    if (state !== savedState) {
      console.error('[WeChat OAuth] State mismatch:', { received: state, saved: savedState });
      throw new Error('Invalid state parameter');
    }

    try {
      // 调用后端API进行登录
      await auth.loginWithWeChat({ code });
      sessionStorage.removeItem('wechat_oauth_state');
      router.push('/');
    } catch (error) {
      console.error('[WeChat OAuth] Login failed:', error);
      throw error;
    }
  };

  return {
    signIn,
    handleCallback,
  };
}

// 生成随机state参数
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
