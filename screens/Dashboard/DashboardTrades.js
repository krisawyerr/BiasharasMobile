import { useEffect, useState, useContext } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { listenToTrades } from "../../utils/crud";
import { AuthContext } from "../../context/auth";
import { GlobalColors } from "../../constants/colors";
import { formatDateString, formatDollarAmountShorthand } from "../../utils/format";

export default function DashboardTrades({navigation}) {
    const authContext = useContext(AuthContext);
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        let unsubscribe;
        
        if (authContext.user) {
            unsubscribe = listenToTrades(authContext.user, (userTrades) => {
                setTrades(userTrades);
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [authContext.user]);

    function viewTradeDetails(trade) {
        navigation.navigate('MyTrade', {
            trade: trade,
        });
    }

    return (
        <View style={{backgroundColor: GlobalColors.colors.primary100, flex: 1, paddingVertical: 10, paddingHorizontal: 10}}>
            <FlatList 
                data={trades}
                keyExtractor={trades.id}
                renderItem={(tradeData) => (
                    <Pressable onPress={() => viewTradeDetails(tradeData.item)} key={tradeData.item.id} style={{backgroundColor: GlobalColors.colors.primary200, marginBottom: 10, padding: 20}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: 'center',}}>
                            <View>
                                <Text style={{fontSize: 20, fontWeight: "bold", color: GlobalColors.colors.primary600}}>{tradeData.item.assetName}</Text>
                                <Text style={{fontSize: 16, fontWeight: "500", color: GlobalColors.colors.primary600}}>{formatDateString(tradeData.item.closeTime)}</Text>
                            </View>
                            <Text style={{fontSize: 20, fontWeight: "bold", color: tradeData.item.pnl < 0 ? "red" : "green"}}>{formatDollarAmountShorthand(tradeData.item.pnl)}</Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
}
