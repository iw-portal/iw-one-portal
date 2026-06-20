export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["animate-infinite-scroll"],
  theme: {
    extend: {
      scrollBehavior: ["smooth"],
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }, // 🔥 THIS IS THE FIX
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
