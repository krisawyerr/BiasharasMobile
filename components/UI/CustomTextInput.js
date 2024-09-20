import { StyleSheet, TextInput } from "react-native";
import { GlobalColors } from "../../constants/colors";

export default function CustomTextInput({value, onChangeText, placeholder, halfWidth, password}) {
    return (
        <TextInput style={[styles.formInput, {borderBottomColor: value.isFilled ? GlobalColors.colors.primary400 : 'red', flex: halfWidth && 1,}]} value={value.value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={value.isFilled ? GlobalColors.colors.primary400 : "red"} secureTextEntry={password}/>
    )
}

const styles = StyleSheet.create({
    formInput: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: GlobalColors.colors.primary900,
        marginVertical: 15
    },
})
