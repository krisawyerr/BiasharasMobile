import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function CustomButton({onPress, backgroundColor, color, marginHorizontal, title, halfWidth}) {
    return (
        <Pressable onPress={onPress} style={{flex: halfWidth && 1 }}>
            <View style={[styles.rootView, {backgroundColor: backgroundColor, marginHorizontal: marginHorizontal}]}>
                <Text style={{color: color, textAlign: 'center'}}>{title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    rootView: {
        height: 40,
        borderRadius: 4,
        alignContent: "center", 
        justifyContent: "center"
    }
})