import { trackCtaClick } from "@/hooks/useAnalytics";
import { VideoPlayer } from "@/components/video/VideoPlayer";

/**
 * Video Section with premium VideoPlayer component
 * Supports future MP4 at public/videos/lucidflow-product-overview.mp4
 * Uses poster images from public/images/lucidflow-video-poster.webp and .png
 * 
 * TODO: Add video file at public/videos/lucidflow-product-overview.mp4
 * Video specs:
 * - MP4 with H.264 codec
 * - 1920 × 1080, 16:9
 * - ~60 seconds
 * - Silent or minimal audio
 * - 8-12 MB file size
 */
export function VideoPlaceholder() {
  const handleVideoFallback = () => {
    trackCtaClick({
      ctaLabel: "Request a Platform Walkthrough",
      ctaLocation: "video",
      preferredEngagement: "demo",
    });
  };

  return (
    <section id="video" className="section-space">
      <div className="container-lf">
        <VideoPlayer
          videoSrc="/videos/lucidflow-product-overview.mp4"
          posterSrc="/images/lucidflow-video-poster.webp"
          fallbackPosterSrc="/images/lucidflow-video-poster.png"
          title="Play LucidFlow product overview video"
          onFallback={handleVideoFallback}
        />
      </div>
    </section>
  );
}
