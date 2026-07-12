/**
 * WeChat OpenSDK universal-link verification path (`https://www.rankquantity.xyz/wechat/...`).
 * The iOS app handles the activity first; this page is a minimal HTTPS fallback.
 */
export default function WeChatUniversalLinkFallback() {
  return (
    <div className="min-h-svh bg-black text-center text-xs text-zinc-600 flex items-center justify-center px-6">
      WeChat universal link
    </div>
  );
}
