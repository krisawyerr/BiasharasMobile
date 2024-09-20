import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { GlobalColors } from "../../constants/colors"
import SignUpForm from "./SignUpForm"
import LogInForm from "./LogInForm"

export default function SignInAndUpLayout({navigation, type}) {
  const isLogin = type === "login"

  return (
    <View style={styles.rootView}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
        <SafeAreaView style={styles.safeAreaView}>
          <Text style={styles.logo}>Biasharas</Text>
          {isLogin ? <LogInForm /> : <SignUpForm />}
          <View>
            <View style={styles.goToLoginContainer}>
              <Text style={styles.goToLoginText}>{isLogin ? 'Dont have an account?' : 'Already have an account?'}</Text>
              <Pressable onPress={() => {isLogin ? navigation.replace("signup") : navigation.replace("login")}}>
                <Text style={styles.goToLoginButton}>{isLogin ? 'Sign up' : 'Log in'}</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  rootView: {
    backgroundColor: GlobalColors.colors.primary200,
    flex: 1,
    paddingHorizontal: 25
  },
  safeAreaView: {
    flex: 1,
    justifyContent: "space-between"
  },
  logo: {
    fontFamily: "TitanOne",
    color: GlobalColors.colors.primary900,
    fontSize: 40,
    textAlign: "center"
  },
  goToLoginContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  goToLoginText: {
    color: GlobalColors.colors.primary800,
    fontSize: 17,
    marginRight: 10
  },
  goToLoginButton: {
    color: GlobalColors.colors.primary400,
    fontSize: 17
  },
})