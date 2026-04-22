/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",  // Scan all files in src
//   ],
//   theme: {
//     container: {
//       center: true,
//       padding: '1rem',
//       screens: {
//         sm: '640px',
//         md: '768px',
//         lg: '1024px',
//         xl: '1280px',
//         '2xl': '1400px',
//       },
//     },
//     extend: {
//       colors: {
//         // Primary brand colors
//         primary: {
//           50: '#f0fdf4',
//           100: '#dcfce7',
//           200: '#bbf7d0',
//           300: '#86efac',
//           400: '#4ade80',
//           500: '#22c55e',
//           600: '#16a34a',
//           700: '#15803d',
//           800: '#166534',
//           900: '#14532d',
//         },
//         // Secondary brand colors
//         secondary: {
//           50: '#eff6ff',
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3b82f6',
//           600: '#2563eb',
//           700: '#1d4ed8',
//           800: '#1e40af',
//           900: '#1e3a8a',
//         },
//         // Additional colors
//         success: {
//           50: '#f0fdf4',
//           500: '#22c55e',
//           600: '#16a34a',
//         },
//         warning: {
//           50: '#fefce8',
//           500: '#eab308',
//           600: '#ca8a04',
//         },
//         danger: {
//           50: '#fef2f2',
//           500: '#ef4444',
//           600: '#dc2626',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//         display: ['Poppins', 'sans-serif'],
//       },
//       spacing: {
//         '18': '4.5rem',
//         '88': '22rem',
//         '128': '32rem',
//         '144': '36rem',
//       },
//       borderRadius: {
//         '4xl': '2rem',
//         '5xl': '2.5rem',
//       },
//       animation: {
//         'fade-in': 'fadeIn 0.5s ease-in-out',
//         'slide-up': 'slideUp 0.3s ease-out',
//         'slide-down': 'slideDown 0.3s ease-out',
//         'slide-in-right': 'slideInRight 0.3s ease-out',
//         'bounce-slow': 'bounce 2s infinite',
//         'pulse-slow': 'pulse 3s infinite',
//         'spin-slow': 'spin 3s linear infinite',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(10px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideDown: {
//           '0%': { transform: 'translateY(-10px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideInRight: {
//           '0%': { transform: 'translateX(-10px)', opacity: '0' },
//           '100%': { transform: 'translateX(0)', opacity: '1' },
//         },
//       },
//       boxShadow: {
//         'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
//         'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//         'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 20px -15px rgba(0, 0, 0, 0.1)',
//         'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
//         'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//         'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//       },
//       transitionDuration: {
//         '250': '250ms',
//         '400': '400ms',
//         '600': '600ms',
//       },
//       zIndex: {
//         '60': '60',
//         '70': '70',
//         '80': '80',
//         '90': '90',
//         '100': '100',
//       },
//       backdropBlur: {
//         xs: '2px',
//       },
//       backgroundImage: {
//         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//         'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
//         'gradient-green-blue': 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
//         'gradient-blue-green': 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
//         'gradient-dark': 'linear-gradient(135deg, #14532d 0%, #1e3a8a 100%)',
//       },
//       screens: {
//         'xs': '475px',
//         '3xl': '1600px',
//         '4xl': '1920px',
//       },
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shine: "shine 1.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        blob: "blob 10s infinite",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0,0,0,.07)",
        medium: "0 4px 25px -5px rgba(0,0,0,.1)",
        strong: "0 10px 40px -10px rgba(0,0,0,.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
