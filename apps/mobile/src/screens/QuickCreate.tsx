import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function QuickCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Quick Create</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Post Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a descriptive title..."
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Content Body</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your post here..."
          placeholderTextColor="#9ca3af"
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.draftButton}>
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={styles.publishButtonText}>Publish Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  draftButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  draftButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});
