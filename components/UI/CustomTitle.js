import { StyleSheet, Text } from "react-native"

export default function CustomTitle({color, text}) {
  return (
    <Text style={[styles.title, {color: color}]}>{text}</Text>
  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 25,
  },
})