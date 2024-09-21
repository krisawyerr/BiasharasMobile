import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/auth"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { authUser } from "../../utils/auth"
import { GlobalColors } from "../../constants/colors"
import CustomButton from "../UI/CustomButton"
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomTextInput from "../UI/CustomTextInput"
import CustomTitle from "../UI/CustomTitle"
import CustomToast from "../UI/CustomToast"
import Toast from "react-native-toast-message"
import { showError } from "../../utils/toast"

export default function SignUpForm() {
  const authContext = useContext(AuthContext)
  const [fname, setFname] = useState({ value: '', isFilled: true })
  const [lname, setLname] = useState({ value: '', isFilled: true })
  const [email, setEmail] = useState({ value: '', isFilled: true })
  const [password, setPassword] = useState({ value: '', isFilled: true })
  const [passwordConfirmed, setPasswordConfirmed] = useState({ value: '', isFilled: true })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (error) showError(error)
  }, [error])

  async function signUp() {
    if (email.value.length === 0 || password.value.length === 0 || passwordConfirmed.value.length === 0 || fname.value.length === 0 || lname.value.length === 0) {
      if (fname.value.length === 0) setFname({ value: '', isFilled: false }) 
      if (lname.value.length === 0) setLname({ value: '', isFilled: false })
      if (email.value.length === 0) setEmail({ value: '', isFilled: false }) 
      if (password.value.length === 0) setPassword({ value: '', isFilled: false })
      if (passwordConfirmed.value.length === 0) setPasswordConfirmed({ value: '', isFilled: false })

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
      setError(null)
    } catch (error) {
      setError({ main: 'Invalid Credentials', sub: 'Please try again with correct credentials'})
    }
  }

  return (
    <View>
      <CustomTitle color={GlobalColors.colors.primary800} text='Sign up for Biasharas'/>
      <View style={styles.nameView}>
        <CustomTextInput value={fname} onChangeText={(e) => setFname({ value: e, isFilled: true })} placeholder="First Name" halfWidth={true}/>
        <CustomTextInput value={lname} onChangeText={(e) => setLname({ value: e, isFilled: true })} placeholder="Last Name" halfWidth={true}/>
      </View>
      <CustomTextInput value={email} onChangeText={(e) => setEmail({ value: e, isFilled: true })} placeholder="Email"/>
      <CustomTextInput value={password} onChangeText={(e) => setPassword({ value: e, isFilled: true })} placeholder="Password" password={true}/>
      <CustomTextInput value={passwordConfirmed} onChangeText={(e) => setPasswordConfirmed({ value: e, isFilled: true })} placeholder="Confirm Password" password={true}/>
      <CustomButton onPress={signUp} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100} title="Sign Up"/>
    </View> 
  )
}

const styles = StyleSheet.create({
  nameView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10
  },
})