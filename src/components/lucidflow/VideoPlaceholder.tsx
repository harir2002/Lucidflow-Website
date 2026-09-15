import { trackCtaClick } from "@/hooks/useAnalytics";
import { VideoPlayer } from "@/components/video/VideoPlayer";

/**
 * Video Section with premium VideoPlayer component
 * Supports MP4 at public/videos/lucidflow-product-overview.mp4
 * Uses poster image from public/images/lucidflow-video-poster.png
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
          posterSrc="/images/lucidflow-video-poster.png"
          title="Play LucidFlow product overview video"
          onFallback={handleVideoFallback}
        />
      </div>
    </section>
  );
}
