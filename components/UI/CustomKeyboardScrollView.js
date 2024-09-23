import { StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import { GlobalColors } from "../../constants/colors";

export default function CustomKeyboardScrollView({children}) {
    return (
        <KeyboardAvoidingView style={styles.rootView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    rootView: {
        backgroundColor: GlobalColors.colors.primary100,
        flex: 1,
        paddingHorizontal: 25,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingVertical: 10,
    },
});
