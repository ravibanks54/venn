import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';

export default function MeetSomeoneScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleAccept = () => {
    setLoading(true);
    // Simulate waiting for the other person to accept
    setTimeout(() => {
      setLoading(false);
      // Navigate to another screen or show a success message
    }, 5000);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-5">Meet Someone!</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image
        style={{ width: 150, height: 150, marginBottom: 20, opacity: 0.5 }}
      />
      <Text className="text-lg mb-5">Name: J*** D**</Text>
      <Button title="Accept" onPress={handleAccept} disabled={loading} />
      <Button title="Decline" onPress={() => navigation.goBack()} />
      {loading && <Text className="mt-5">Waiting for the other person to accept...</Text>}
    </View>
  );
}
