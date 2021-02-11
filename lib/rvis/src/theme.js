/* @flow */

// theme specification: https://system-ui.com/theme

const theme = {
  fonts: {
    sans:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    mono:
      "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
  },
  space: {
    small: 8,
    large: 40,
  },
  colors: {
    text: "#000", // black
    background: "#fff", // white
    muted: "#d7dae0", // gray
    charts: [
      "#6649F5", // indigo
      "#5DDAEB", // teal
      "#FAD418", // yellow
      "#8FCC14", // lime
      "#EA80FF", // pink
      "#999999", // ash
    ],
  },
};

export default theme;
