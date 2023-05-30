import { DefaultTheme } from "@react-navigation/native";

// 라이트테마(기본테마) 시 컴포넌트

const AppLightTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        text: '#616161',
        card: '#f9f9f9',
        border: '#9f9f9f',
        primary: '#333333',
        background: '#ffffff',
    }
}

export default AppLightTheme;