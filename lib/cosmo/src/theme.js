/* @flow */

const hexToRgbArray = (hex: string): number[] => {
  // modified from: https://stackoverflow.com/a/5624139/2122060
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // expand three-digit hex
  const newHex = hex.replace(
    shorthandRegex,
    (m, r, g, b) => r + r + g + g + b + b
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex) || []; // bad fallback?
  const [, r, g, b] = result; // ignores first array item
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
};

type Alpha = 0.08 | 0.16 | 0.4 | 0.64 | 0.72 | 1.0;
const hexToRgbString = (hex: string, alpha?: Alpha): string => {
  const [r, g, b] = hexToRgbArray(hex);
  return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgba(${r}, ${g}, ${b})`;
};

type Mode = ?"dark";
export function getTheme(theme: Object, mode: Mode = null) {
  const newTheme = { ...theme };
  Object.keys(theme).forEach((key) => {
    if (theme[key].modes && mode) {
      // $FlowFixMe - theme[key] definitely has a "modes" property
      const staticValues = { ...theme[key] };
      delete staticValues.modes;
      // $FlowFixMe - theme[key] definitely has a "modes" property
      const modeValues = theme[key].modes[mode];
      newTheme[key] = {
        ...staticValues,
        ...modeValues, // override static keys
      };
    }
  });
  return newTheme;
}

// this pre-migration object should eventually be replaced with the post-migration array below
// const fontSizes: string[] = ['10px', '12px', '14px', '16px', '20px', '24px', '32px', '40px']
const fontSizes = {
  xxs: "10px",
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  xxl: "32px",
  xxxl: "40px",
};

// this pre-migration object should eventually be replaced with the post-migration array below
// const fontWeights: number[] = [400, 600, 800]
const fontWeights = {
  normal: 400,
  semibold: 600,
  bold: 800,
};

// this pre-migration object should eventually be replaced with the post-migration array below
// const letterSpacings: number[] = ["-0.80px", "-0.40px", "-0.32px", "-0.24px", "-0.16px", "-0.08px", "0px", "0.08px", "0.80px", "1.60px"]
const letterSpacings = {
  xxxxxs: "-0.80px",
  xxxxs: "-0.40px",
  xxxs: "-0.32px",
  xxs: "-0.24px",
  xs: "-0.16px",
  sm: "-0.08px",
  md: "0px",
  lg: "0.08px",
  xl: "0.80px",
  xxl: "1.60px",
};

const fonts = {
  // TODO: apply fonts.sans by default in global styles
  sans:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  mono:
    "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
};

const breakpoints: string[] = ["500px", "750px", "1000px"];

// this pre-migration object should eventually be replaced with the post-migration array below
// const space: number[] = [0, 4, 8, 16, 24, 40, 80]
const space = {
  xxs: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 80,
};

const sizes = space;

const shadows = {
  sm: `0px 0px ${space.sm}px rgba(0, 0, 0, 0.16)`,
  lg: `0px 0px ${space.md}px rgba(0, 0, 0, 0.16)`,
  modes: {
    dark: {
      sm: `0px 0px ${space.sm}px rgba(0, 0, 0, 0.64)`,
      lg: `0px 0px ${space.md}px rgba(0, 0, 0, 0.64)`,
    },
    // fastly is the same as default
    fastly: {
      sm: `0px 0px ${space.sm}px rgba(0, 0, 0, 0.16)`,
      lg: `0px 0px ${space.md}px rgba(0, 0, 0, 0.16)`,
    },
    // fastlyDark is the same as dark
    fastlyDark: {
      sm: `0px 0px ${space.sm}px rgba(0, 0, 0, 0.64)`,
      lg: `0px 0px ${space.md}px rgba(0, 0, 0, 0.64)`,
    },
  },
};

const fastlyGrays: string[] = [
  "#F2F5F7", // 0
  "#E7EBEF", // 1
  "#BCC3C8", // 2
  "#A1AAB1", // 3
  "#869299", // 4
  "#50606A", // 5
  "#384248", // 6
  "#354753", // 7
  "#0E1A21", // 8
];

const reversedFastlyGrays: string[] = [...fastlyGrays].reverse();

const grays: string[] = [
  "#FFFFFF", // 0
  "#F2F4F7", // 1
  "#D7DAE0", // 2
  "#969AA3", // 3
  "#626A7A", // 4
  "#414752", // 5
  "#272B33", // 6
  "#1C2029", // 7
  "#18181A", // 8
];

const reversedGrays: string[] = [...grays].reverse();

const borders = {
  light: `1px solid ${grays[2]}`,
  regular: `1px solid ${grays[3]}`,
  heavy: `2px solid ${grays[6]}`,
  modes: {
    dark: {
      light: `1px solid ${reversedGrays[2]}`,
      regular: `1px solid ${reversedGrays[3]}`,
      heavy: `2px solid ${reversedGrays[6]}`,
    },
    // fastly is the same as default
    fastly: {
      light: `1px solid ${fastlyGrays[2]}`,
      regular: `1px solid ${fastlyGrays[3]}`,
      heavy: `2px solid ${fastlyGrays[6]}`,
    },
    // fastlyDark is the same as dark
    fastlyDark: {
      light: `1px solid ${reversedFastlyGrays[2]}`,
      regular: `1px solid ${reversedFastlyGrays[3]}`,
      heavy: `2px solid ${reversedFastlyGrays[6]}`,
    },
  },
};

// this pre-migration object should eventually be replaced with the post-migration array below
// const radii = [3, 4, 8]
const radii = {
  sm: 3,
  md: 4,
  lg: 8,
};

const zIndices = {
  popover: 2000,
};

const opacity = [0.08, 0.16, 0.4, 0.64, 0.72, 1.0];

const theme = {
  borders,
  borderWidth: space,
  breakpoints,
  colors: {
    ash: hexToRgbString("#999999"),
    ashes: [
      hexToRgbString("#999999", 0.08),
      hexToRgbString("#999999", 0.16),
      hexToRgbString("#999999", 0.4),
      hexToRgbString("#999999", 0.64),
      hexToRgbString("#999999", 0.72),
      hexToRgbString("#999999", 1.0),
    ],
    blue: hexToRgbString("#17A4EB"),
    blues: [
      hexToRgbString("#17A4EB", 0.08),
      hexToRgbString("#17A4EB", 0.16),
      hexToRgbString("#17A4EB", 0.4),
      hexToRgbString("#17A4EB", 0.64),
      hexToRgbString("#17A4EB", 0.72),
      hexToRgbString("#17A4EB", 1.0),
    ],
    gold: hexToRgbString("#FFC524"),
    golds: [
      hexToRgbString("#FFC524", 0.08),
      hexToRgbString("#FFC524", 0.16),
      hexToRgbString("#FFC524", 0.4),
      hexToRgbString("#FFC524", 0.64),
      hexToRgbString("#FFC524", 0.72),
      hexToRgbString("#FFC524", 1.0),
    ],
    green: hexToRgbString("#5CE58A"),
    greens: [
      hexToRgbString("#5CE58A", 0.08),
      hexToRgbString("#5CE58A", 0.16),
      hexToRgbString("#5CE58A", 0.4),
      hexToRgbString("#5CE58A", 0.64),
      hexToRgbString("#5CE58A", 0.72),
      hexToRgbString("#5CE58A", 1.0),
    ],
    indigo: hexToRgbString("#6649F5"),
    indigos: [
      hexToRgbString("#6649F5", 0.08),
      hexToRgbString("#6649F5", 0.16),
      hexToRgbString("#6649F5", 0.4),
      hexToRgbString("#6649F5", 0.64),
      hexToRgbString("#6649F5", 0.72),
      hexToRgbString("#6649F5", 1.0),
    ],
    orange: hexToRgbString("#F28A00"),
    oranges: [
      hexToRgbString("#F28A00", 0.08),
      hexToRgbString("#F28A00", 0.16),
      hexToRgbString("#F28A00", 0.4),
      hexToRgbString("#F28A00", 0.64),
      hexToRgbString("#F28A00", 0.72),
      hexToRgbString("#F28A00", 1.0),
    ],
    purple: hexToRgbString("#B044E5"),
    purples: [
      hexToRgbString("#B044E5", 0.08),
      hexToRgbString("#B044E5", 0.16),
      hexToRgbString("#B044E5", 0.4),
      hexToRgbString("#B044E5", 0.64),
      hexToRgbString("#B044E5", 0.72),
      hexToRgbString("#B044E5", 1.0),
    ],
    red: hexToRgbString("#F46049"),
    reds: [
      hexToRgbString("#F46049", 0.08),
      hexToRgbString("#F46049", 0.16),
      hexToRgbString("#F46049", 0.4),
      hexToRgbString("#F46049", 0.64),
      hexToRgbString("#F46049", 0.72),
      hexToRgbString("#F46049", 1.0),
    ],
    grays,
    charts: [
      "#6649F5", // indigo
      "#5DDAEB", // teal
      "#FAD418", // yellow
      "#8FCC14", // lime
      "#EA80FF", // pink
      "#999999", // ash
    ],
    modes: {
      dark: {
        grays: reversedGrays,
      },
      fastlyLight: {
        grays: fastlyGrays,
        charts: [
          "#0d7499", // blue
          "#2adeb0", // green
          "#f7be9e", // peach
          "#9bc3bf", // seafoam
          "#ff2a2d", // red
        ],
      },
      fastlyDark: {
        grays: reversedFastlyGrays,
        charts: [
          "#0d7499", // blue
          "#2adeb0", // green
          "#f7be9e", // peach
          "#9bc3bf", // seafoam
          "#ff2a2d", // red
        ],
      },
    },
  },
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  radii,
  shadows,
  sizes,
  space,
  opacity,
  zIndices,
};

export default theme;
