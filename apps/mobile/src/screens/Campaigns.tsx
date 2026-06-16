import { API_BASE_URL, apiClient } from '../lib/api';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';

export default function CampaignsScreen() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const data = await apiClient.get('/campaigns');
      if (Array.isArray(data)) setCampaigns(data);
    } catch (e) {
      console.warn('Campaign fetch failed', e);
      setCampaigns([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCampaigns();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Active Campaigns</Text>

      {campaigns.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No campaigns found.</Text>
        </View>
      ) : (
        campaigns.map(c => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{c.name}</Text>
              <View style={[styles.badge, c.status === 'ACTIVE' ? styles.badgeActive : styles.badgeDraft]}>
                <Text style={[styles.badgeText, c.status === 'ACTIVE' ? styles.badgeTextActive : styles.badgeTextDraft]}>
                  {c.status}
                </Text>
              </View>
            </View>
            <Text style={styles.dateText}>
              {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'TBD'} -
              {c.endDate ? new Date(c.endDate).toLocaleDateString() : ' TBD'}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateText: { color: '#6b7280', fontSize: 16 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  dateText: { fontSize: 14, color: '#6b7280' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeActive: { backgroundColor: '#dcfce7' },
  badgeDraft: { backgroundColor: '#f3f4f6' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  badgeTextActive: { color: '#166534' },
  badgeTextDraft: { color: '#374151' }
});
