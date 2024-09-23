import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlobalColors } from '../../constants/colors';

export default function CustomStatDisplay({title, mainStat, subStat1, subStat2, marginBottom, halfwidth}) {
  return (
    <View style={{marginBottom: marginBottom, flex: halfwidth && 1}}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.priceText}>{mainStat}</Text>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={styles.changeText}>{subStat1}</Text>
        <Text style={styles.changeText}>{subStat2}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  priceText: {
    fontSize: 35,
    fontWeight: "800",
    color: GlobalColors.colors.primary900,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    color: GlobalColors.colors.primary400,
  },
  changeText: {
    fontSize: 20,
    fontWeight: "500",
    color: GlobalColors.colors.primary400,
  },
});