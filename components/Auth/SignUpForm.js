import { useContext, useState } from "react"
import { AuthContext } from "../../context/auth"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { authUser } from "../../utils/auth"
import { GlobalColors } from "../../constants/colors"
import CustomButton from "../UI/CustomButton"
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignUpForm() {
  const authContext = useContext(AuthContext)
  const [fname, setFname] = useState({ value: '', isFilled: true })
  const [lname, setLname] = useState({ value: '', isFilled: true })
  const [email, setEmail] = useState({ value: '', isFilled: true })
  const [password, setPassword] = useState({ value: '', isFilled: true })
  const [passwordConfirmed, setPasswordConfirmed] = useState({ value: '', isFilled: true })
  const [error, setError] = useState()

  async function signUp() {
    if (email.value.length === 0 || password.value.length === 0 || passwordConfirmed.value.length === 0 || fname.value.length === 0 || lname.value.length === 0) {
      if (fname.value.length === 0) {
        setFname({ value: '', isFilled: false })
      } 
      if (lname.value.length === 0) {
        setLname({ value: '', isFilled: false })
      }
      if (email.value.length === 0) {
        setEmail({ value: '', isFilled: false })
      } 
      if (password.value.length === 0) {
        setPassword({ value: '', isFilled: false })
      }
      if (passwordConfirmed.value.length === 0) {
        setPasswordConfirmed({ value: '', isFilled: false })
      }

      setError({ main: 'Form Incomplete', sub: 'Please fill out entire form'})
      return
    }

    if (password.value !== passwordConfirmed.value) {
      setError({ main: 'Passwords dont match', sub: 'Please make sure passwords match'})
      return
    }

    try {
      const token = await authUser("signin", email.value, password.value, fname.value, lname.value)
      authContext.auth(token, email.value)
      setError()
    } catch (error) {
      setError({ main: 'Invalid Credentials', sub: 'Please try again with correct credentials'})
    }
  }

  return (
    <View>
      {error && <View style={styles.errorRootContainer}>
        <View style={styles.errorContainer}>
          <Ionicons name="close-circle" size={24} color="red" style={{marginRight: 10}}/>
          <View>
            <Text style={styles.mainErrorMessage}>{error.main}</Text>
            <Text style={styles.subErrorMessage}>{error.sub}</Text>
          </View>
        </View>
      </View>}
      <Text style={styles.title}>Sign up for Biasharas</Text>
      <View style={styles.nameView}>
        <TextInput style={[styles.formInput, {borderBottomColor: fname.isFilled ? GlobalColors.colors.primary400 : 'red', flex: 1}]} value={fname.value} onChangeText={(e) => setFname({ value: e, isFilled: true })} placeholder="First Name" placeholderTextColor={fname.isFilled ? GlobalColors.colors.primary400 : "red"}/>
        <TextInput style={[styles.formInput, {borderBottomColor: lname.isFilled ? GlobalColors.colors.primary400 : 'red', flex: 1}]} value={lname.value} onChangeText={(e) => setLname({ value: e, isFilled: true })} placeholder="Last Name" placeholderTextColor={lname.isFilled ? GlobalColors.colors.primary400 : "red"}/>
      </View>
      <TextInput style={[styles.formInput, {borderBottomColor: email.isFilled ? GlobalColors.colors.primary400 : 'red'}]} value={email.value} onChangeText={(e) => setEmail({ value: e, isFilled: true })} placeholder="Email" placeholderTextColor={email.isFilled ? GlobalColors.colors.primary400 : "red"}/>
      <TextInput style={[styles.formInput, {borderBottomColor: password.isFilled ? GlobalColors.colors.primary400 : 'red'}]} value={password.value} onChangeText={(e) => setPassword({ value: e, isFilled: true })} placeholder="Password" placeholderTextColor={password.isFilled ? GlobalColors.colors.primary400 : "red"} secureTextEntry/>
      <TextInput style={[styles.formInput, {borderBottomColor: passwordConfirmed.isFilled ? GlobalColors.colors.primary400 : 'red'}]} value={passwordConfirmed.value} onChangeText={(e) => setPasswordConfirmed({ value: e, isFilled: true })} placeholder="Confirm Password" placeholderTextColor={passwordConfirmed.isFilled ? GlobalColors.colors.primary400 : "red"} secureTextEntry/>
      <CustomButton 
        onPress={signUp}
        backgroundColor={GlobalColors.colors.primary400}
        color={GlobalColors.colors.primary100}
        title="Sign Up"
      />
    </View> 
  )
}

const styles = StyleSheet.create({
  errorRootContainer: {
    backgroundColor: "red",
    width: "100%",
    height: 50,
    marginBottom: 10,
    borderRadius: 4,
    overflow: "hidden"
  },
  nameView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10
  },
  errorContainer: {
    backgroundColor: GlobalColors.colors.primary800,
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: 10,
    marginLeft: 10,
    height: "100%",
  },
  mainErrorMessage: {
    color: GlobalColors.colors.primary100,
    fontWeight: "bold"
  },
  subErrorMessage: {
    color: GlobalColors.colors.primary100,
    fontWeight: "200"
  },
  formInput: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: GlobalColors.colors.primary900,
    marginVertical: 15
  },
  title: {
    fontWeight: "bold",
    color: GlobalColors.colors.primary800,
    fontSize: 25,
  },
})