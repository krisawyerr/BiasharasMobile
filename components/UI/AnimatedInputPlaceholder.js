import { StyleSheet, Animated } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { useEffect, useRef } from "react";

export default function AnimatedInputPlaceholder({ placeholderText, value }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (value.value) {
            Animated.timing(fadeAnim, { toValue: 1,  duration: 500, useNativeDriver: true}).start();
        } else {
            Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true}).start();
        }
    }, [value.value]);

    return (
        <Animated.Text style={{ ...styles.placeholderText, color: value.isFilled ? GlobalColors.colors.primary400 : "red", opacity: fadeAnim}}>
            {placeholderText}
        </Animated.Text>
    );
}

const styles = StyleSheet.create({
    placeholderText: {
        fontSize: 14,
        marginBottom: 5,
    },
});
