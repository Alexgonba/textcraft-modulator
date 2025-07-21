
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        "border-hover": "hsl(var(--border-hover))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          muted: "hsl(var(--primary-muted))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
          muted: "hsl(var(--accent-muted))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        editor: {
          bg: "hsl(var(--editor-bg))",
          text: "hsl(var(--editor-text))",
          muted: "hsl(var(--editor-muted))",
          border: "hsl(var(--editor-border))",
          active: "hsl(var(--editor-active))",
          hover: "hsl(var(--editor-hover))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-subtle': 'var(--gradient-subtle)',
        'gradient-muted': 'var(--gradient-muted)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      keyframes: {
        // Core Animations
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        
        // Fade Animations
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(8px)" },
        },
        
        // Scale Animations
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.96)" },
        },
        
        // Slide Animations
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        
        // Interactive Animations
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        
        // Menu Animations
        "menu-open": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(-8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "menu-close": {
          "0%": { opacity: "1", transform: "scale(1) translateY(0)" },
          "100%": { opacity: "0", transform: "scale(0.96) translateY(-8px)" },
        },
      },
      animation: {
        // Enhanced Core Animations
        "accordion-down": "accordion-down 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Fade Animations
        "fade-in": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fade-out 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Scale Animations  
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-out": "scale-out 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Slide Animations
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left": "slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right": "slide-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Interactive Animations
        "shimmer": "shimmer 2s infinite",
        "pulse-subtle": "pulse-subtle 2s infinite",
        "bounce-subtle": "bounce-subtle 1s infinite",
        
        // Menu Animations
        "menu-open": "menu-open 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "menu-close": "menu-close 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Combined Animations
        "enter": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1), scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "exit": "fade-out 0.3s cubic-bezier(0.16, 1, 0.3, 1), scale-out 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
