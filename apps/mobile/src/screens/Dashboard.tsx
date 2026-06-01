import { API_BASE_URL, apiClient } from '../lib/api';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';

export default function DashboardScreen() {
  const [metrics, setMetrics] = useState({ totalViews: 0, totalLikes: 0, totalShares: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      const data = await apiClient.get('/analytics');
      if (data) setMetrics(data);
    } catch (e) {
      console.warn('Dashboard fetch failed', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMetrics();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Workspace Snapshot</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Views</Text>
        <Text style={styles.cardValue}>{metrics.totalViews.toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Likes</Text>
          <Text style={[styles.cardValue, { color: '#16a34a' }]}>{metrics.totalLikes.toLocaleString()}</Text>
        </View>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Shares</Text>
          <Text style={[styles.cardValue, { color: '#9333ea' }]}>{metrics.totalShares.toLocaleString()}</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  halfCard: {
    width: '48%',
  },
  cardTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
  }
});
