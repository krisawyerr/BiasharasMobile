import { StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/colors";
import RNPickerSelect from 'react-native-picker-select'; 

export default function CustomPickerSelect({ onValueChange, items, placeholderText, value }) {
    return (
        <RNPickerSelect
            onValueChange={onValueChange}
            items={items}
            placeholder={{ label: placeholderText, value: '' }}
            value={value.value}
            style={{
                placeholder: {
                    color: value.isFilled ? GlobalColors.colors.primary400 : 'red',
                },
                inputIOS: {
                    ...pickerSelectStyles.inputIOS,
                    borderBottomColor: value.isFilled ? GlobalColors.colors.primary400 : 'red',
                },
                inputAndroid: {
                    ...pickerSelectStyles.inputAndroid,
                    borderBottomColor: value.isFilled ? GlobalColors.colors.primary400 : 'red',
                },
            }}
        />
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: GlobalColors.colors.primary900,
        marginVertical: 15,
    },
    inputAndroid: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: GlobalColors.colors.primary900,
        marginVertical: 15,
    },
});
