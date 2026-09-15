# LucidFlow Video Player Setup

## Status
✅ Video player infrastructure is complete and ready for video asset addition.

## Video Asset Locations

The website expects video and poster assets at these public paths:

```
public/
  videos/
    lucidflow-product-overview.mp4
  images/
    lucidflow-video-poster.webp
    lucidflow-video-poster.png
```

## Video Specifications

**MP4 Video:**
- Codec: H.264
- Resolution: 1920 × 1080 (16:9 aspect ratio)
- Duration: ~60 seconds (ideal for web)
- Audio: Silent or minimal (optional)
- Target file size: 8-12 MB for optimal web performance
  - Keep under 15 MB to avoid excessive download times
  - Use an online MP4 compressor if needed

**Poster Images:**
- Format: WebP (primary), PNG (fallback)
- Resolution: 1920 × 1080 or 1280 × 720
- Should be a compelling frame from the video
- Keep WebP under 200 KB

## How the Video Player Works

1. **Poster Display**: Shows the poster image with an animated play button overlay
2. **Video Modal**: Clicking play opens a modal with native HTML5 video player
3. **Fallback Behavior**: If MP4 is missing, clicking play opens the Platform Walkthrough enquiry form
4. **Analytics**: Tracks video opens, plays, progress (25/50/75%), and completions
5. **Accessibility**: Full keyboard navigation, focus management, and screen reader support

## Implementation Details

### Components

- `VideoPlayer.tsx` - Main component with poster and play button
- `VideoModal.tsx` - Accessible modal with native video player

### Features

- ✅ Responsive 16:9 aspect ratio
- ✅ Hover effects with scale and glow
- ✅ Graceful fallback if video file missing
- ✅ Full analytics tracking
- ✅ Keyboard and screen reader accessible
- ✅ Respects prefers-reduced-motion
- ✅ Auto-pauses on modal close
- ✅ Focus trap and escape key close

### Analytics Events

When video is available:
- `lucidflow_video_open` - Video modal opened
- `lucidflow_video_play` - Video playback started
- `lucidflow_video_progress` - Playback milestones (25%, 50%, 75%)
- `lucidflow_video_complete` - Video finished

When video is missing:
- `lucidflow_video_fallback_demo` - Fallback to demo/enquiry form

## Adding Your Video

1. Create the MP4 with specifications above
2. Create WebP poster (1920×1080 recommended)
3. Create PNG poster as fallback
4. Place files in `public/` folder at paths specified above
5. No code changes needed - the player will automatically use them
6. Test by visiting the page and clicking the play button

## Performance Notes

- Video is lazy-loaded (only when user clicks play)
- Poster image is loaded immediately for visual appeal
- Metadata preload only (not the entire video until play)
- No autoplay to respect user preferences
- Responsive video player adapts to mobile devices

## Troubleshooting

**Video not playing:**
- Verify file path is exactly `/videos/lucidflow-product-overview.mp4`
- Check file format is valid MP4 (H.264)
- Try opening the file directly in browser to test

**Poster not showing:**
- Verify poster files exist at `/images/lucidflow-video-poster.webp` and `.png`
- Check WebP browser support (modern browsers only)
- Fallback PNG will load if WebP unavailable

**Audio issues:**
- If video has audio, test volume levels
- Consider adding captions for accessibility
- Keep audio minimal to avoid distracting from product focus

## Questions?

Refer to the VideoPlayer and VideoModal component comments for implementation details.
