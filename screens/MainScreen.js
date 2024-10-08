import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function MainScreen({ route, navigation }) {
  const { userData } = route.params;
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  useEffect(() => {
    let locationInterval;
    if (isLocationTracking) {
      locationInterval = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({});
      }, 5000);
      
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Meet Someone!",
          body: "There's someone in your area with shared interests.",
        },
        trigger: { seconds: 5 },
      });
    }

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isLocationTracking]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      navigation.navigate('MeetSomeone');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <StyledView className="flex-1 bg-purple-100 p-5 justify-center items-center">
      <StyledView className="w-full bg-purple-100 p-5 rounded-lg shadow-lg">
        <StyledText className="text-3xl font-extrabold mb-5 text-purple-800">Welcome, {userData.name}!</StyledText>
        <StyledText className="text-lg text-purple-600">Interest: {userData.interest}</StyledText>
        <StyledText className="text-xl font-bold mt-2 mb-1 text-purple-800">About you:</StyledText>
        <StyledText className="text-lg text-purple-600">{userData.description}</StyledText>
        <StyledText className="text-xl font-bold mt-2 mb-1 text-purple-800">Looking for:</StyledText>
        <StyledText className="text-lg text-purple-600">{userData.lookingFor}</StyledText>
        <StyledView className="flex-row items-center mt-5">
          <StyledText className="text-lg text-purple-800 mr-3">Open to Serendipity:</StyledText>
          <Switch
            value={isLocationTracking}
            onValueChange={setIsLocationTracking}
          />
        </StyledView>
        <Button 
          title="Meet Someone" 
          onPress={() => navigation.navigate('MeetSomeone')} 
          color="#8A2BE2"
        />
      </StyledView>
    </StyledView>
  );
}