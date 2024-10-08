import { GlobalColors } from "../../constants/colors";
import CustomTextInput from "../../components/UI/CustomTextInput";
import CustomPickerSelect from "../../components/UI/CustomPickerSelect";
import { Trading } from "../../constants/trading";
import CustomButton from "../../components/UI/CustomButton";
import CustomTitle from "../../components/UI/CustomTitle";
import { formatDate, formatPrice } from "../../utils/format";
import CustomKeyboardScrollView from "../../components/UI/CustomKeyboardScrollView";
import { View } from "react-native";

export default function TradeForm({type, assetName, setAssetName, tradingSession, setTradingSession, result, setResult, pnl, setPnL, openTime, setOpenTime, closeTime, setCloseTime, description, setDescription, onSubmit, onCancel}) {
    const transction = result.value === "Win" || result.value === "Loss"
    return (
        <CustomKeyboardScrollView>
            <CustomTitle color={GlobalColors.colors.primary800} text={type === 'new' ? 'Submit a trade' : 'Edit trade'} />
            <CustomPickerSelect value={result} onValueChange={(e) => setResult({ value: e, isFilled: true })} items={Trading.Result} placeholderText='Action Type' />
            {transction && <CustomPickerSelect value={assetName} onValueChange={(e) => setAssetName({ value: e, isFilled: true })} items={Trading.Assets} placeholderText='Asset Name' />}
            {assetName === "Other" && <CustomTextInput value={assetName} onChangeText={(e) => setAssetName({ value: e, isFilled: true })} placeholder="Enter Other Asset Name" />}
            {transction && <CustomPickerSelect value={tradingSession} onValueChange={(e) => setTradingSession({ value: e, isFilled: true })} items={Trading.Sessions} placeholderText='Trading Session' />}
            {result.value && <CustomTextInput value={pnl} onChangeText={(e) => setPnL({ value: formatPrice(e), isFilled: true })} placeholder={transction ? "Profit / Loss" : `${result.value} Amount`} />}
            {transction && <CustomTextInput value={openTime} onChangeText={(e) => setOpenTime({ value: formatDate(e), isFilled: true })} placeholder="Date Opened (YYYY-MM-DD)" keyboardType="number-pad" maxLength={10}/>}
            {result.value && <CustomTextInput value={closeTime} onChangeText={(e) => setCloseTime({ value: formatDate(e), isFilled: true })} placeholder={transction ? "Date Closed (YYYY-MM-DD)" : `${result.value} Date (YYYY-MM-DD)`} keyboardType="number-pad" maxLength={10}/>}
            {transction && <CustomTextInput multiline={true} value={description} onChangeText={(e) => setDescription({ value: e, isFilled: true })} placeholder="Description"/>}
            <View style={{flexDirection: "row", gap: 10}}>
                {type === "edit" && <CustomButton halfWidth={true} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100} title="Cancel" onPress={onCancel} />}
                <CustomButton halfWidth={true} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100} title={type === "new" ? "Submit" : "Edit"} onPress={onSubmit} />
            </View>
        </CustomKeyboardScrollView>
    );
}
