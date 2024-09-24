import React, { useState, useMemo, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomLineGraph from '../../components/UI/CustomLineGraph';
import { formatDollarAmount, formatDollarAmountShorthand, formatPercent } from '../../utils/format';
import { GlobalColors } from '../../constants/colors';
import { AuthContext } from '../../context/auth';
import CustomStatDisplay from '../../components/UI/CustomStatDisplay';
import { listenToTrades } from '../../utils/crud';

export default function DashboardStats() {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const authContext = useContext(AuthContext);
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [graphDataTotals, setGraphTotals] = useState([0,0]);
    const balance = trades.reduce((sum, item) => sum + item.pnl, 0);
    const depositsAndWithdrawls = trades.filter((trade) => trade.result === 'Deposit' || trade.result === "Withdrawl").reduce((sum, item) => sum + item.pnl, 0);
    const wins = trades.filter((trade) => trade.result === 'Win').length;
    const losses = trades.filter((trade) => trade.result === "Loss").length;
    const winsAndLosses = trades.filter((trade) => trade.result === 'Win' || trade.result === "Loss").reduce((sum, item) => sum + item.pnl, 0);
    const percentChange = depositsAndWithdrawls !== 0 ? (winsAndLosses / depositsAndWithdrawls) : 0;
    const tradesCount = trades.filter((trade) => trade.result !== 'Deposit' && trade.result !== 'Withdrawl').length;
    const winRate = tradesCount !== 0 ? formatPercent(wins / tradesCount) : formatPercent(0);
    const avgWin = wins > 0 ? formatDollarAmount(trades.filter((trade) => trade.result === 'Win').reduce((sum, item) => sum + item.pnl, 0) / wins) : 0;
    const avgLoss = losses > 0 ? formatDollarAmount(trades.filter((trade) => trade.result === 'Loss').reduce((sum, item) => sum + item.pnl, 0) / losses) : 0;
    const [maxDrawdown, setMaxDrawdown] = useState();
    const [maxDrawdownPercent, setMaxDrawdownPercent] = useState();
    const [consecutiveWins, setConsecutiveWins] = useState();
    const [consecutiveLosses, setConsecutiveLosses] = useState();
    const currentPrice = useMemo(() => {
        return selectedIndex !== null ? graphDataTotals[selectedIndex] : balance;
    }, [trades, selectedIndex]);
    const currentPnL = useMemo(() => {
        return selectedIndex !== null ? graphDataTotals[selectedIndex] - graphDataTotals[0] : winsAndLosses;
    }, [trades, selectedIndex]);
    const currentPercent = useMemo(() => {
        return selectedIndex !== null ? (graphDataTotals[selectedIndex] - graphDataTotals[0]) / graphDataTotals[0] : percentChange;
    }, [trades, selectedIndex]);

    useEffect(() => {
        let unsubscribe;
        
        if (authContext.user) {
            unsubscribe = listenToTrades(authContext.user, (userTrades) => {
                let maxWins = 0;
                let maxLosses = 0;
                let currentWins = 0;
                let currentLosses = 0;
            
                const reversedTrades = [...userTrades].reverse(); 
            
                reversedTrades.forEach((trade) => {
                    if (trade.result === "Win") {
                        currentWins++;
                        maxWins = Math.max(maxWins, currentWins);
                        currentLosses = 0;
                    } else if (trade.result === "Loss") {
                        currentLosses++;
                        maxLosses = Math.max(maxLosses, currentLosses);
                        currentWins = 0;
                    }
                });
            
                setConsecutiveWins(maxWins);
                setConsecutiveLosses(maxLosses);
                setTrades(reversedTrades);  
            });
        }
    
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [authContext.user]);
    

    useEffect(() => {
        function fetchTotals() {
        if (trades.length === 0) {
            setGraphTotals([0]);
            return;
        }
    
        const tempArray = [];
        for (let i = 0; i < trades.length; i++) {
            if (i > 0) {
            tempArray.push(trades[i].pnl + tempArray[i - 1]);  
            } else {
            tempArray.push(trades[i].pnl);  
            }
        }
        setGraphTotals(tempArray);

        let maxDrawdown = 0;
        let peak = -Infinity;
        let maxDrawdownPercent = 0;
        
        tempArray.forEach((trade) => {
            if (trade > peak) {
            peak = trade;
            }
        
            const drawdown = peak - trade;
        
            if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
            maxDrawdownPercent = (drawdown / peak);
            }
        });
        
        setMaxDrawdown(formatDollarAmount(maxDrawdown));
        setMaxDrawdownPercent(maxDrawdownPercent !== 0 ? formatPercent(maxDrawdownPercent) : formatPercent(0));

        setLoading(false)
        }
    
        fetchTotals();
        
    }, [trades]);

    if (loading) {
        return (
            <Text>loading</Text>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <CustomStatDisplay marginBottom={30} title="Balance" mainStat={formatDollarAmount(currentPrice)} subStat1={`${formatDollarAmountShorthand(currentPnL)} (${formatPercent(currentPercent)})`} subStat2={`${wins}W / ${losses}L`}/>
                <CustomLineGraph graphData={graphDataTotals} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} numberColor={GlobalColors.colors.primary400} lineColor={GlobalColors.colors.primary900} selectorColor={GlobalColors.colors.primary400}/>
            </View>
            <View style={{flex: 1, justifyContent: "space-between"}}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: GlobalColors.colors.primary100,
        flex: 1,
        gap: 10
    },
});
