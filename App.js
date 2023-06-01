import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import AppLightTheme from "./AppLightTheme";
import AppDarkTheme from "./AppDarkTheme";
import ThemeContext from "./ThemeContext";
import { useState } from "react";
import Main from "./Main";

export default function App() {
  // useColorSheme 는 dark, light 값을 리턴한다.
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState(colorScheme);
  const themeDate = { theme, setTheme };

  return (
    <ThemeContext.Provider value={themeDate}>
      <NavigationContainer
        theme={colorScheme === "light" ? AppLightTheme : AppDarkTheme}
      >
        <Main />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
