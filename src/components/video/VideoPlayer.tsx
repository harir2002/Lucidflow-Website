import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { VideoModal } from "./VideoModal";
import { trackEvent } from "@/hooks/useAnalytics";
import { useEnquiry } from "@/components/lucidflow/EnquiryProvider";
import { prefersReducedMotion } from "@/lib/motion";

interface VideoPlayerProps {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
  onFallback?: () => void;
}

/**
 * VideoPlayer: Premium video poster with play button modal
 * - Graceful fallback if video missing
 * - Analytics tracking
 * - Accessible play button
 * - Optional cursor tracking on hover
 */
export function VideoPlayer({
  videoSrc = "/videos/lucidflow-product-overview.mp4",
  posterSrc = "/images/lucidflow-video-poster.png",
  title = "Play LucidFlow product overview video",
  onFallback,
}: VideoPlayerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoExists, setVideoExists] = useState(true);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { openEnquiry } = useEnquiry();
  const prefersReduced = prefersReducedMotion();

  // Check if video file exists (using HEAD request)
  useEffect(() => {
    const checkVideoExists = async () => {
      try {
        const response = await fetch(videoSrc, { method: "HEAD" });
        if (!response.ok) {
          setVideoExists(false);
        }
      } catch {
        setVideoExists(false);
      }
    };

    if (videoSrc) {
      checkVideoExists();
    }
  }, [videoSrc]);

  const handlePlayClick = () => {
    if (!videoExists) {
      // Fallback to demo/enquiry form
      trackEvent("lucidflow_video_fallback_demo", {
        video_name: "LucidFlow Product Overview",
        video_location: "website_video_section",
        reason: "video_file_missing",
      });
      
      onFallback?.();
      openEnquiry({
        preferredEngagement: "demo",
        sourceSection: "video-section",
        heading: "Request a Platform Walkthrough",
      });
      return;
    }

    // Track video open
    trackEvent("lucidflow_video_open", {
      video_name: "LucidFlow Product Overview",
      video_location: "website_video_section",
    });

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Video Poster Container */}
      <div
        className="relative w-full bg-black rounded-lg overflow-hidden group cursor-pointer"
      >
        {/* 16:9 Aspect Ratio Container */}
        <div className="aspect-video relative overflow-hidden bg-[#050505]">
          {/* Poster Image */}
          {!imageError ? (
            <img
              src={posterSrc}
              alt="LucidFlow product video poster"
              className="w-full h-full object-cover"
              onLoad={() => setPosterLoaded(true)}
              onError={() => {
                setImageError(true);
                setPosterLoaded(true);
              }}
            />
          ) : (
            /* Fallback: Abstract decorative background */
            <div className="w-full h-full bg-gradient-to-br from-[#050505] to-[#0b0b0b] flex items-center justify-center">
              <svg
                viewBox="0 0 400 300"
                className="w-3/4 h-3/4 opacity-20"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e7000b" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
                {/* Journey lines */}
                <path
                  d="M 50 250 Q 100 150, 150 100 T 350 50"
                  stroke="url(#journeyGrad)"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Risk nodes */}
                <circle cx="100" cy="200" r="6" fill="#e7000b" opacity="0.6" />
                <circle cx="200" cy="120" r="5" fill="#e7000b" opacity="0.5" />
                <circle cx="300" cy="80" r="6" fill="#e7000b" opacity="0.6" />
              </svg>
            </div>
          )}

          {/* Dark overlay - becomes lighter on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/40 group-hover:via-black/20"
            aria-hidden="true"
          />

          {/* Play Button */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson rounded-lg"
            aria-label={title}
            type="button"
          >
            {/* Play button circle - animated on hover */}
            <div
              className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                animation: !prefersReduced && videoExists ? "none" : undefined,
              }}
            >
              {/* Outer ring - soft expand on hover */}
              <div
                className="absolute inset-0 rounded-full border-2 border-[#e7000b] transition-all duration-300 group-hover:border-opacity-100"
                style={{
                  opacity: 0.5,
                  transform: "scale(1)",
                  animation: !prefersReduced
                    ? "pulseGlow 3s ease-in-out infinite"
                    : "none",
                }}
                aria-hidden="true"
              />

              {/* Middle ring */}
              <div
                className="absolute inset-2 rounded-full border border-[#e7000b] transition-all duration-300"
                style={{
                  opacity: 0.3,
                }}
                aria-hidden="true"
              />

              {/* Inner button circle */}
              <div className="relative z-10 h-16 w-16 rounded-full bg-[#e7000b] flex items-center justify-center transition-all duration-300 group-hover:h-20 group-hover:w-20 shadow-lg group-hover:shadow-xl group-hover:shadow-red-600/50">
                <Play
                  className="h-8 w-8 text-white transition-all duration-300 group-hover:h-10 group-hover:w-10 ml-1"
                  fill="white"
                  strokeWidth={0}
                />
              </div>

              {/* Hover glow effect */}
              {!prefersReduced && (
                <div
                  className="absolute inset-0 rounded-full bg-[#e7000b] blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none"
                  aria-hidden="true"
                />
              )}
            </div>
          </button>

          {/* Red edge glow - subtle */}
          <div
            className="absolute inset-0 rounded-lg shadow-lg shadow-red-600/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        videoSrc={videoSrc}
        posterSrc={posterLoaded ? posterSrc : undefined}
      />
    </>
  );
}
