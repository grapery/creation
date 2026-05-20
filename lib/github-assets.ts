/**
 * GitHub Assets Configuration
 * 
 * This file configures image assets to be loaded from GitHub.
 * 
 * Current setup:
 * Images are stored in the develop/public directory:
 * https://github.com/grapery/creation/tree/develop/public
 * 
 * Raw URL format:
 * https://raw.githubusercontent.com/grapery/creation/develop/public/{filename}
 * 
 * To customize:
 * 1. Set NEXT_PUBLIC_GITHUB_ASSETS_URL in your .env.local file
 * 2. Or modify the individual image URLs below
 */

// Base URL for GitHub assets (set via environment variable)
// Default uses jsDelivr CDN for better global availability (especially in China)
// Format: https://cdn.jsdelivr.net/gh/{user}/{repo}@{branch}/{path}
const GITHUB_ASSETS_BASE_URL = process.env.NEXT_PUBLIC_GITHUB_ASSETS_URL || 
  "https://cdn.jsdelivr.net/gh/grapery/creation@develop/public";

// Individual image URLs - can be customized per image
// Fallback to local paths if GitHub URLs are not set
export const githubImages = {
  // Onboarding images for auth layout
  storyOverview: GITHUB_ASSETS_BASE_URL 
    ? `${GITHUB_ASSETS_BASE_URL}/story_overview.jpeg`
    : "/story_overview.jpeg",
    
  storyboard: GITHUB_ASSETS_BASE_URL 
    ? `${GITHUB_ASSETS_BASE_URL}/storyboard.jpeg`
    : "/storyboard.jpeg",
    
  branching: GITHUB_ASSETS_BASE_URL 
    ? `${GITHUB_ASSETS_BASE_URL}/branching.jpeg`
    : "/branching.jpeg",
    
  roles: GITHUB_ASSETS_BASE_URL 
    ? `${GITHUB_ASSETS_BASE_URL}/roles.jpeg`
    : "/roles.jpeg",
    
  collaboration: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/collaboration.jpeg`
    : "/collaboration.jpeg",

  // App screenshots for about page
  screenshotFragmentFeed: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-fragment-feed.jpeg`
    : "/screenshot-fragment-feed.jpeg",
  screenshotStoryboardList: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-storyboard-list.jpeg`
    : "/screenshot-storyboard-list.jpeg",
  screenshotStoryboardReader: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-storyboard-reader.jpeg`
    : "/screenshot-storyboard-reader.jpeg",
  screenshotCreateStoryboard: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-create-storyboard.png`
    : "/screenshot-create-storyboard.png",
  screenshotStoryDetail: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-story-detail.jpeg`
    : "/screenshot-story-detail.jpeg",
  screenshotContributors: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-contributors.jpeg`
    : "/screenshot-contributors.jpeg",
  screenshotNotifications: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-notifications.jpeg`
    : "/screenshot-notifications.jpeg",
  screenshotUserProfile: GITHUB_ASSETS_BASE_URL
    ? `${GITHUB_ASSETS_BASE_URL}/screenshot-user-profile.jpeg`
    : "/screenshot-user-profile.jpeg",
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
