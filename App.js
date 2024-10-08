import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './screens/OnboardingScreen';
import MainScreen from './screens/MainScreen';
import MeetSomeoneScreen from './screens/MeetScreen';
import { supabase } from './lib/utils/supabase';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MeetSomeone"
          component={MeetSomeoneScreen} 
          options={{ title: "Meet Someone" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
