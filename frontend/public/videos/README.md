# Background Videos for Landing Page

## Required Video Files

To enable the background video feature on the landing page, please add the following video file:

### Main Background Video

- **File name**: `data-background.mp4`
- **Location**: `frontend/public/videos/data-background.mp4`
- **Recommended specifications**:
  - Format: MP4 (H.264 codec)
  - Resolution: 1920x1080 (Full HD) or higher
  - Duration: 30-60 seconds (it will loop automatically)
  - File size: Under 50MB for optimal loading
  - Content: Abstract data visualization, flowing particles, or technological themes

### Video Content Suggestions

The background video should relate to data and technology themes:

1. **Abstract Data Flow**: Animated particles, networks, or data streams
2. **Digital Technology**: Glowing circuits, code patterns, or digital matrices
3. **Vietnamese Elements**: Incorporate subtle Vietnamese cultural elements or colors
4. **Subtle Motion**: Gentle, non-distracting movement that enhances the content

### Video Creation Tools

You can create or source videos from:

- **Stock Video Sites**: Shutterstock, Getty Images, Unsplash Video
- **AI Video Generators**: Runway ML, Stable Video Diffusion
- **Video Editing**: After Effects, Premiere Pro, DaVinci Resolve
- **Free Resources**: Pexels Videos, Pixabay Videos

### Fallback Behavior

If the video file is not available, the landing page will:

- Show a gradient background instead
- Display all other animations and content normally
- Provide a video control button that will be hidden

### Installation

1. Add your video file as `frontend/public/videos/data-background.mp4`
2. Refresh the page to see the background video
3. The video will auto-play (muted) and loop continuously
4. Users can pause/play using the control button in the top-right corner

## Technical Details

- The video plays with `autoplay`, `loop`, and `muted` attributes for browser compatibility
- Opacity is set to 20% to not interfere with content readability
- A gradient overlay is applied for better text contrast
- The video is positioned as a fixed background element
