import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, SafeAreaView, Pressable } from 'react-native';
import { GlobalColors } from '../../constants/colors';

export default function DrawerContent(props) {
    return (
        <SafeAreaView style={{flex: 1, justifyContent: "space-between"}}>
            <View>
                <Text style={{fontFamily: "TitanOne", width: "100%", textAlign: "center", fontSize: 30, marginVertical: 10, color: GlobalColors.colors.primary900}}>Biasharas</Text>
                <DrawerItemList {...props}/>
            </View>
            <Pressable onPress={() => console.log("heheh")}>
                <View style={{backgroundColor: GlobalColors.colors.primary900, height: 40, borderRadius: 4, marginHorizontal: 10, alignContent: "center", justifyContent: "center"}}>
                    <Text style={{color: GlobalColors.colors.primary300, textAlign: 'center'}}>Sign Out</Text>
                </View>
            </Pressable>
        </SafeAreaView>
    );
}
