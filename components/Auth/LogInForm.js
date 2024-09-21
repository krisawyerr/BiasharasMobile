import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/auth"
import { View } from "react-native"
import { authUser } from "../../utils/auth"
import { GlobalColors } from "../../constants/colors"
import CustomButton from "../UI/CustomButton"
import CustomTextInput from "../UI/CustomTextInput"
import CustomTitle from "../UI/CustomTitle"
import { showError } from "../../utils/toast"

export default function LogInForm() {
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState({ value: '', isFilled: true })
  const [password, setPassword] = useState({ value: '', isFilled: true })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (error) showError(error)
  }, [error])

  async function login() {
    if (email.value.length === 0 || password.value.length === 0) {
      if (email.value.length === 0) setEmail({ value: '', isFilled: false }) 
      if (password.value.length === 0) setPassword({ value: '', isFilled: false })

      setError({ main: 'Form Incomplete', sub: 'Please fill out entire form'})
      return
    }

    try {
      const token = await authUser("login", email.value, password.value, '', '')
      authContext.auth(token, email.value)
      setError(null)
    } catch (error) {
      setError({ main: 'Invalid Credentials', sub: 'Please try again with correct credentials'})
    }
  }

  return (
    <View>
      <CustomTitle color={GlobalColors.colors.primary800} text='Log in to your account'/>
      <CustomTextInput value={email} onChangeText={(e) => setEmail({ value: e, isFilled: true })} placeholder="Email"/>
      <CustomTextInput value={password} onChangeText={(e) => setPassword({ value: e, isFilled: true })} placeholder="Password" password={true}/>
      <CustomButton onPress={login} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100} title="Log In"/>
    </View>  
  )
}