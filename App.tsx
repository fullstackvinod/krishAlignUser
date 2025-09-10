/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import CategoryPlannerScreen from './screens/CategoryPlannerScreen';
import OrderReviewScreen from './screens/OrderReviewScreen';
import ComboDetailScreen from './screens/ComboDetailScreen';
import CartScreen from './screens/CartScreen';
import LanguageScreen from './screens/LanguageScreen';
import PhoneNumberScreen from './screens/PhoneNumberScreen';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types/navigation';
import { CartProvider } from './contexts/CartContext';
import './utils/i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);
  const [language, setLanguage] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [otp, setOTP] = useState<string | null>(null);
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} onSkip={() => setShowSplash(false)} />;
  }
  
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Shop" component={ShopScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Orders" component={OrderListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={MyProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CategoryPlanner" component={CategoryPlannerScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderReview" component={OrderReviewScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ComboDetail" component={ComboDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
