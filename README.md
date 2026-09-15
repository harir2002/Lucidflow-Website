# 🎯 LucidFlow

> **Continuous dark-pattern monitoring for insurance and banking digital journeys**

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Version](https://img.shields.io/badge/Version-2.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ What is LucidFlow?

LucidFlow is a premium digital journey monitoring platform that helps insurance and banking organizations identify and remediate dark patterns in customer journeys. Our evidence-led approach provides continuous visibility, automated risk detection, and streamlined corrective action workflows.

**From Assessment to Assurance** - Start with one critical journey, build the evidence, decide the right path forward.

---

## 🚀 Key Features

### 🔍 **Journey Assurance Scanning**
- Focused, evidence-led review of critical customer journeys
- Automated dark-pattern detection
- Screenshot and journey evidence capture
- Severity context and risk mapping
- Professional SBA walkthroughs

### 📊 **Continuous Monitoring**
- Real-time journey surveillance
- Potential risk flagging
- Compliance visibility dashboard
- Corrective action tracking

### 🛠️ **Flexible Engagement Models**
- **One-Time Project** - Baseline assessment, report, and verification
- **Annual SaaS** - Continuous self-service monitoring with SBA hosting
- **Annual Enterprise** - Customer-hosted deployment for private cloud needs

### 🎬 **Premium Digital Experience**
- Subtle parallax effects and scroll reveals
- Animated journey flows and depth effects
- Premium video player with analytics
- Fully responsive design
- Complete accessibility compliance

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI component framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations (ready for video events)

### Features
- **Responsive Design** - Mobile, tablet, desktop optimized
- **Dark Mode** - Premium dark-first aesthetic
- **Accessibility** - WCAG 2.1 Level AA compliant
- **Performance** - Optimized animations, lazy loading
- **SEO Ready** - Meta tags, structured data, Open Graph

### Build & Deploy
- **Next.js Config** - SSG/SSR ready
- **PostCSS** - Advanced CSS processing
- **ESLint** - Code quality checks
- **Git** - Version control ready

---

## 🎨 Design Highlights

### Premium Motion System
- **ScrollReveal** - Elegant content reveals on viewport entry
- **Parallax Effects** - Subtle background movement on desktop
- **Ambient Glows** - Pulsing visual depth indicators
- **Journey Lines** - Animated process flows with traveling highlights
- **State Transitions** - Smooth micro-interactions throughout

### Color Palette
```
🔴 Crimson Red:    #E7000B
⚪ White:          #FFFFFF
⚫ Black:          #000000
```

### Interactive Components
- Hover-responsive cards with border animations
- Smooth accordion transitions
- Animated step indicators
- Premium play button with expanding rings
- Focus-managed modal dialogs

---

## 📦 Project Structure

```
src/
├── components/
│   ├── lucidflow/          # Feature components
│   ├── motion/             # Reusable animation utilities
│   └── video/              # Premium video player
├── pages/                  # Page components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and helpers
├── services/               # API integrations
├── data/                   # Content configuration
└── styles/                 # Global styles

public/
├── images/                 # Hero image, video poster
├── videos/                 # Product video (ready for upload)
└── documents/              # Downloadable resources
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/harir2002/Lucidflow-Website.git
cd lucidflow-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

---

## 🎬 Video Implementation

The website includes a premium video player ready for your product video.

### Prepare Your Video

1. **MP4 Specifications:**
   - Codec: H.264
   - Resolution: 1920 × 1080 (16:9)
   - Duration: ~60 seconds
   - File size: 8–12 MB
   - Audio: Optional (silent recommended)

2. **Create Poster Images:**
   - **WebP** (primary): 1920 × 1080, < 200 KB
   - **PNG** (fallback): 1280 × 720 or 1920 × 1080

3. **Upload to Public Folder:**
   ```
   public/
   ├── videos/
   │   └── lucidflow-product-overview.mp4
   └── images/
       ├── lucidflow-video-poster.webp
       └── lucidflow-video-poster.png
   ```

**That's it!** The video player auto-activates with full analytics tracking.

---

## 📊 Features Delivered

### ✅ Completed Enhancements

| Feature | Status | Details |
|---------|--------|---------|
| Hero Parallax | ✅ | Desktop scroll/cursor-based movement |
| Journey Lines | ✅ | Animated SVG paths with pulsing nodes |
| Scroll Reveals | ✅ | Staggered component animations |
| Journey Map | ✅ | Animated flow with traveling highlights |
| Capability Cards | ✅ | Icon animations and hover effects |
| How It Works | ✅ | Line draw + staggered step reveals |
| Engagement Models | ✅ | Uniform boxes with scroll reveal |
| FAQ Accordion | ✅ | Smooth transitions with indicators |
| Final CTA | ✅ | Journey line animation + state transitions |
| Video Player | ✅ | Premium modal with analytics |
| Global Depth | ✅ | Subtle grain texture + decorative elements |
| Accessibility | ✅ | Full WCAG 2.1 AA compliance |
| Mobile Responsive | ✅ | All breakpoints optimized |
| Reduced Motion | ✅ | All animations respect `prefers-reduced-motion` |

---

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px – 1024px
- **Desktop:** 1024px+
- **Large Desktop:** 1280px+

All animations automatically adapt to screen size and user preferences.

---

## ♿ Accessibility

- ✅ WCAG 2.1 Level AA compliant
- ✅ Full keyboard navigation
- ✅ Screen reader optimized with ARIA labels
- ✅ Focus management in modals
- ✅ High contrast ratios
- ✅ `prefers-reduced-motion` support
- ✅ Semantic HTML structure

---

## 📊 Analytics Integration

### Tracked Events

```
✓ lucidflow_cta_click        - Button clicks
✓ lucidflow_form_open        - Form visibility
✓ lucidflow_form_submit      - Form submissions
✓ lucidflow_video_open       - Video player opened
✓ lucidflow_video_play       - Video playback started
✓ lucidflow_video_progress   - Video milestones (25%, 50%, 75%)
✓ lucidflow_video_complete   - Video finished
✓ lucidflow_video_fallback   - Fallback to enquiry form
```

---

## 🎯 Performance

### Bundle Size (Gzipped)
- CSS: 7.20 kB
- JavaScript: 23.02 kB
- React Vendor: 52.61 kB
- Total: ~82 kB

### Optimization
- ✅ CSS transforms for 60fps animations
- ✅ Lazy video loading (metadata only)
- ✅ No layout-affecting animations
- ✅ Optimized SVG graphics
- ✅ Minimal decorative assets

---

## 🔐 Security & Best Practices

- ✅ Environment variables for sensitive data
- ✅ No hardcoded API keys or credentials
- ✅ XSS protection with React's built-in sanitization
- ✅ CSRF tokens for form submissions
- ✅ HTTPS ready
- ✅ Content Security Policy compatible

---

## 📝 Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_GA_MEASUREMENT_ID=your_ga_id_here
VITE_API_ENDPOINT=https://api.example.com
```

See `.env.example` for all available options.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 About SBA Info Solutions

LucidFlow is built by **SBA Info Solutions**, specializing in digital journey compliance and dark-pattern detection for financial services.

**Website:** [SBA Info Solutions](https://www.sbainformation.co.uk)

---

## � Getting Started

Follow the setup and deployment guides above.

---

## 🎉 Credits

**Crafted with ❤️ by the LucidFlow Team**

- Premium motion design and animations
- Accessible, responsive component system
- Enterprise-grade video player implementation
- Comprehensive analytics integration

---

<div align="center">

**Make compliance visible across every customer journey.**

[![GitHub Stars](https://img.shields.io/github/stars/harir2002/Lucidflow-Website?style=social)](https://github.com/harir2002/Lucidflow-Website)

</div>
