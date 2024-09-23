import { Alert, Pressable } from 'react-native';
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomLineGraph from '../../components/UI/CustomLineGraph';
import { formatDollarAmount, formatPercent } from '../../utils/format';
import { GlobalColors } from '../../constants/colors';
import CustomTextInput from '../../components/UI/CustomTextInput';
import CustomButton from '../../components/UI/CustomButton';
import CustomPickerSelect from '../../components/UI/CustomPickerSelect';
import { Trading } from '../../constants/trading';
import { showError } from '../../utils/toast';
import { BacktestTrades } from '../../classes/BacktestTrades';
import { AuthContext } from '../../context/auth';

export default function DashboardStats() {
  const authContext = useContext(AuthContext)
  const [graphData, setGraphData] = useState([new BacktestTrades("deposit", 0, 0), new BacktestTrades("deposit", 0, 0)]);
  const [graphDataTotals, setGraphTotals] = useState([0,0]);
  const [initialCapital, setInitialCapital] = useState({value: "", isFilled: true});
  const [percentOrFixed, setPercentOrFixed] = useState({ value: '', isFilled: true });
  const [winPercent, setWinPercent] = useState({ value: '', isFilled: true });
  const [lossPercent, setLossPercent] = useState({ value: '', isFilled: true });
  const [winFixedPrice, setWinFixedPrice] = useState({ value: '', isFilled: true });
  const [lossFixedPrice, setLossFixedPrice] = useState({ value: '', isFilled: true });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const pnl = graphDataTotals[graphDataTotals.length - 1] - graphDataTotals[0]
  const pnlPercent = graphDataTotals[0] !== 0 ? formatPercent(pnl / graphDataTotals[0]) : formatPercent(0) 
  const [error, setError] = useState(null)
  const winCount = graphData.filter((item) => item.type === "win").length
  const lossCount = graphData.filter((item) => item.type === "loss").length

  useEffect(() => {
    if (error) showError(error)
  }, [error])

  useEffect(() => {
    function fetchTotals() {
      const tempArray = []
      graphData.forEach(trade => {
        tempArray.push(trade.totalWithPnL)
      });
      setGraphTotals(tempArray)
    }

    function saveToContext() {
      authContext.setBacktest(graphData)
    }

    saveToContext()
    fetchTotals()
  }, [graphData])

  function resetAllValues() {
    setGraphData([new BacktestTrades("deposit", 0, 0), new BacktestTrades("deposit", 0, 0)]);
    setWinPercent({ value: '', isFilled: true });
    setLossPercent({ value: '', isFilled: true });
    setWinFixedPrice({ value: '', isFilled: true });
    setLossFixedPrice({ value: '', isFilled: true });
  }

  function removeLastItem() {
    if (graphData.length > 2) {
      setGraphData(graphData.slice(0, -1));
    }
  }

  function resetBacktester() {
    Alert.alert("Resetting Backtester", "Are you sure you want to reset the backtester?", [
      {
        text: "Yes, reset",
        onPress: resetAllValues
      },
      {
        text: "No, do not reset",
        style: "cancel"
      },
    ])
  }

  function submitInitialCapital() {
    if (initialCapital.value.length === 0) {
      setInitialCapital({ value: '', isFilled: false });

      setError({ main: 'Form Incomplete', sub: 'Please enter initial capital' });
      return false
    }
    
    setGraphData([new BacktestTrades("deposit", Number(initialCapital.value), Number(initialCapital.value)), new BacktestTrades("deposit", Number(initialCapital.value), Number(initialCapital.value))])
    setInitialCapital({value: "", isFilled: true})
    setError(null)
  }

  function enterPercentTrade(type) {
    if ((winPercent.value.length === 0 && type === "win") || (lossPercent.value.length === 0 && type === "loss")) {
      if (winPercent.value.length === 0 && type === "win") setWinPercent({ value: '', isFilled: false });
      if (lossPercent.value.length === 0 && type === "loss") setLossPercent({ value: '', isFilled: false });

      setError({ main: 'Form Incomplete', sub: 'Please enter percent' });
      return false
    }

    const lastValue = graphData[graphData.length - 1].totalWithPnL;
    const percentPnL = type === "win" ? lastValue * (Number(winPercent.value) / 100) : lastValue * (Number(lossPercent.value) / 100)
    const newValue = type === "win" ? lastValue + percentPnL : lastValue - percentPnL
    setGraphData((prevData) => [...prevData, new BacktestTrades(type, percentPnL, newValue)]);
    setError(null)
  };

  function enterFixedPriceTrade(type) {
    if ((winFixedPrice.value.length === 0 && type === "win") || (lossFixedPrice.value.length === 0 && type === "loss")) {
      if (winFixedPrice.value.length === 0 && type === "win") setWinFixedPrice({ value: '', isFilled: false });
      if (lossFixedPrice.value.length === 0 && type === "loss") setLossFixedPrice({ value: '', isFilled: false });

      setError({ main: 'Form Incomplete', sub: 'Please enter price' });
      return false
    }

    const lastValue = graphData[graphData.length - 1].totalWithPnL;
    const newValue = type === "win" ? lastValue + Number(winFixedPrice.value) : lastValue - Number(lossFixedPrice.value)
    setGraphData((prevData) => [...prevData, new BacktestTrades(type, type === "win" ? Number(winFixedPrice.value): Number(lossFixedPrice.value), newValue)]);
    setError(null)
  };

  const currentPrice = useMemo(() => {
    return selectedIndex !== null ? graphData[selectedIndex].totalWithPnL : graphData[graphData.length - 1].totalWithPnL;
  }, [graphData, selectedIndex]);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text style={styles.titleText}>Balance</Text>
        <Text style={styles.priceText}>{formatDollarAmount(currentPrice)}</Text>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={styles.changeText}>{formatDollarAmount(pnl)} ({pnlPercent})</Text>
          <Text style={styles.changeText}>{winCount}W / {lossCount}L</Text>
        </View>
        <CustomLineGraph graphData={graphDataTotals} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} numberColor={GlobalColors.colors.primary400} lineColor={GlobalColors.colors.primary900} selectorColor={GlobalColors.colors.primary400}/>
      </View>
      {graphData[0].totalWithPnL !== 0 && 
        <View style={{flex: 1, justifyContent: "flex-start"}}>
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
          <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
            <CustomButton halfWidth={true} onPress={removeLastItem} title="Undo" color={GlobalColors.colors.primary100} backgroundColor={GlobalColors.colors.primary400}/>
            <CustomButton halfWidth={true} onPress={resetBacktester} title="Reset" color={GlobalColors.colors.primary100} backgroundColor={GlobalColors.colors.primary400}/>
          </View>
        </View>
      }
      {graphData[0].totalWithPnL === 0 && 
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <CustomTextInput value={initialCapital} onChangeText={(e) => setInitialCapital({value: e, isFilled: true})} placeholder="Initial Capital" keyboardType="decimal-pad"/>
          <CustomButton onPress={submitInitialCapital} title="Set Initial Capital" color={GlobalColors.colors.primary100} backgroundColor={GlobalColors.colors.primary400}/>
        </View>
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