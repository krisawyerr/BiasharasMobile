import { useContext, useState } from "react"
import { AuthContext } from "../../context/auth"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { authUser } from "../../utils/auth"
import { GlobalColors } from "../../constants/colors"
import CustomButton from "../UI/CustomButton"
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomTextInput from "../UI/CustomTextInput"
import CustomTitle from "../UI/CustomTitle"
import ErrorMessage from "../UI/ErrorMessage"

export default function LogInForm() {
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState({ value: '', isFilled: true })
  const [password, setPassword] = useState({ value: '', isFilled: true })
  const [error, setError] = useState()

  async function login() {
    if (email.value.length === 0 || password.value.length === 0) {
      if (email.value.length === 0) {
        setEmail({ value: '', isFilled: false })
      } 
      if (password.value.length === 0) {
        setPassword({ value: '', isFilled: false })
      }

      setError({ main: 'Form Incomplete', sub: 'Please fill out entire form'})
      return
    }

    try {
      const token = await authUser("login", email.value, password.value, '', '')
      authContext.auth(token, email.value)
      setError()
    } catch (error) {
      setError({ main: 'Invalid Credentials', sub: 'Please try again with correct credentials'})
    }
  }

  return (
    <View>
        {error && <ErrorMessage error={error}/>}
        <CustomTitle color={GlobalColors.colors.primary800} text='Log in to your account'/>
        <CustomTextInput value={email} onChangeText={(e) => setEmail({ value: e, isFilled: true })} placeholder="Email"/>
        <CustomTextInput value={password} onChangeText={(e) => setPassword({ value: e, isFilled: true })} placeholder="Password" password={true}/>
        <CustomButton 
          onPress={login}
          backgroundColor={GlobalColors.colors.primary400}
          color={GlobalColors.colors.primary100}
          title="Log In"
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
      overflow: "hidden",
      marginTop: 10,
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
})