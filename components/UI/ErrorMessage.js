import { StyleSheet, Text, View } from "react-native"
import { GlobalColors } from "../../constants/colors"
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ErrorMessage({error}) {
    return (
        <View style={styles.errorRootContainer}>
            <View style={styles.errorContainer}>
            <Ionicons name="close-circle" size={24} color="red" style={{marginRight: 10}}/>
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
})