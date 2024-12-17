/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js, ts, tsx, jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textColor: {
        primary: "#1C274C",
        secondary: "#4529FA",
        tertiary: "#A9ADBB",
        white: "#ffffff",
        label: "#3A4363",
        darkPrimary: "#E4E5EA",
        darkLabel: "#848A9E",
        white87: "#ffffffde",
      },
      backgroundColor: {
        primary: "#F6F8FA",
        secondary: "#FAFAFF",
        white: "#ffffff",
        message: "#FDFDFF",
        light: "#F5F5FF",
        error: "#F3E4E4",
        info: "#EBF1FB",
        success: "#F7FCF7",
        onboarding: "#EFEFEF",
        lightProject: "#fbfbfc",
        // dark mode colors
        darkPrimary: "#17181A",
        darkSecondary: "#2A3145",
        darkChatBox: "#131314",
        darkCanvas: "#0F0F10",
        darkMutedPurple: "#745FFB",
        darkTextArea: "#191B1D",
        darkBotPrimary: "#2C2C2D",
        darkSelected: "#F2F3F4",
        darkPopup: "#1b1c1f",
        white12: "#ffffff1e",
        darkProject: "#171719",
      },
      borderColor: {
        lightBorder: "#E4E5EA",
        darkPrimary: "#353638",
        darkGrey: "#0F152B",
      },
      screens: {
        // sm: '48rem', // min-width:320px use this selector for mobile screens or use nothing
        md: "48rem", // min-width:360px use this selector for tablet screens
        lg: "80rem", // min-width:768px use this selector for pc screens
        // xl: '85.375rem', // min-width:1366px use this selector for large screens
      },
    },
  },
  plugins: [],
};
