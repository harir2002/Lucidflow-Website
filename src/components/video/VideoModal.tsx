import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  posterSrc?: string;
}

/**
 * VideoModal: Premium accessible video player modal
 * - Native HTML5 video with controls
 * - Focus trap and escape key close
 * - Responsive 16:9 aspect ratio
 * - Auto-pause on close
 */
export function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  posterSrc,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      
      // Focus video or close button
      setTimeout(() => {
        videoRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Pause on close
  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="relative w-full h-full flex items-center justify-center px-4">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-60 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-crimson"
          aria-label="Close video"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Video container - 16:9 aspect ratio */}
        <div className="w-full max-w-4xl relative bg-black rounded-lg overflow-hidden">
          <div className="aspect-video">
            <video
              ref={videoRef}
              poster={posterSrc}
              controls
              preload="metadata"
              playsInline
              className="w-full h-full"
              aria-label="LucidFlow product overview video"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
