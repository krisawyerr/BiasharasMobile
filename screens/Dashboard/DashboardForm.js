import { Button, SectionList, SectionListComponent, StyleSheet, Text, TextInput, View, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import { GlobalColors } from "../../constants/colors";
import { useContext, useState } from "react";
import CustomTextInput from "../../components/UI/CustomTextInput";
import RNPickerSelect from 'react-native-picker-select';
import CustomPickerSelect from "../../components/UI/CustomPickerSelect";
import { Trading } from "../../constants/trading";
import CustomButton from "../../components/UI/CustomButton";
import CustomTitle from "../../components/UI/CustomTitle";
import { AuthContext } from "../../context/auth";
import { addTrade } from "../../utils/crud";
import ErrorMessage from "../../components/UI/ErrorMessage";
import { formatDate, formatPrice } from "../../utils/format";

export default function DashboardForm() {
    const authContext = useContext(AuthContext)
    const [pnl, setPnL] = useState({ value: '', isFilled: true });
    const [openTime, setOpenTime] = useState({ value: '', isFilled: true });
    const [closeTime, setCloseTime] = useState({ value: '', isFilled: true });
    const [assetName, setAssetName] = useState({ value: '', isFilled: true });
    const [tradingSession, setTradingSession] = useState({ value: '', isFilled: true });
    const [result, setResult] = useState({ value: '', isFilled: true });
    const [error, setError] = useState()

    function setFieldState(field, isFilled) {
        switch (field) {
            case 'pnl':
                setPnL({ value: '', isFilled });
                break;
            case 'open':
                setOpenTime({ value: '', isFilled });
                break;
            case 'close':
                setCloseTime({ value: '', isFilled });
                break;
            case 'asset':
                setAssetName({ value: '', isFilled });
                break;
            case 'session':
                setTradingSession({ value: '', isFilled });
                break;
            case 'result':
                setResult({ value: '', isFilled });
                break;
        }
    }
    
    function resetFields() {
        setPnL({ value: '', isFilled: true });
        setOpenTime({ value: '', isFilled: true });
        setCloseTime({ value: '', isFilled: true });
        setAssetName({ value: '', isFilled: true });
        setTradingSession({ value: '', isFilled: true });
        setResult({ value: '', isFilled: true });
    }

    function submitTrade() {
        const currentTime = new Date().getTime();
        const values = {
            pnl: pnl.value,
            open: openTime.value,
            close: closeTime.value,
            asset: assetName.value,
            session: tradingSession.value,
            result: result.value,
        };
    
        for (const [key, value] of Object.entries(values)) {
            if (value.length === 0) {
                setError({ main: 'Form Incomplete', sub: 'Please fill out entire form' });
                setFieldState(key, false);
                return;
            }
        }
    
        const pnlValue = Number(values.pnl);
    
        if (isNaN(pnlValue)) {
            setError({ main: 'PnL not a number', sub: 'Please enter a valid number' });
            setFieldState('pnl', false);
            return;
        }
    
        const openDate = new Date(values.open);
        const closeDate = new Date(values.close);
    
        if (isNaN(openDate.getTime()) || isNaN(closeDate.getTime())) {
            setError({ main: 'Date entered wrong', sub: 'Please enter a valid date (YYYY-MM-DD)' });
            if (isNaN(openDate.getTime())) setFieldState('open', false);
            if (isNaN(closeDate.getTime())) setFieldState('close', false);
            return;
        }
    
        if (openDate > currentTime || closeDate > currentTime) {
            setError({ main: 'Invalid dates', sub: 'Date cannot be in future.' });
            if (openDate > currentTime) setFieldState('open', false);
            if (closeDate > currentTime) setFieldState('close', false);
            return;
        }
    
        if (openDate > closeDate) {
            setError({ main: 'Invalid dates', sub: 'Open date must be on or before close date.' });
            setFieldState('open', false);
            setFieldState('close', false);
            return;
        }
    
        if ((values.result === "Win" && pnlValue < 0) || (values.result === "Loss" && pnlValue >= 0)) {
            setError({ main: 'Result does not match PnL', sub: `PnL should be ${values.result === "Win" ? "positive" : "negative"}` });
            return;
        }
    
        try {
            addTrade(authContext.user, values.asset, values.session, values.result, pnlValue, values.open, values.close);
            setError(null);
            resetFields();
        } catch (error) {
            console.log("Error submitting trade:", error);
            setError({ main: 'Error', sub: 'An error occurred while submitting the trade' });
        }
    }
    
    return (
        <KeyboardAvoidingView style={styles.rootView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
            {error && <ErrorMessage error={error} />}
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
