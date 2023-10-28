import { type Config } from "tailwindcss";
// re-import the following if adding custom fonts for use
// import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"),require("daisyui")],
} satisfies Config;