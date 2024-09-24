import { useEffect, useState, useContext } from "react";
import { Alert, Button, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { deleteTrade, listenToTrades } from "../../utils/crud";
import { AuthContext } from "../../context/auth";
import { GlobalColors } from "../../constants/colors";
import { formatDateString, formatDollarAmountShorthand } from "../../utils/format";
import CustomButton from "../../components/UI/CustomButton";
import { showSuccess } from "../../utils/toast";

export default function DashboardSingleTrade({ route, navigation }) {
    const { trade } = route.params;

    function editTrade() {
        navigation.navigate('EditMyTrade', {
            trade: trade,
        });
    }

    console.log(trade)

    function deleteCurrentTrade() {
        Alert.alert("Delete Trade", "Are you sure you want to delete this trade?", [
            {
              text: "Yes, delete",
              onPress: () => {
                try {
                    deleteTrade(trade.id) 
                    showSuccess({ main: 'Trade Deleted', sub: 'Trade has been removed from list' })   
                    navigation.goBack()        
                } catch (error) {
                   console.log(error) 
                }
              }
            },
            {
              text: "No, do not delete",
              style: "cancel"
            },
        ])
    }

    return (
        <View style={{backgroundColor: GlobalColors.colors.primary100, flex: 1, paddingVertical: 10, paddingHorizontal: 10}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 30}}>
                    <Text style={{fontSize: 30, fontWeight: "bold", color: GlobalColors.colors.primary600}}>{trade.assetName}</Text>
                    <Text style={{fontSize: 30, fontWeight: "bold", color: trade.pnl < 0 ? "red" : "green"}}>{formatDollarAmountShorthand(trade.pnl)}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight: "bold", color: GlobalColors.colors.primary400}}>Session:</Text>
                    <Text style={{fontSize: 25, fontWeight: "bold", color: GlobalColors.colors.primary600}}>{trade.tradingSession}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight: "bold", color: GlobalColors.colors.primary400}}>Trade Start Date:</Text>
                    <Text style={{fontSize: 25, fontWeight: "bold", color: GlobalColors.colors.primary600}}>{formatDateString(trade.openTime)}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight: "bold", color: GlobalColors.colors.primary400}}>Trade End Date:</Text>
                    <Text style={{fontSize: 25, fontWeight: "bold", color: GlobalColors.colors.primary600}}>{formatDateString(trade.closeTime)}</Text>
                </View>
                {trade.description && <View style={{marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight: "bold", color: GlobalColors.colors.primary400}}>Decription:</Text>
                    <Text style={{fontSize: 25, fontWeight: "bold", color: GlobalColors.colors.primary600}}>{trade.description}</Text>
                </View>}
            </View>
            <View>
                <View style={{flexDirection: "row", marginBottom: 10, gap: 10}}>
                    <CustomButton halfWidth={true} title="Edit" onPress={editTrade} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100}/>
                    <CustomButton halfWidth={true} title="Delete" onPress={deleteCurrentTrade} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100}/>
                </View>
                <CustomButton title="Go Back To Trades" onPress={() => navigation.goBack()} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100}/>
            </View>
        </View>
    );
}
