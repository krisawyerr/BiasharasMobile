import { StyleSheet, Text, TextInput, View } from "react-native";
import { GlobalColors } from "../../constants/colors";

export default function CustomTextInput({ value, onChangeText, placeholder, halfWidth, password, keyboardType }) {
    return (
        <View style={styles.rootContainer}>
            {value.value && <Text style={{color: value.isFilled ? GlobalColors.colors.primary400 : "red"}}>{placeholder}</Text>}
            <TextInput
                style={[styles.formInput, { borderBottomColor: value.isFilled ? GlobalColors.colors.primary400 : 'red', flex: halfWidth && 1 }]}
                value={value.value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={value.isFilled ? GlobalColors.colors.primary400 : "red"}
                secureTextEntry={password}
                keyboardType={keyboardType}
            />
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
});
