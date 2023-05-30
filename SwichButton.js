import React, { useContext, useState } from "react";
import { Switch, View, useColorScheme } from "react-native";
import ThemeContext from "./ThemeContext";

export default function SwitchButton(){
    const colorScheme = useColorScheme();

    const {theme, setTheme} = useContext(ThemeContext);
    const [isEnable, setIsEnable] = useState(false);

    const toggleSwitch = () => {
        setIsEnable(prevState => !prevState);
        setTheme(() => setTheme(theme === 'light' ? 'dark' : 'light'));
    }

    return(
        <View style={{marginTop: 20}}>
            <Switch
                value={isEnable}
                onValueChange={toggleSwitch}
                disabled={colorScheme === 'dark'}
            />
        </View>
    )
}