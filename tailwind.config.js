import tailwindcssAnimate from "tailwindcss-animate";
import  {fontFamily} from "tailwindcss/defaultTheme"
import tailwindScrollbarHide from "tailwind-scrollbar-hide";
import tailwindScrollbar from "tailwind-scrollbar";
/** @type {import('tailwindcss').Config} */

export default{
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
      backgroundImage: {
        'time-attack-main': "url('./assets/images/time_attack_bg_1.png')",
        'time-attack-sub': "url('./assets/images/time_attack_bg_2.png')",
        'time-attack-card': "url('./assets/images/time_attack_card_front.png')",

      },
      colors: {
        'oneit-pink': '#ffa0a0',
        'oneit-navy': '#1B3F87',
        'oneit-blue': '#A1DBFF',
        'oneit-orange': '#FFD070',
        'oneit-gray': '#4A4A4A',
        'kakao-yellow': '#FEE500',
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
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        pre: ["Pretendard"],
        Bayon:["Bayon"],
        Yangjin:["Yangjin"],
        Godo : ["Godo"],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'custom-pink': '#ff4bc1',
        'custom-red': '#ff4341',
      }),
    },
  },
  plugins: [tailwindcssAnimate,tailwindScrollbarHide,tailwindScrollbar],
}
