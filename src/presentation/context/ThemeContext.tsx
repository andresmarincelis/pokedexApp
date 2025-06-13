/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { createContext, PropsWithChildren, useContext } from 'react';

import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';


import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

interface Props {
    theme: any;
    isDark: any;
    setTheme?: any;
}

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

export const ThemeContext = createContext<Props>({
    isDark: false,
    theme: LightTheme,
});

export const ThemeContextProvider = ({ children }: PropsWithChildren) => {

    // const [colorScheme, setColorScheme] = useState<'dark' | 'light'>('dark');

    // const setTheme = () => {
    //     setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    // };


    const colorScheme = useColorScheme();

    const isDark = colorScheme === 'dark';
    const theme = isDark ? DarkTheme : LightTheme;

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <ThemeContext.Provider
                    value={{
                        isDark,
                        theme,
                        // setTheme,
                    }}>
                    {children}
                </ThemeContext.Provider>
            </NavigationContainer>
        </PaperProvider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);


