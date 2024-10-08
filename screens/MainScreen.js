import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, Image } from 'react-native'; // Import Image from react-native
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { styled } from 'nativewind';
import { supabase } from '../lib/utils/supabase'; // Import the Supabase client

const StyledView = styled(View);
const StyledText = styled(Text);

export default function MainScreen({ route, navigation }) {
  const { userData } = route.params;
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [lastNotifiedUser, setLastNotifiedUser] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*') // Ensure 'photo' is selected
        .eq('uuid', userData.uuid)
        .single();

      if (error) throw error;

      // Convert the photo blob to a Base64 string
      // const base64Photo = `data:image/jpeg;base64,${Buffer.from(data.profile_photo).toString('base64')}`;

      setUserDetails({ ...data });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateUserPreferences = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ open_to_serendipity: isLocationTracking })
        .eq('uuid', userData.uuid);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  useEffect(() => {
    updateUserPreferences(); // Update preferences when location tracking changes
  }, [isLocationTracking]);

  useEffect(() => {
    let locationInterval;
    if (isLocationTracking) {
      locationInterval = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({});
        if (location) {
          const { latitude, longitude } = location.coords;
          try {
            const { error } = await supabase
              .from('users')
              .update([
                {
                  location: `POINT(${longitude} ${latitude})`, // Use the current location
                },
              ])
              .eq('uuid', userData.uuid);

            if (error) throw error;

            // Query for nearby users with the same interest, open to serendipity, and exclude self
            const { data: fetchedNearbyUsers, error: queryError } = await supabase
              .rpc('get_nearby_users', { longitude: longitude, latitude: latitude, exclude_uuid: userData.uuid });

            if (queryError) {
              console.error('Error fetching nearby users:', queryError);
            } else {
              setNearbyUsers(fetchedNearbyUsers); // Store the nearby users in state
            }

            if (fetchedNearbyUsers && fetchedNearbyUsers.length > 0) {
              const newUser = fetchedNearbyUsers[0]; // Assuming you notify about the first nearby user
              if (lastNotifiedUser !== newUser.uuid) {
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Meet A Stranger!",
                    body: "There's someone in your area with shared interests.",
                    data: { nearbyUserUuid: newUser.uuid }, // Include the UUID of the nearby user
                  },
                  trigger: { seconds: 1 },
                });
                setLastNotifiedUser(newUser.uuid);
              }
            }
          } catch (error) {
            console.error('Error updating user location or querying nearby users:', error);
          }
        }
      }, 5000);
    }

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isLocationTracking, lastNotifiedUser]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const nearbyUserUuid = response.notification.request.content.data.nearbyUserUuid;
      const nearbyUser = nearbyUsers.find(user => user.uuid === nearbyUserUuid);
      
      if (nearbyUser) {
        navigation.navigate('MeetSomeone', { 
          nearbyUser: {
            name: nearbyUser.name,
            description: nearbyUser.description,
            lookingFor: nearbyUser.looking_for,
            // avatarUrl: nearbyUser.profile_photo, // Assuming the photo URL is stored in profile_photo
            // Add any other relevant user data here
          }
        });
      } else {
        console.error('Nearby user not found');
        // Handle the case where the nearby user is not found
        // You might want to navigate to a fallback screen or show an error message
      }
    });

    return () => {
      subscription.remove();
    };
  }, [nearbyUsers]);

  if (!userDetails) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <StyledText className="text-lg text-purple-800">Loading...</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-purple-100 p-5 justify-center items-center">
      <StyledView className="w-full bg-purple-100 p-5 rounded-lg shadow-lg">
        <StyledText className="text-3xl font-extrabold mb-5 text-purple-800">Welcome, {userDetails.name}!</StyledText>
        <StyledText className="text-lg text-purple-600">Interest: {userDetails.interest}</StyledText>
        <StyledText className="text-xl font-bold mt-2 mb-1 text-purple-800">About you:</StyledText>
        <StyledText className="text-lg text-purple-600">{userDetails.description}</StyledText>
        <StyledText className="text-xl font-bold mt-2 mb-1 text-purple-800">Looking for:</StyledText>
        <StyledText className="text-lg text-purple-600">{userDetails.looking_for}</StyledText>
        <StyledView className="flex-row items-center mt-5">
          <StyledText className="text-lg text-purple-800 mr-3">Open to Serendipity:</StyledText>
          <Switch
            value={isLocationTracking}
            onValueChange={setIsLocationTracking}
          />
        </StyledView>
        {/* <Button 
          title="Meet Someone" 
          onPress={() => navigation.navigate('MeetSomeone')} 
          color="#8A2BE2"
        /> */}
      </StyledView>
    </StyledView>
  );
}