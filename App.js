import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    interest: '',
    description: '',
    lookingFor: '',
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const requestPermissions = async () => {
    const { status: locationStatus } = await Location.requestBackgroundPermissionsAsync();
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    
    console.log('Location permission:', locationStatus);
    console.log('Notification permission:', notificationStatus);
    
    // Move to main screen after requesting permissions
    setStep(5);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your name?</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your name"
            />
            <Button title="Next" onPress={handleNextStep} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are you interested in?</Text>
            {['Friends', 'Dating', 'Professional'].map((option) => (
              <Button
                key={option}
                title={option}
                onPress={() => {
                  handleInputChange('interest', option);
                  handleNextStep();
                }}
              />
            ))}
          </View>
        );
      case 3:
        return (
          <View contentContainerStyle={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={userData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Describe yourself"
              multiline
            />
            <Text style={styles.stepTitle}>What are you looking for?</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={userData.lookingFor}
              onChangeText={(text) => handleInputChange('lookingFor', text)}
              placeholder="Describe what you're looking for"
              multiline
            />
            <Button title="Next" onPress={handleNextStep} />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Permissions</Text>
            <Text>We need your permission for background location and notifications.</Text>
            <Button title="Grant Permissions" onPress={requestPermissions} />
          </View>
        );
      default:
        return (
          <View style={styles.mainScreen}>
            <Text style={styles.mainTitle}>Welcome, {userData.name}!</Text>
            <Text>Interest: {userData.interest}</Text>
            <Text style={styles.sectionTitle}>About you:</Text>
            <Text>{userData.description}</Text>
            <Text style={styles.sectionTitle}>Looking for:</Text>
            <Text>{userData.lookingFor}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 300, // Fixed width for input boxes
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  mainScreen: {
    width: '80%',
    alignItems: 'flex-start',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});
