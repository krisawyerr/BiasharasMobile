import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../context/auth";
import { GlobalColors } from "../../constants/colors";
import CustomStatDisplay from "../../components/UI/CustomStatDisplay";
import { formatDollarAmount, formatDollarAmountShorthand, formatPercent, formatPercentShorthand } from "../../utils/format";

export default function BacktesterStats() {
    const authContext = useContext(AuthContext)
    const trades = authContext.backtestTrades

    const balance = formatDollarAmount(trades[trades.length - 1].totalWithPnL)
    const pnl = formatDollarAmountShorthand(trades[trades.length - 1].totalWithPnL - trades[0].totalWithPnL)
    const pnlPercent = trades[0].totalWithPnL !== 0 ? formatPercent((trades[trades.length - 1].totalWithPnL - trades[0].totalWithPnL) / trades[0].totalWithPnL) : formatPercent(0) 
    const tradesCount = trades.filter((trade) => trade.type !== 'deposit').length
    const wins = trades.filter((trade) => trade.type === 'win').length
    const losses = trades.filter((trade) => trade.type === 'loss').length
    const winRate = tradesCount !== 0 ? formatPercent(wins / tradesCount) : formatPercent(0)
    const avgWin = wins > 0 ? formatDollarAmount(trades.filter((trade) => trade.type === 'win').reduce((sum, item) => sum + item.pnl, 0) / wins) : 0
    const avgLoss = losses > 0 ? formatDollarAmount(trades.filter((trade) => trade.type === 'loss').reduce((sum, item) => sum + item.pnl, 0) / losses) : 0
    const [maxDrawdown, setMaxDrawdown] = useState()
    const [maxDrawdownPercent, setMaxDrawdownPercent] = useState()
    const [consecutiveWins, setConsecutiveWins] = useState()
    const [consecutiveLosses, setConsecutiveLosses] = useState()

    useEffect(() =>{
        function calculateMaxDrawdown() {
            let maxDrawdown = 0;
            let peak = -Infinity;
            let maxDrawdownPercent = 0;
          
            trades.forEach((trade) => {
              const totalValue = trade.totalWithPnL;
          
              if (totalValue > peak) {
                peak = totalValue;
              }
          
              const drawdown = peak - totalValue;
          
              if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
                maxDrawdownPercent = (drawdown / peak);
              }
            });
          
            setMaxDrawdown(formatDollarAmount(maxDrawdown));
            setMaxDrawdownPercent(maxDrawdownPercent !== 0 ? formatPercent(maxDrawdownPercent) : formatPercent(0));
        }

        function calculateConsecutiveWinsAndLosses() {
            let maxWins = 0;
            let maxLosses = 0;
            let currentWins = 0;
            let currentLosses = 0;
          
            trades.forEach((trade) => {
              if (trade.type === "win") {
                currentWins++;
                maxWins = Math.max(maxWins, currentWins);
                currentLosses = 0;
              } else if (trade.type === "loss") {
                currentLosses++;
                maxLosses = Math.max(maxLosses, currentLosses);
                currentWins = 0;
              }
            });
          
            setConsecutiveWins(maxWins)
            setConsecutiveLosses(maxLosses)
        }

        calculateConsecutiveWinsAndLosses()
        calculateMaxDrawdown()
    }, [trades, setMaxDrawdown])
      

    console.log(trades.filter((trade) => trade.type === 'loss'))
    return (
        <View style={styles.container}>
            <View style={{flexDirection: "row"}}>
                <CustomStatDisplay halfwidth={true} title="Balance" mainStat={balance}/>
            </View>
            <View style={{flexDirection: "row"}}>
                <CustomStatDisplay halfwidth={true} title="Profit / Loss" mainStat={pnl} subStat1={pnlPercent}/> 
                <CustomStatDisplay halfwidth={true} title="Trades" mainStat={`${tradesCount}`}/>
            </View>  
            <View style={{flexDirection: "row"}}>
                <CustomStatDisplay halfwidth={true} title="Wins" mainStat={`${wins}`}/> 
                <CustomStatDisplay halfwidth={true} title="Loss" mainStat={`${losses}`}/> 
            </View>  
            <View style={{flexDirection: "row"}}>
                <CustomStatDisplay halfwidth={true} title="Win Rate" mainStat={winRate} subStat1={`${wins} / ${tradesCount}`}/> 
                <CustomStatDisplay halfwidth={true} title="Max Drowdown" mainStat={maxDrawdown} subStat1={maxDrawdownPercent}/>
            </View>   
            <View style={{flexDirection: "row"}}>
                <CustomStatDisplay halfwidth={true} title="Avg Win" mainStat={avgWin}/>  
                <CustomStatDisplay halfwidth={true} title="Avg Loss" mainStat={avgLoss}/>  
            </View>
            <View style={{flexDirection: "row"}}>
                <CustomStatDisplay halfwidth={true} title="Consec Wins" mainStat={`${consecutiveWins} W`}/>  
                <CustomStatDisplay halfwidth={true} title="Consec Losses" mainStat={`${consecutiveLosses} L`}/>  
            </View>
        </View>
        
    )  
}
    
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: GlobalColors.colors.primary100,
        flex: 1,
        justifyContent: "space-between"
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