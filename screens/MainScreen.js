import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

export default function MainScreen({ route, navigation }) {
  const { userData, photo } = route.params;
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  useEffect(() => {
    let locationInterval;
    if (isLocationTracking) {
      locationInterval = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({});
        console.log('Current location:', location);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Meet Someone!",
            body: "There's someone in your area you should meet.",
          },
          trigger: { seconds: 10 },
        });
      }, 5000);
    }

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isLocationTracking]);

  return (
    <StyledView className="flex-1 bg-purple-100 p-5">
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