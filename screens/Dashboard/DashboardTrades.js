import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../../context/auth";

export default function DashboardTrades() {
    const authContext = useContext(AuthContext)
    const trades = authContext.backtestTrades

    const balance = trades[trades.length - 1].totalWithPnL
    const pnl = trades[trades.length - 1].totalWithPnL - trades[0].totalWithPnL
    const tradesCount = trades.filter((trade) => trade.type !== 'deposit').length
    const wins = trades.filter((trade) => trade.type === 'win').length
    const losses = trades.filter((trade) => trade.type === 'loss').length
    const winRate = (wins / tradesCount) * 100
    const avgWin = trades.filter((trade) => trade.type === 'win').reduce((sum, item) => sum + item.pnl, 0) / wins
    const avgLoss = trades.filter((trade) => trade.type === 'loss').reduce((sum, item) => sum + item.pnl, 0) / losses
    const [maxDrawdown, setMaxDrawdown] = useState()
    const [consecutiveWins, setConsecutiveWins] = useState()
    const [consecutiveLosses, setConsecutiveLosses] = useState()

    useEffect(() =>{
        function calculateMaxDrawdown() {
            let maxDrawdown = 0;
            let peak = -Infinity;
          
            trades.forEach((trade) => {
              const totalValue = trade.totalWithPnL
              if (totalValue > peak) peak = totalValue
              const drawdown = peak - totalValue      
              if (drawdown > maxDrawdown) maxDrawdown = drawdown
            });
          
            setMaxDrawdown(maxDrawdown);
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
        <View>
            <Text>Balance: {balance}</Text>   
            <Text>PnL: {pnl}</Text>   
            <Text>Wins: {wins}</Text>   
            <Text>Loss: {losses}</Text>   
            <Text>Trades: {tradesCount}</Text>   
            <Text>Win rate: {winRate}</Text>   
            <Text>Avg Win: {avgWin}</Text>   
            <Text>Avg Loss: {avgLoss}</Text>   
            <Text>Max Drowdown: {maxDrawdown}</Text>   
            <Text>Consectutive Wins: {consecutiveWins}</Text>   
            <Text>Consectutive Losses: {consecutiveLosses}</Text>    
        </View>
        
    )
}