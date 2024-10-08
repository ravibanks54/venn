import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fuoefhipwekxqptyiook.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1b2VmaGlwd2VreHFwdHlpb29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MDc3MzUsImV4cCI6MjA0Mzk4MzczNX0.d2PqreQr8k8p7R714Qn8oo47jOBuHwmRB_VwWZbahfc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
