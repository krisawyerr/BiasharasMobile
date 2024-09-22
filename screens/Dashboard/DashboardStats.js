import { Pressable } from 'react-native';
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomLineGraph from '../../components/UI/CustomLineGraph';

export default function DashboardStats() {
  const [graphData, setGraphData] = useState([100, 120, 90, 150, 80, 200, 170]);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
      <Text style={styles.priceText}>
        Current Price: {currentPrice} || Trades: {graphData.length}
      </Text>

      <CustomLineGraph graphData={graphData} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} numberColor="gray" lineColor="blue" selectorColor="red"/>

      <Pressable style={styles.button} onPress={addRandomValue}>
        <Text style={styles.buttonText}>Add Random Value</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  priceText: {
    fontSize: 16,
    marginVertical: 10,
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