import { API_BASE_URL } from '../lib/api';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function QuickVideo() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Energetic');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<any>(null);

  const handleGenerate = () => {
    if (!topic) return;
    setLoading(true);

    fetch(`${API_BASE_URL}/video-projects/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId: 'mock-ws', topic, tone, durationSeconds: parseInt(duration) || 30 })
    })
    .then(res => res.json())
    .then(data => { setScript(data.script); setLoading(false); })
    .catch(() => setLoading(false));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quick Video</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Tone</Text>
        <TextInput style={styles.input} placeholder="e.g., Funny" value={tone} onChangeText={setTone} />
        <Text style={styles.label}>Duration (sec)</Text>
        <TextInput style={styles.input} placeholder="30" value={duration} onChangeText={setDuration} keyboardType="numeric" />
        <Text style={styles.label}>Topic</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Day in the life"
          value={topic}
          onChangeText={setTopic}
        />

        <TouchableOpacity style={styles.button} onPress={handleGenerate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Script</Text>
          )}
        </TouchableOpacity>
      </View>

      {script && (
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>Generated Script</Text>
          <Text style={styles.resultLabel}>Hook:</Text>
          <Text style={styles.resultText}>{script.hook}</Text>

          <Text style={styles.resultLabel}>Scene 1:</Text>
          <Text style={styles.resultText}>{script.scenes[0].description}</Text>

          <Text style={styles.resultLabel}>CTA:</Text>
          <Text style={styles.resultText}>{script.cta}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  form: { marginBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultCard: { padding: 20, backgroundColor: '#f8f9fa', borderRadius: 10, borderWidth: 1, borderColor: '#e9ecef' },
  resultHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  resultLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginTop: 10 },
  resultText: { fontSize: 16, marginTop: 4, color: '#333' }
});
