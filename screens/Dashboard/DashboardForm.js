import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { useState } from "react";
import CustomTextInput from "../../components/UI/CustomTextInput";

export default function DashboardForm() {
    const [email, setEmail] = useState({ value: '', isFilled: true })

    return (
        <View style={styles.rootView}>
            <CustomTextInput value={email} onChangeText={(e) => setEmail({ value: e, isFilled: true })} placeholder="Enter Email"/>
        </View>
    )
}

const styles = StyleSheet.create({
    rootView: {
        backgroundColor: GlobalColors.colors.primary100,
        flex: 1,
        paddingHorizontal: 25
    },
    formInput: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: GlobalColors.colors.primary900,
        marginVertical: 15
    },
})