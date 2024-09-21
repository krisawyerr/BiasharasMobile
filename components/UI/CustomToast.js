import { StyleSheet, Text, View } from "react-native"
import { GlobalColors } from "../../constants/colors"
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomToast({error, type}) {
  return (
    <View style={[styles.errorRootContainer, {backgroundColor: type === "error" ? "red" : GlobalColors.colors.primary400}]}>
      <View style={styles.errorContainer}>
      <Ionicons name={type === "error" ? "close-circle" : "thumbs-up-sharp"} size={24} color={type === "error" ? "red" : GlobalColors.colors.primary400} style={{marginRight: 10}}/>
      <View>
        <Text style={styles.mainErrorMessage}>{error.main}</Text>
        <Text style={styles.subErrorMessage}>{error.sub}</Text>
      </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  errorRootContainer: {
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
})