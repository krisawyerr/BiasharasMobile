import { useEffect, useState, useContext } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { listenToTrades, updateTrade } from "../../utils/crud";
import { AuthContext } from "../../context/auth";
import { GlobalColors } from "../../constants/colors";
import { formatDateString, formatDollarAmountShorthand } from "../../utils/format";
import CustomButton from "../../components/UI/CustomButton";
import TradeForm from "../../components/Dashboard/TradeForm";
import { showError, showSuccess } from "../../utils/toast";

export default function DashboardTradeEdit({ route, navigation }) {
    const { trade } = route.params;

    const [pnl, setPnL] = useState({ value: trade.pnl.toString(), isFilled: true });
    const [openTime, setOpenTime] = useState({ value: trade.openTime, isFilled: true });
    const [closeTime, setCloseTime] = useState({ value: trade.closeTime, isFilled: true });
    const [assetName, setAssetName] = useState({ value: trade.assetName, isFilled: true });
    const [description, setDescription] = useState({ value: trade.description, isFilled: true });
    const [tradingSession, setTradingSession] = useState({ value: trade.tradingSession, isFilled: true });
    const [result, setResult] = useState({ value: trade.result, isFilled: true });
    const [error, setError] = useState(null)

    useEffect(() => {
        if (error) showError(error)
    }, [error])

    function inputsAreValid() {
        const currentTime = new Date().getTime()

        if (description.value.length === 0 || pnl.value.length === 0 || openTime.value.length === 0 || closeTime.value.length === 0 || assetName.value.length === 0 || tradingSession.value.length === 0 || result.value.length === 0) {
            if (description.value.length === 0) setDescription({ value: '', isFilled: false });
            if (pnl.value.length === 0) setPnL({ value: '', isFilled: false });
            if (openTime.value.length === 0) setOpenTime({ value: '', isFilled: false });
            if (closeTime.value.length === 0) setCloseTime({ value: '', isFilled: false });
            if (assetName.value.length === 0) setAssetName({ value: '', isFilled: false });
            if (tradingSession.value.length === 0) setTradingSession({ value: '', isFilled: false });
            if (result.value.length === 0) setResult({ value: '', isFilled: false });

            setError({ main: 'Form Incomplete', sub: 'Please fill out entire form' });
            return false
        }

        if (pnl.value.length < 1 || isNaN(Number(pnl.value))) {
            setPnL({ value: '', isFilled: false });
            setError({ main: 'PnL not a number', sub: 'Please enter a valid number' });
            return false
        }

        if (isNaN(new Date(openTime.value).getTime()) || isNaN(new Date(closeTime.value).getTime())) {
            if (isNaN(new Date(openTime.value).getTime())) setOpenTime({ value: '', isFilled: false });
            if (isNaN(new Date(closeTime.value).getTime())) setCloseTime({ value: '', isFilled: false });

            setError({ main: 'Date entered wrong', sub: 'Please enter a valid date (YYYY-MM-DD)' });
            return false
        }

        if (new Date(openTime.value).getTime() > currentTime || new Date(closeTime.value).getTime() > currentTime) {
            if (new Date(openTime.value).getTime() > currentTime) setOpenTime({ value: '', isFilled: false });       
            if (new Date(closeTime.value).getTime() > currentTime) setCloseTime({ value: '', isFilled: false });     

            setError({ main: 'Invalid dates', sub: 'Date cannot be in future.' });
            return false
        }

        if (new Date(openTime.value).getTime() > new Date(closeTime.value).getTime()) {
            setOpenTime({ value: '', isFilled: false });
            setCloseTime({ value: '', isFilled: false });

            setError({ main: 'Invalid dates', sub: 'Open date must be on or before close date.' });
            return false
        }

        if ((result.value === "Win" && Number(pnl.value) < 0) || (result.value === "Loss" && Number(pnl.value) >= 0)) {
            if (result.value === "Win" && Number(pnl.value) < 0) setError({ main: 'Result doent match PnL', sub: 'PnL should be positive' }); 
            if (result.value === "Loss" && Number(pnl.value) >= 0) setError({ main: 'Result doent match PnL', sub: 'PnL should be negative' }); 
            
            return false
        }

        return true
    }

    function submitTrade() {
        if (inputsAreValid()) {
            try {
                const updatedData = {
                    assetName: assetName.value, 
                    tradingSession: tradingSession.value,
                    result: result.value,
                    pnl: Number(pnl.value),
                    openTime: openTime.value,
                    closeTime: closeTime.value,
                    description: description.value
                };

                updateTrade(trade.id, updatedData);
                setError(null); 
                showSuccess({ main: 'Trade Submitted', sub: 'Check trades tab to see trades' })
                navigation.navigate("MyTrades")
            } catch (error) {
                console.log("Error submitting trade:", error);
                setError({ main: 'Error', sub: 'An error occurred while submitting the trade' });
            }            
        }
    }

    return (
        <TradeForm type="edit" assetName={assetName} setAssetName={setAssetName} tradingSession={tradingSession} setTradingSession={setTradingSession} result={result} setResult={setResult} pnl={pnl} setPnL={setPnL} openTime={openTime} setOpenTime={setOpenTime} closeTime={closeTime} setCloseTime={setCloseTime} description={description} setDescription={setDescription} onSubmit={submitTrade} onCancel={() => navigation.goBack()}/>
    );
}
