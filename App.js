import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Dashboard from './screens/Dashboard/Dashboard';
import Backtest from './screens/Backtest/Backtest';
import Diary from './screens/Diary/Diary';
import Profile from './screens/Profile/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Drawer = createDrawerNavigator()
const Tabs = createBottomTabNavigator()

function DashboardLayout() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name='Stats' component={Dashboard}/>
      <Tabs.Screen name='Trades' component={Dashboard}/>
      <Tabs.Screen name='Form' component={Dashboard}/>
    </Tabs.Navigator>
  )
}

function BacktestLayout() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name='Backtester' component={Backtest}/>
      <Tabs.Screen name='Stats' component={Backtest}/>
    </Tabs.Navigator>
  )
}

function DiaryLayout() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name='Post' component={Diary}/>
      <Tabs.Screen name='Write Post' component={Diary}/>
    </Tabs.Navigator>
  )
}

function SectionDrawers() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='Dashboard' component={DashboardLayout}/>
      <Drawer.Screen name='Backtest' component={BacktestLayout}/>
      <Drawer.Screen name='Diary' component={DiaryLayout}/>
      <Drawer.Screen name='Profile' component={Profile}/>
    </Drawer.Navigator>
  ); 
}

export default function App() {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <SectionDrawers />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
