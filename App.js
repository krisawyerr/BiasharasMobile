import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import Backtest from './screens/Backtest/Backtest';
import Diary from './screens/Diary/Diary';
import Profile from './screens/Profile/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DrawerContent from './components/Navigation/DrawerContent';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import DashboardStats from './screens/Dashboard/DashboardStats';
import DashboardTrades from './screens/Dashboard/DashboardTrades';
import DashboardForm from './screens/Dashboard/DashboardForm';
import { GlobalColors } from './constants/colors';
import AuthContextProvider, { AuthContext } from './context/auth';
import { useContext, useEffect } from 'react';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();

//START
export default function App() {
  const [fontsLoaded] = useFonts({
    "TitanOne": require('./assets/fonts/TitanOne-Regular.ttf'),
  });

  return (
    <>
      <StatusBar />
      <AuthContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainNavigator /></GestureHandlerRootView>
      </AuthContextProvider>
      <Toast config={toastConfig} />
    </>
  );
}
function MainNavigator() {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authContext.auth(storedToken);
      }
    }

    fetchToken();
  }, []);

  return (
    <NavigationContainer>
      {authContext.isAuthed ? <SectionDrawers /> : <AuthStack />}
    </NavigationContainer>
  );
}
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='login' component={Login} />
      <Stack.Screen name='signup' component={SignUp} />
    </Stack.Navigator>
  )
}
function SectionDrawers() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: GlobalColors.colors.primary400,
        drawerActiveTintColor: GlobalColors.colors.primary100,
        drawerInactiveTintColor: GlobalColors.colors.primary400,
        drawerStyle: { backgroundColor: GlobalColors.colors.primary200 },
        headerStyle: { backgroundColor: GlobalColors.colors.primary200 },
        headerTintColor: GlobalColors.colors.primary900,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardLayout}
        options={createDrawerScreenOptions('stats-chart-sharp')}
      />
      <Drawer.Screen
        name="Backtest"
        component={BacktestLayout}
        options={createDrawerScreenOptions('play-back')}
      />
      <Drawer.Screen
        name="Diary"
        component={DiaryLayout}
        options={createDrawerScreenOptions('reader-sharp')}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={createDrawerScreenOptions('person')}
      />
    </Drawer.Navigator>
  );
}

//DRAWER PAGES
function DashboardLayout() {
  const dashboardScreens = [
    { name: 'Stats', component: DashboardStats, icon: 'stats-chart-sharp', IconComponent: Ionicons },
    { name: 'Trades', component: DashboardTrades, icon: 'money-bill-transfer', IconComponent: FontAwesome6 },
    { name: 'Form', component: DashboardForm, icon: 'pluscircle', IconComponent: AntDesign },
  ];

  return createTabNavigator(dashboardScreens);
}
function BacktestLayout() {
  const backtestScreens = [
    { name: 'Backtester', component: Backtest, icon: 'play-back', IconComponent: Ionicons },
    { name: 'Stats', component: Backtest, icon: 'stats-chart-sharp', IconComponent: Ionicons },
  ];

  return createTabNavigator(backtestScreens);
}
function DiaryLayout() {
  const diaryScreens = [
    { name: 'Post', component: Diary, icon: 'reader-sharp', IconComponent: Ionicons },
    { name: 'Write Post', component: Diary, icon: 'create-sharp', IconComponent: Ionicons },
  ];

  return createTabNavigator(diaryScreens);
}

//EXTRACTION
function createTabScreenOptions(iconName, IconComponent) {
  return () => ({
    tabBarIcon: ({ focused }) => (
      <IconComponent
        name={iconName}
        size={24}
        color={focused ? GlobalColors.colors.primary800 : GlobalColors.colors.primary400}
      />
    )
  });
}
function createTabNavigator(screens) {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: GlobalColors.colors.primary400,
        tabBarActiveTintColor: GlobalColors.colors.primary800,
        tabBarStyle: { backgroundColor: GlobalColors.colors.primary200 },
      }}
    >
      {screens.map(({ name, component, icon, IconComponent }) => (
        <Tabs.Screen
          key={name}
          name={name}
          component={component}
          options={createTabScreenOptions(icon, IconComponent)}
        />
      ))}
    </Tabs.Navigator>
  );
}
function createDrawerScreenOptions(iconName) {
  return () => ({
    drawerIcon: ({ focused }) => (
      <Ionicons
        name={iconName}
        size={24}
        color={focused ? GlobalColors.colors.primary100 : GlobalColors.colors.primary400}
      />
    ),
  });
}