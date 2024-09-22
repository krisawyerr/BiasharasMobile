import { Pressable } from 'react-native';
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomLineGraph from '../../components/UI/CustomLineGraph';
import { formatDollarAmount, formatPercent } from '../../utils/format';
import { GlobalColors } from '../../constants/colors';

export default function DashboardStats() {
  const [graphData, setGraphData] = useState([100, 120, 90, 150, 80, 200, 170]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const pnl = graphData[graphData.length - 1] - graphData[0]
  const percent = formatPercent(pnl / graphData[0])

  const addRandomValue = () => {
    const lastValue = graphData[graphData.length - 1];
    const newValue = lastValue + Math.floor(Math.random() * 201) - 100;
    setGraphData((prevData) => [...prevData, newValue]);
  };

  const currentPrice = useMemo(() => {
    return selectedIndex !== null ? graphData[selectedIndex] : graphData[graphData.length - 1];
  }, [graphData, selectedIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Balance</Text>
      <Text style={styles.priceText}>{formatDollarAmount(currentPrice)}</Text>
      <Text style={styles.changeText}>{formatDollarAmount(pnl)}: ({percent})</Text>

      <CustomLineGraph graphData={graphData} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} numberColor={GlobalColors.colors.primary400} lineColor={GlobalColors.colors.primary900} selectorColor={GlobalColors.colors.primary400}/>

      <Pressable style={styles.button} onPress={addRandomValue}>
        <Text style={styles.buttonText}>Add Random Value</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => setGraphData([100, 120, 90, 150, 80, 200, 170])}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: GlobalColors.colors.primary100,
    flex: 1
  },
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
    marginBottom: 30
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});