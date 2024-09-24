import { DrawerItemList } from '@react-navigation/drawer';
import { View, Text, SafeAreaView } from 'react-native';
import { GlobalColors } from '../../constants/colors';
import CustomButton from '../UI/CustomButton';
import { AuthContext } from '../../context/auth';
import { useContext } from 'react';

export default function DrawerContent(props) {
    const authContext = useContext(AuthContext)

    function logout() {
        authContext.logout()
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: "space-between"}}>
            <View>
                <Text style={{fontFamily: "TitanOne", width: "100%", textAlign: "center", fontSize: 30, marginVertical: 10, color: GlobalColors.colors.primary900}}>Biasharas</Text>
                <DrawerItemList {...props}/>
            </View>
            <CustomButton onPress={logout} backgroundColor={GlobalColors.colors.primary400} color={GlobalColors.colors.primary100} marginHorizontal={10} title="Sign Out"/>
        </SafeAreaView>
    );
}
