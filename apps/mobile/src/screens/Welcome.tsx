import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  const handleDemoLogin = () => {
    // In a live app, this would perform OAuth or call the API backend to get a NextAuth JWT payload
    console.log('Initiating Demo Auth Flow...');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }], // Matches AppNavigation tab name
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="sparkles" size={64} color="#2563eb" />
          <Text style={styles.title}>ContentCommand AI</Text>
          <Text style={styles.subtitle}>Create. Schedule. Publish. Track. Profit.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDemoLogin}>
            <Text style={styles.primaryButtonText}>Continue to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => console.log('Mock OAuth via Browser')}>
            <Ionicons name="logo-github" size={20} color="#111827" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryButtonText}>Sign in with GitHub</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 64 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 8, textAlign: 'center' },
  buttonContainer: { gap: 16 },
  primaryButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  secondaryButtonText: { color: '#111827', fontSize: 16, fontWeight: '600' }
});
