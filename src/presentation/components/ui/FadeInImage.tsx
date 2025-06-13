/* eslint-disable prettier/prettier */
/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ImageStyle,
    StyleProp,
    View,
} from 'react-native';
import { useAnimation } from '../../hooks/useAnimation';

interface Props {
    uri: string;
    style?: StyleProp<ImageStyle>;
}

export const FadeInImage = ({ uri, style }: Props) => {
    const { animatedOpacity, fadeIn } = useAnimation();
    const [isLoading, setIsLoading] = useState(true);

    const isDisposed = useRef(false); //useRef no hace un rerender del componente si no que es una variable que persiste

    useEffect(() => {
        return () => {
            isDisposed.current = true;
        };
    }, []);

    const onLoadEnd = () => {
        if (isDisposed.current) return;
        fadeIn({});
        setIsLoading(false);
    };


    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {isLoading && (
                <ActivityIndicator
                    style={{ position: 'absolute' }}
                    color="grey"
                    size={30}
                />
            )}

            <Animated.Image
                source={{ uri }}
                onLoadEnd={onLoadEnd}
                style={[style, { opacity: animatedOpacity, resizeMode: 'contain' }]}
            />
        </View>
    );
};
