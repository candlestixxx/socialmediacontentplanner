import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function Settings() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.itemTitle}>Account Settings</Text>
          <Text style={styles.itemChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.itemTitle}>Notifications</Text>
          <Text style={styles.itemChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.itemTitle}>Billing & Subscription</Text>
          <Text style={styles.itemChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, styles.lastItem]}>
          <Text style={styles.itemTitle}>Help & Support</Text>
          <Text style={styles.itemChevron}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemTitle: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  itemChevron: {
    fontSize: 20,
    color: '#9ca3af',
  },
  logoutButton: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
