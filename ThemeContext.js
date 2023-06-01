import React, { createContext } from "react";
import { Appearance } from "react-native";

const defaultMode = Appearance.getColorScheme();

export default ThemeContext = createContext({
  theme: defaultMode,
});
