import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledButton = styled(Button)
const StyledImage = styled(Image)

export default function MeetSomeoneScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const { nearbyUser } = route.params;

  const handleAccept = () => {
    setLoading(true);
    // Simulate waiting for the other person to accept
    setTimeout(() => {
      setLoading(false);
      alert("You've both accepted!");
      // Navigate to another screen or show a success message
    }, 5000);
  };
console.log(nearbyUser);
  return (
    <StyledView className="flex-1 items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300">
      <StyledView className="bg-white p-5 rounded-lg shadow-lg items-center w-80">
        <StyledText className="text-2xl font-bold mb-5">New Connection Identified!</StyledText>
        <StyledImage
          source={ require('../assets/stranger2.png') }
          className="w-36 h-36 mb-5 rounded-full"
        />
        <StyledText className="text-lg mb-5">Name: {nearbyUser.name}</StyledText>
        <StyledText className="text-lg mb-5">About: {nearbyUser.description}</StyledText>
        <StyledText className="text-lg mb-5">Looking For: {nearbyUser.lookingFor}</StyledText>
        <StyledButton
          title="Accept"
          onPress={handleAccept}
          disabled={loading}
          color="#4CAF50"
        />
        <StyledButton
          title="Decline"
          onPress={() => navigation.goBack()}
          color="#F44336"
        />
        {loading && <StyledText className="mt-5">Waiting for the other person to accept...</StyledText>}
      </StyledView>
    </StyledView>
  );
}
