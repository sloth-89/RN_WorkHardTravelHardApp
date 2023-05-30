import { DarkTheme } from "@react-navigation/native";

// 다크테마 활성 시 컴포넌트

const AppDarkTheme = {
    ...DarkTheme,
    dark: false,
    colors: {
        ...DarkTheme.colors,
        text: '#dadada',
        card: '#191919',
        border: '#444859',
        primary: '#f9f9f9',
        background: '#121212',
    }
}

export default AppDarkTheme;