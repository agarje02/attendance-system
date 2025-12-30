# Attendify - Attendance Management System Frontend

A modern, professional landing page for the Attendify attendance management system built with Next.js 14, Tailwind CSS, shadcn/ui, Framer Motion, and Zustand.

## 🚀 Features

- **Modern UI/UX**: Clean, professional design with a light theme using blue/white color palette
- **Responsive Design**: Fully responsive across all device sizes
- **Smooth Animations**: Beautiful animations powered by Framer Motion
- **State Management**: Zustand for lightweight, efficient state management
- **Component Library**: shadcn/ui inspired components with CVA for variants
- **Performance Optimized**: Next.js 14 with App Router for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 Installation

1. Navigate to the frontend directory:
   ```bash
   cd attendance-system/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles & Tailwind directives
│   │   ├── layout.tsx       # Root layout with metadata
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx   # shadcn/ui Button component
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Logo.tsx         # Brand logo
│   │   ├── HeroSection.tsx  # Hero section with dashboard preview
│   │   ├── FeaturesSection.tsx # Features grid
│   │   ├── AboutSection.tsx # About & company values
│   │   ├── TestimonialsSection.tsx # Customer testimonials
│   │   ├── CTASection.tsx   # Call-to-action with pricing
│   │   └── Footer.tsx       # Site footer
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn)
│   └── store/
│       └── useStore.ts      # Zustand store
├── tailwind.config.ts       # Tailwind configuration with custom theme
├── package.json
└── tsconfig.json
```

## 🎨 Color Palette

The design uses a carefully crafted color palette based on the logo:

- **Primary Blue**: `#4FACFE` - Main brand color
- **Accent Cyan**: `#00F2FE` - Gradient accent
- **Success Green**: `#2AF598` - Success states & checkmarks
- **Background**: Pure white with subtle gray tints
- **Foreground**: Dark slate for text

## 🔧 Configuration

### Tailwind Config

The `tailwind.config.ts` includes:
- Custom color palette matching the logo
- Extended animations (float, fade-in, slide-up)
- Custom shadows (soft, glow, card)
- Gradient backgrounds
- Container configuration

### State Management

Zustand store (`src/store/useStore.ts`) manages:
- Navigation state (menu open/closed)
- Modal states (login/signup)
- Scroll state for navbar
- User authentication state (for future implementation)

## 🚢 Deployment

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

The app is ready to be deployed on Vercel, Netlify, or any other hosting platform.

## 📝 License

MIT License - feel free to use this for your projects!
