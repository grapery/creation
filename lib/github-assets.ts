/**
 * Assets Configuration
 *
 * Images are served via jsDelivr CDN from the public GitHub repo:
 * https://github.com/grapery/creation/tree/develop/public
 *
 * To use a different CDN, set NEXT_PUBLIC_ASSETS_URL in .env.local.
 * Fallback to local public/ paths when no CDN is configured.
 */
// 默认走本地 /public 同源路径：服务器端图像优化器无法访问 raw.githubusercontent.com（国内出口超时），
// 同源静态资源可直接优化且无出网依赖。如需 CDN 请显式设置 NEXT_PUBLIC_ASSETS_URL。
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "";

// Individual image URLs - can be customized per image
// Fallback to local paths if GitHub URLs are not set
export const githubImages = {
  // Onboarding images for auth layout
  storyOverview: ASSETS_BASE_URL 
    ? `${ASSETS_BASE_URL}/story_overview.jpeg`
    : "/story_overview.jpeg",
    
  storyboard: ASSETS_BASE_URL 
    ? `${ASSETS_BASE_URL}/storyboard.jpeg`
    : "/storyboard.jpeg",
    
  branching: ASSETS_BASE_URL 
    ? `${ASSETS_BASE_URL}/branching.jpeg`
    : "/branching.jpeg",
    
  roles: ASSETS_BASE_URL 
    ? `${ASSETS_BASE_URL}/roles.jpeg`
    : "/roles.jpeg",
    
  collaboration: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/collaboration.jpeg`
    : "/collaboration.jpeg",

  // App screenshots for about page
  screenshotFragmentFeed: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-fragment-feed.jpeg`
    : "/screenshot-fragment-feed.jpeg",
  screenshotStoryboardList: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-storyboard-list.jpeg`
    : "/screenshot-storyboard-list.jpeg",
  screenshotStoryboardReader: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-storyboard-reader.jpeg`
    : "/screenshot-storyboard-reader.jpeg",
  screenshotCreateStoryboard: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-create-storyboard.png`
    : "/screenshot-create-storyboard.png",
  screenshotStoryDetail: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-story-detail.jpeg`
    : "/screenshot-story-detail.jpeg",
  screenshotContributors: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-contributors.jpeg`
    : "/screenshot-contributors.jpeg",
  screenshotNotifications: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-notifications.jpeg`
    : "/screenshot-notifications.jpeg",
  screenshotUserProfile: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/screenshot-user-profile.jpeg`
    : "/screenshot-user-profile.jpeg",

  // App icon
  appIcon: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/app-icon.png`
    : "/app-icon.png",
  appIcon256: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/app-icon-256.png`
    : "/app-icon-256.png",
  appIcon64: ASSETS_BASE_URL
    ? `${ASSETS_BASE_URL}/app-icon-64.png`
    : "/app-icon-64.png",
};

// Helper function to get image URL with fallback
export function getImageUrl(
  githubUrl: string, 
  localPath: string, 
  options?: { width?: number; quality?: number }
): string {
  // If GitHub URL is set and not empty, use it
  if (githubUrl && !githubUrl.startsWith("/")) {
    // Add image optimization params if using an image CDN
    if (options?.width || options?.quality) {
      const params = new URLSearchParams();
      if (options.width) params.set("w", options.width.toString());
      if (options.quality) params.set("q", options.quality.toString());
      return `${githubUrl}?${params.toString()}`;
    }
    return githubUrl;
  }
  
  // Fallback to local path
  return localPath;
}

// Usage example:
// import { githubImages } from "@/lib/github-assets";
// 
// <img src={githubImages.storyOverview} alt="Story Overview" />
