import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, SafeAreaView, Pressable, StyleSheet } from 'react-native';
import { GlobalColors } from '../../constants/colors';

export default function CustomButton({onPress, backgroundColor, color, marginHorizontal, title}) {
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.rootView, {backgroundColor: backgroundColor, marginHorizontal: marginHorizontal}]}>
                <Text style={{color: color, textAlign: 'center'}}>{title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    rootView: {
        height: 40,
        borderRadius: 4,
        alignContent: "center", 
        justifyContent: "center"
    }
})