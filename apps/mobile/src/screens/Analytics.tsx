import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function Analytics() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics Overview</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Audience Demographics</Text>
        <Text style={styles.cardDescription}>Detailed breakdown of your audience by age, location, and interests.</Text>
        <View style={styles.placeholderChart}>
          <Text style={styles.placeholderText}>[ Demographics Chart ]</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Engagement Over Time</Text>
        <Text style={styles.cardDescription}>Track your likes, shares, and comments across all platforms.</Text>
        <View style={styles.placeholderChart}>
          <Text style={styles.placeholderText}>[ Engagement Line Graph ]</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Performing Posts</Text>
        <Text style={styles.cardDescription}>Your most popular content this week.</Text>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>1. How to use AI in Marketing</Text>
          <Text style={styles.itemStats}>12k Views • 1.5k Likes</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>2. 10 Tips for Better Copywriting</Text>
          <Text style={styles.itemStats}>8k Views • 950 Likes</Text>
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  placeholderChart: {
    height: 150,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  itemStats: {
    fontSize: 14,
    color: '#6b7280',
  }
});
