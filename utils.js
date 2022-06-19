const palette = {
  tealGreen: "#128c7e",
  tealGreenDark: "#075e54",
  green: "#25d366",
  lime: "#dcf8c6",
  skyblue: "#34b7f1",
  smokeWhite: "#ece5dd",
  white: "white",
  gray: "#3C3C3C",
  lightGray: "#757575",
  iconGray: "#717171",
};

const lightTheme = {
  colors: {
    background: palette.smokeWhite,
    foreground: palette.tealGreenDark,
    primary: palette.tealGreen,
    tertiary: palette.lime,
    secondary: palette.green,
    white: palette.white,
    text: palette.gray,
    secondaryText: palette.lightGray,
    iconGray: palette.iconGray,
  },
  icons: {
    chatBg: require("./assets/icons/chatbg.png"),
    square: require("./assets/icons/icon-square.png"),
    user: require("./assets/icons/user-icon.png"),
    welcome: require("./assets/icons/welcome-img.png"),
  },
};

const darkTheme = {
  colors: {
    background: palette.smokeWhite,
    foreground: palette.tealGreenDark,
    primary: palette.tealGreen,
    tertiary: palette.lime,
    secondary: palette.green,
    white: palette.white,
    text: palette.gray,
    secondaryText: palette.lightGray,
    iconGray: palette.iconGray,
  },
  icons: {
    chatBg: require("./assets/icons/chatbg.png"),
    square: require("./assets/icons/icon-square.png"),
    user: require("./assets/icons/user-icon.png"),
    welcome: require("./assets/icons/welcome-img.png"),
  },
};

export const theme = {
  lightTheme,
  darkTheme,
};
