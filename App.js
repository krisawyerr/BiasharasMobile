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

const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "TitanOne": require('./assets/fonts/TitanOne-Regular.ttf'),
  });

  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <SectionDrawers />
      </NavigationContainer>
    </>
  );
}
function SectionDrawers() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: GlobalColors.colors.primary900,
        drawerActiveTintColor: GlobalColors.colors.primary300,
        drawerInactiveTintColor: GlobalColors.colors.primary900,
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

function createTabScreenOptions(iconName, IconComponent) {
  return ({ focused }) => ({
    tabBarIcon: () => (
      <IconComponent
        name={iconName}
        size={24}
        color={focused ? GlobalColors.colors.primary900 : GlobalColors.colors.primary600}
      />
    )
  });
}
function createTabNavigator(screens) {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: GlobalColors.colors.primary600,
        tabBarActiveTintColor: GlobalColors.colors.primary900,
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
  return ({ focused }) => ({
    drawerIcon: () => (
      <Ionicons
        name={iconName}
        size={24}
        color={focused ? GlobalColors.colors.primary300 : GlobalColors.colors.primary900}
      />
    ),
  });
}
