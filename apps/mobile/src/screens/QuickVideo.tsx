import { API_BASE_URL, apiClient } from '../lib/api';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function QuickVideoScreen() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const data = await apiClient.post('/video-projects/generate', {
        topic,
        tone: 'Engaging',
        durationSeconds: 30
      });
      setScript(data.script);
    } catch (e) {
      console.warn('Video generation failed', e);
      setScript('Error generating script.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>AI Video Studio</Text>
      <Text style={styles.subtitle}>Generate a 30s TikTok/Reel script.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Topic</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. AI Marketing Tools"
          value={topic}
          onChangeText={setTopic}
        />
        <TouchableOpacity
          style={[styles.button, !topic && styles.buttonDisabled]}
          onPress={handleGenerate}
          disabled={!topic || isGenerating}
        >
          {isGenerating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Generate Script</Text>}
        </TouchableOpacity>
      </View>

      {script ? (
        <View style={styles.card}>
          <Text style={styles.label}>Generated Script</Text>
          <Text style={styles.scriptText}>{script}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#93c5fd' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  scriptText: { fontSize: 14, lineHeight: 22, color: '#1f2937', fontFamily: 'monospace' }
});
