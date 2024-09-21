import { Button, SectionList, SectionListComponent, StyleSheet, Text, TextInput, View, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { useContext, useEffect, useState } from "react";
import CustomTextInput from "../../components/UI/CustomTextInput";
import RNPickerSelect from 'react-native-picker-select';
import CustomPickerSelect from "../../components/UI/CustomPickerSelect";
import { Trading } from "../../constants/trading";
import CustomButton from "../../components/UI/CustomButton";
import CustomTitle from "../../components/UI/CustomTitle";
import { AuthContext } from "../../context/auth";
import { addTrade } from "../../utils/crud";
import { formatDate, formatPrice } from "../../utils/format";
import Toast from "react-native-toast-message";

export default function DashboardForm() {
    const authContext = useContext(AuthContext)
    const [pnl, setPnL] = useState({ value: '', isFilled: true });
    const [openTime, setOpenTime] = useState({ value: '', isFilled: true });
    const [closeTime, setCloseTime] = useState({ value: '', isFilled: true });
    const [assetName, setAssetName] = useState({ value: '', isFilled: true });
    const [tradingSession, setTradingSession] = useState({ value: '', isFilled: true });
    const [result, setResult] = useState({ value: '', isFilled: true });
    const [error, setError] = useState(null)

    const showError = () => {
        Toast.show({
            type: 'error',
            props: { error: error }
        });
    }

    const showSuccess = () => {
        Toast.show({
            type: 'success',
            props: { message: { main: 'Trade Submitted', sub: 'Check trades tab to see trades' } }
        });
    }

    useEffect(() => {
        if (error) showError()
    }, [error])

    function submitTrade() {
        const currentTime = new Date().getTime()

        if (pnl.value.length === 0 || openTime.value.length === 0 || closeTime.value.length === 0 || assetName.value.length === 0 || tradingSession.value.length === 0 || result.value.length === 0) {
            if (pnl.value.length === 0) setPnL({ value: '', isFilled: false });
            if (openTime.value.length === 0) setOpenTime({ value: '', isFilled: false });
            if (closeTime.value.length === 0) setCloseTime({ value: '', isFilled: false });
            if (assetName.value.length === 0) setAssetName({ value: '', isFilled: false });
            if (tradingSession.value.length === 0) setTradingSession({ value: '', isFilled: false });
            if (result.value.length === 0) setResult({ value: '', isFilled: false });

            setError({ main: 'Form Incomplete', sub: 'Please fill out entire form' });
            return;
        }

        const pnlValue = pnl.value
        if (pnlValue.length < 1 || isNaN(Number(pnlValue))) {
            setPnL({ value: '', isFilled: false });
            setError({ main: 'PnL not a number', sub: 'Please enter a valid number' });
            return;
        }

        if (isNaN(new Date(openTime.value).getTime()) || isNaN(new Date(closeTime.value).getTime())) {
            if (isNaN(new Date(openTime.value).getTime())) setOpenTime({ value: '', isFilled: false });
            if (isNaN(new Date(closeTime.value).getTime())) setCloseTime({ value: '', isFilled: false });

            setError({ main: 'Date entered wrong', sub: 'Please enter a valid date (YYYY-MM-DD)' });
            return;
        }

        if (new Date(openTime.value).getTime() > currentTime || new Date(closeTime.value).getTime() > currentTime) {
            if (new Date(openTime.value).getTime() > currentTime) setOpenTime({ value: '', isFilled: false });       
            if (new Date(closeTime.value).getTime() > currentTime) setCloseTime({ value: '', isFilled: false });     

            setError({ main: 'Invalid dates', sub: 'Date cannot be in future.' });
            return;
        }

        if (new Date(openTime.value).getTime() > new Date(closeTime.value).getTime()) {
            setOpenTime({ value: '', isFilled: false });
            setCloseTime({ value: '', isFilled: false });

            setError({ main: 'Invalid dates', sub: 'Open date must be on or before close date.' });
            return;
        }

        if ((result.value === "Win" && Number(pnl.value) < 0) || (result.value === "Loss" && Number(pnl.value) >= 0)) {
            if (result.value === "Win" && Number(pnl.value) < 0) setError({ main: 'Result doent match PnL', sub: 'PnL should be positive' }); 
            if (result.value === "Loss" && Number(pnl.value) >= 0) setError({ main: 'Result doent match PnL', sub: 'PnL should be negative' }); 
            
            return;
        }

        try {
            addTrade(authContext.user, assetName.value, tradingSession.value, result.value, Number(pnlValue), openTime.value, closeTime.value);
            setError(null); 
            setPnL({ value: '', isFilled: true })
            setOpenTime({ value: '', isFilled: true })
            setCloseTime({ value: '', isFilled: true })
            setAssetName({ value: '', isFilled: true })
            setTradingSession({ value: '', isFilled: true })
            setResult({ value: '', isFilled: true })
            showSuccess()
        } catch (error) {
            console.log("Error submitting trade:", error);
            setError({ main: 'Error', sub: 'An error occurred while submitting the trade' });
        }
    }
    
    return (
        <KeyboardAvoidingView style={styles.rootView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <CustomTitle color={GlobalColors.colors.primary800} text='Submit a trade' />
                <CustomPickerSelect value={assetName} onValueChange={(e) => setAssetName({ value: e, isFilled: true })} items={Trading.Assets} placeholderText='Asset Name' />
                {assetName === "Other" && <CustomTextInput value={assetName} onChangeText={(e) => setAssetName({ value: e, isFilled: true })} placeholder="Enter Other Asset Name" />}
                <CustomPickerSelect value={tradingSession} onValueChange={(e) => setTradingSession({ value: e, isFilled: true })} items={Trading.Sessions} placeholderText='Trading Session' />
                <CustomPickerSelect value={result} onValueChange={(e) => setResult({ value: e, isFilled: true })} items={Trading.Result} placeholderText='Result' />
                {result.value && <CustomTextInput value={pnl} onChangeText={(e) => setPnL({ value: formatPrice(e), isFilled: true })} placeholder="Profit / Loss" />}
                <CustomTextInput 
                    value={openTime} 
                    onChangeText={(e) => setOpenTime({ value: formatDate(e), isFilled: true })} 
                    placeholder="Date Opened (YYYY-MM-DD)" 
                    keyboardType="number-pad" 
                    maxLength={10}
                />
                <CustomTextInput 
                    value={closeTime} 
                    onChangeText={(e) => setCloseTime({ value: formatDate(e), isFilled: true })} 
                    placeholder="Date Closed (YYYY-MM-DD)" 
                    keyboardType="number-pad" 
                    maxLength={10}
                />
                <CustomButton backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100} title="Submit" onPress={submitTrade} />
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    rootView: {
        backgroundColor: GlobalColors.colors.primary100,
        flex: 1,
        paddingHorizontal: 25,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingVertical: 10,
    },
    formInput: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: GlobalColors.colors.primary900,
        marginVertical: 15,
    },
    timeView: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
});
