import { Pressable } from 'react-native';
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomLineGraph from '../../components/UI/CustomLineGraph';
import { formatDollarAmount, formatPercent } from '../../utils/format';
import { GlobalColors } from '../../constants/colors';
import CustomTextInput from '../../components/UI/CustomTextInput';
import CustomButton from '../../components/UI/CustomButton';
import CustomPickerSelect from '../../components/UI/CustomPickerSelect';
import { Trading } from '../../constants/trading';

export default function DashboardStats() {
  const [graphData, setGraphData] = useState([0,0]);
  const [initialCapital, setInitialCapital] = useState({value: "", isFilled: true});
  const [percentOrFixed, setPercentOrFixed] = useState({ value: '', isFilled: true });
  const [winPercent, setWinPercent] = useState({ value: '', isFilled: true });
  const [lossPercent, setLossPercent] = useState({ value: '', isFilled: true });
  const [winFixedPrice, setWinFixedPrice] = useState({ value: '', isFilled: true });
  const [lossFixedPrice, setLossFixedPrice] = useState({ value: '', isFilled: true });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const pnl = graphData[graphData.length - 1] - graphData[0]
  const pnlPercent = graphData[0] !== 0 ? formatPercent(pnl / graphData[0]) : formatPercent(0) 

  function submitInitialCapital() {
    setGraphData([Number(initialCapital.value), Number(initialCapital.value)])
    setInitialCapital({value: "", isFilled: true})
  }

  const enterPercentTrade = (type) => {
    const lastValue = graphData[graphData.length - 1];
    const percentPnL = type === "win" ? lastValue * (Number(winPercent.value) / 100) : lastValue * (Number(lossPercent.value) / 100)
    const newValue = type === "win" ? lastValue + percentPnL : lastValue - percentPnL
    setGraphData((prevData) => [...prevData, newValue]);
  };

  const enterFixedPriceTrade = (type) => {
    const lastValue = graphData[graphData.length - 1];
    const newValue = type === "win" ? lastValue + Number(winFixedPrice.value) : lastValue - Number(lossFixedPrice.value)
    setGraphData((prevData) => [...prevData, newValue]);
  };

  const currentPrice = useMemo(() => {
    return selectedIndex !== null ? graphData[selectedIndex] : graphData[graphData.length - 1];
  }, [graphData, selectedIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Balance</Text>
      <Text style={styles.priceText}>{formatDollarAmount(currentPrice)}</Text>
      <Text style={styles.changeText}>{formatDollarAmount(pnl)} ({pnlPercent})</Text>
      <CustomLineGraph graphData={graphData} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} numberColor={GlobalColors.colors.primary400} lineColor={GlobalColors.colors.primary900} selectorColor={GlobalColors.colors.primary400}/>
      {graphData[0] !== 0 && 
        <>
          <CustomPickerSelect items={Trading.PercentOrFixed} value={percentOrFixed} onValueChange={(e) => setPercentOrFixed({ value: e, isFilled: true })} placeholderText="Percent or Fixed Amount"/>
          {percentOrFixed.value === "Percent" && <>
            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
              <CustomTextInput value={winPercent} onChangeText={(e) => setWinPercent({value: e, isFilled: true})} halfWidth={true} placeholder="Enter Win Percent" keyboardType='decimal-pad'/>
              <CustomButton onPress={() => enterPercentTrade("win")} title="Win" color="white" backgroundColor="green" halfWidth={true}/>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
              <CustomTextInput value={lossPercent} onChangeText={(e) => setLossPercent({value: e, isFilled: true})} halfWidth={true} placeholder="Enter Loss Percent" keyboardType='decimal-pad'/>
              <CustomButton onPress={() => enterPercentTrade("loss")} title="Loss" color="white" backgroundColor="red" halfWidth={true}/>
            </View>
          </>}
          {percentOrFixed.value === "Fixed Price" && <>
            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
              <CustomTextInput value={winFixedPrice} onChangeText={(e) => setWinFixedPrice({value: e, isFilled: true})} halfWidth={true} placeholder="Enter Win Amount" keyboardType='decimal-pad'/>
              <CustomButton onPress={() => enterFixedPriceTrade("win")} title="Win" color="white" backgroundColor="green" halfWidth={true}/>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
              <CustomTextInput value={lossFixedPrice} onChangeText={(e) => setLossFixedPrice({value: e, isFilled: true})} halfWidth={true} placeholder="Enter Loss Amount" keyboardType='decimal-pad'/>
              <CustomButton onPress={() => enterFixedPriceTrade("loss")} title="Loss" color="white" backgroundColor="red" halfWidth={true}/>
            </View>
          </>}
          <CustomButton onPress={() => setGraphData([0, 0])} title="Reset" color={GlobalColors.colors.primary100} backgroundColor={GlobalColors.colors.primary400}/>
        </>
      }
      {graphData[0] === 0 && 
        <>
          <CustomTextInput value={initialCapital} onChangeText={(e) => setInitialCapital({value: e, isFilled: true})} placeholder="Initial Capital" keyboardType="decimal-pad"/>
          <CustomButton onPress={submitInitialCapital} title="Set Initial Capital" color={GlobalColors.colors.primary100} backgroundColor={GlobalColors.colors.primary400}/>
        </>
      }
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