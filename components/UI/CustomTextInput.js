import AnimatedInputPlaceholder from "./AnimatedInputPlaceholder";
import React from 'react';
import { StyleSheet, TextInput, View, InputAccessoryView, Platform, Keyboard, Pressable, Text } from 'react-native';
import { GlobalColors } from "../../constants/colors";

export default function CustomTextInput({ value, onChangeText, placeholder, halfWidth, password, keyboardType, multiline }) {
    const inputAccessoryViewID = 'uniqueID';

    return (
        <View style={[styles.rootContainer, {flex: halfWidth && 1 }]}>
            {value.value && <AnimatedInputPlaceholder placeholderText={placeholder} value={value} />}
            <TextInput style={[ styles.formInput, { borderBottomColor: value.isFilled ? GlobalColors.colors.primary400 : 'red'}]} multiline={multiline} value={value.value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={value.isFilled ? GlobalColors.colors.primary400 : "red"} secureTextEntry={password} keyboardType={keyboardType} returnKeyType="done" blurOnSubmit={true} inputAccessoryViewID={Platform.OS === 'ios' && keyboardType === "number-pad" ? inputAccessoryViewID : undefined}/>
            {Platform.OS === 'ios' && keyboardType === "number-pad" && (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.accessory}>
                        <Pressable onPress={() => Keyboard.dismiss()}>
                            <Text style={styles.accessoryText}>Done</Text>
                        </Pressable>
                    </View>
                </InputAccessoryView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        marginVertical: 15
    },
    formInput: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: GlobalColors.colors.primary900,
    },
    accessory: {
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    accessoryText: {
        color: "#007aff",
        fontWeight: "600",
        fontSize: 17
    },
});
