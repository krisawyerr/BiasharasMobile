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
import Ionicons from '@expo/vector-icons/Ionicons';
import ErrorMessage from "../../components/UI/ErrorMessage";

export default function DashboardForm() {
    const authContext = useContext(AuthContext)
    const [pnl, setPnL] = useState({ value: '', isFilled: true });
    const [openTime, setOpenTime] = useState({ value: '', isFilled: true });
    const [closeTime, setCloseTime] = useState({ value: '', isFilled: true });
    const [newAssetName, setNewAssetName] = useState({ value: '', isFilled: true });
    const [assetName, setAssetName] = useState({ value: '', isFilled: true });
    const [tradingSession, setTradingSession] = useState({ value: '', isFilled: true });
    const [result, setResult] = useState({ value: '', isFilled: true });
    const [error, setError] = useState()

    function submitTrade() {
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

        // PnL Validation: Ensure it's a valid number
        const pnlValue = pnl.value
        if (pnlValue.length < 1 || isNaN(Number(pnlValue))) {
            setPnL({ value: '', isFilled: false });
            setError({ main: 'PnL not a number', sub: 'Please enter a valid number' });
            return;
        }

        // Date Validation: Check if both openTime and closeTime are valid dates
        if (isNaN(new Date(openTime.value).getTime()) || isNaN(new Date(closeTime.value).getTime())) {
            if (isNaN(new Date(openTime.value).getTime())) {
                setOpenTime({ value: '', isFilled: false });
            } 
            if (isNaN(new Date(closeTime.value).getTime())) {
                setCloseTime({ value: '', isFilled: false });
            }

            setError({ main: 'Date entered wrong', sub: 'Please enter a valid date (MM-DD-YYYY)' });
            return;
        }

        if ((result.value === "Win" && Number(pnl.value) < 0) || (result.value === "Loss" && Number(pnl.value) >= 0)) {
            if (result.value === "Win" && Number(pnl.value) < 0) {
               setError({ main: 'Result doent match PnL', sub: 'PnL should be positive' }); 
            }
            if (result.value === "Loss" && Number(pnl.value) >= 0) {
               setError({ main: 'Result doent match PnL', sub: 'PnL should be negative' }); 
            }
            
            return;
        }

        // Proceed with submitting trade
        try {
            addTrade(authContext.user, assetName.value, tradingSession.value, result.value, Number(pnlValue), openTime.value, closeTime.value);
            setError(null);  // Clear the error
            setPnL({ value: '', isFilled: true })
            setOpenTime({ value: '', isFilled: true })
            setCloseTime({ value: '', isFilled: true })
            setAssetName({ value: '', isFilled: true })
            setTradingSession({ value: '', isFilled: true })
            setResult({ value: '', isFilled: true })
        } catch (error) {
            console.log("Error submitting trade:", error);
            setError({ main: 'Error', sub: 'An error occurred while submitting the trade' });
        }
    }

    function formatPrice(input) {
        // Allow digits, a single decimal point, and a leading dash
        let cleaned = input.replace(/[^0-9.-]/g, ''); // Remove invalid characters
    
        // Check for multiple decimal points
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = `${parts[0]}.${parts.slice(1).join('')}`; // Join after the first decimal
        }
    
        // Limit to two decimal places
        if (parts.length === 2) {
            const decimalPart = parts[1].slice(0, 2); // Take only the first two digits after the decimal
            cleaned = `${parts[0]}.${decimalPart}`;
        }
    
        // If the input starts with a dash, ensure it only appears at the start
        if (cleaned.charAt(0) === '-') {
            cleaned = '-' + cleaned.replace(/-/g, '');
        }
    
        // Limit to a reasonable character length
        return cleaned.length > 10 ? cleaned.slice(0, 10) : cleaned;
    }
    
    function formatDate(input) {
        // Remove any non-digit characters
        const cleaned = input.replace(/\D/g, '').slice(0, 8); // Limit to 8 digits
        const day = cleaned.slice(6); // Last 2 digits for day
        const month = cleaned.slice(4, 6); // Previous 2 digits for month
        const year = cleaned.slice(0, 4); // First 4 digits for year
    
        // Construct formatted date
        return `${year}${month.length > 0 ? '-' + month : ''}${day.length > 0 ? '-' + day : ''}`.trim();
    }
    
    return (
        <KeyboardAvoidingView style={styles.rootView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
            {error && <ErrorMessage error={error} />}
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
