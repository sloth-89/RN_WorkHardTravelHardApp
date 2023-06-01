import React, { useContext, useState } from "react";
import { Switch, View, useColorScheme } from "react-native";
import ThemeContext from "./ThemeContext";

const SwitchButton = () => {
  const colorScheme = useColorScheme();

  const { theme, setTheme } = useContext(ThemeContext);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((prevState) => !prevState);
    setTheme(() => setTheme(theme === "light" ? "dark" : "light"));
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        disabled={colorScheme === "dark"}
      />
    </View>
  );
};

export default SwitchButton;
