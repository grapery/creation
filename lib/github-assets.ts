/**
 * GitHub Assets Configuration
 * 
 * This file configures image assets to be loaded from GitHub.
 * To use GitHub as image CDN:
 * 
 * 1. Create a public GitHub repository (e.g., "voyager-assets")
 * 2. Upload your images to the repository
 * 3. Get the raw GitHub URL for each image:
 *    https://raw.githubusercontent.com/{username}/{repo}/{branch}/{path}
 * 
 * 4. Set NEXT_PUBLIC_GITHUB_ASSETS_URL in your .env.local file
 *    Example: https://raw.githubusercontent.com/grapery/voyager-assets/main/images
 * 
 * 5. Or set individual image URLs below
 */

// Base URL for GitHub assets (set via environment variable)
const GITHUB_ASSETS_BASE_URL = process.env.NEXT_PUBLIC_GITHUB_ASSETS_URL || "";

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
