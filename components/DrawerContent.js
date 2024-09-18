import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, SafeAreaView } from 'react-native';

export default function DrawerContent(props) {
    return (
        <SafeAreaView style={{flex: 1}}>
            <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{fontFamily: "TitanOne"}}>Biasharas</Text>
            <DrawerItemList {...props}/>
        </SafeAreaView>
    );
}
