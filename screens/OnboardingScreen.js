import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    interest: '',
    description: '',
    lookingFor: '',
  });
  const [photo, setPhoto] = useState(null);

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step > 0 ? step - 1 : 0);
  const handleInputChange = (field, value) => setUserData({ ...userData, [field]: value });

  const requestPermissions = async () => {
    await Location.requestForegroundPermissionsAsync();
    await Notifications.requestPermissionsAsync();
    navigation.replace('Main', { userData, photo });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StyledView className="w-4/5 items-center justify-center bg-gray-100 p-5 rounded-lg shadow-lg">
            <Image source={require('../assets/logo.png')} style={{ width: 200, height: 100, marginBottom: 20 }} />
            <StyledText className="text-3xl font-extrabold mb-5 text-gray-800">Welcome to Venn</StyledText>
            <Button title="Get Started" onPress={handleNextStep} color="#1E90FF" />
          </StyledView>
        );
      case 1:
        return (
          <StyledView className="w-4/5 items-center justify-center bg-blue-100 p-5 rounded-lg shadow-lg">
            <StyledText className="text-3xl font-extrabold mb-5 text-blue-800">What's your name?</StyledText>
            <StyledTextInput
              className="w-72 h-12 border-2 border-blue-300 mb-5 px-3 rounded-lg"
              value={userData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your name"
              placeholderTextColor="gray"
            />
            {photo && <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />}
            <Button title="Upload Photo" onPress={pickImage} color="#1E90FF" />
            <StyledView className="flex-row justify-end w-full">
              <Button title="Next" onPress={handleNextStep} color="#1E90FF" />
            </StyledView>
          </StyledView>
        );
      case 2:
        return (
          <StyledView className="w-4/5 items-center justify-center bg-green-100 p-5 rounded-lg shadow-lg">
            <StyledText className="text-3xl font-extrabold mb-5 text-green-800">What are you interested in?</StyledText>
            {['Friends', 'Dating', 'Professional'].map((option) => (
              <Button
                key={option}
                title={option}
                onPress={() => {
                  handleInputChange('interest', option);
                  handleNextStep();
                }}
                color="#32CD32"
              />
            ))}
            <StyledView className="flex-row justify-between w-full mt-5">
              <Button title="Back" onPress={handlePreviousStep} color="#1E90FF" />
            </StyledView>
          </StyledView>
        );
      case 3:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <StyledView className="w-4/5 items-center justify-center bg-yellow-100 p-5 rounded-lg shadow-lg">
              <StyledText className="text-3xl font-extrabold mb-5 text-yellow-800">Tell us about yourself</StyledText>
              <StyledTextInput
                className="w-72 h-24 border-2 border-yellow-300 mb-5 px-3 rounded-lg"
                value={userData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Describe yourself"
                placeholderTextColor="gray"
                multiline
              />
              <StyledText className="text-3xl font-extrabold mb-5 text-yellow-800">What are you looking for?</StyledText>
              <StyledTextInput
                className="w-72 h-24 border-2 border-yellow-300 mb-5 px-3 rounded-lg"
                value={userData.lookingFor}
                onChangeText={(text) => handleInputChange('lookingFor', text)}
                placeholder="Describe what you're looking for"
                placeholderTextColor="gray"
                multiline
              />
              <StyledView className="flex-row justify-between w-full">
                <Button title="Back" onPress={handlePreviousStep} color="#1E90FF" />
                <Button title="Next" onPress={handleNextStep} color="#FFD700" />
              </StyledView>
            </StyledView>
          </TouchableWithoutFeedback>
        );
      case 4:
        return (
          <StyledView className="w-4/5 items-center justify-center bg-red-100 p-5 rounded-lg shadow-lg">
            <StyledText className="text-3xl font-extrabold mb-5 text-red-800">Permissions</StyledText>
            <StyledText className="mb-5 text-red-600">We need your permission for background location and notifications.</StyledText>
            <StyledView className="flex-row justify-between w-full">
              <Button title="Back" onPress={handlePreviousStep} color="#1E90FF" />
              <Button title="Grant Permissions" onPress={requestPermissions} color="#FF4500" />
            </StyledView>
          </StyledView>
        );
      default:
        return (
          <StyledView className="w-4/5 items-start bg-purple-100 p-5 rounded-lg shadow-lg">
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
          </StyledView>
        );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <StyledView className="flex-1 bg-gray-50 items-center justify-center">
        {renderStep()}
      </StyledView>
    </TouchableWithoutFeedback>
  );
}