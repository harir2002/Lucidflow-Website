import { trackCtaClick } from "@/hooks/useAnalytics";
import { trackCTAClick } from "@/lib/ga4";
import { VideoPlayer } from "@/components/video/VideoPlayer";

/**
 * Video Section with premium VideoPlayer component
 * Supports MP4 at public/videos/lucidflow-product-overview.mp4
 * Uses poster image from public/images/lucidflow-video-poster.png
 * Medium size video frame with max-width constraint
 */
export function VideoPlaceholder() {
  const handleVideoFallback = () => {
    trackCtaClick({
      ctaLabel: "Request a Platform Walkthrough",
      ctaLocation: "video",
      preferredEngagement: "demo",
    });
    trackCTAClick({
      cta_label: "Request a Platform Walkthrough",
      cta_location: "video",
      preferred_engagement: "demo",
    });
  };

  return (
    <section id="video" className="section-space">
      <div className="container-lf">
        <div className="mx-auto max-w-2xl">
          <VideoPlayer
            videoSrc="/videos/lucidflow-product-overview.mp4"
            posterSrc="/images/lucidflow-video-poster.png"
            title="Play LucidFlow product overview video"
            onFallback={handleVideoFallback}
          />
        </div>
      </div>
    </section>
  );
}
