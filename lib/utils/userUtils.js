import * as SecureStore from 'expo-secure-store';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';

const USER_UUID_KEY = 'USER_UUID';

export async function getOrCreateUserUUID() {
  let uuid = await SecureStore.getItemAsync(USER_UUID_KEY);
  
  if (!uuid) {
    uuid = uuidv4();
    await SecureStore.setItemAsync(USER_UUID_KEY, uuid);
  }
  return uuid;
}