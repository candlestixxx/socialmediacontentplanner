import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function PostReview() {
  const [activePlatform, setActivePlatform] = useState<'TWITTER' | 'LINKEDIN'>('TWITTER');

  const mockContent = "Excited to announce the launch of ContentCommand v4.7! 🚀\n\nWe've completely overhauled the mobile experience and integrated native social previews directly into your workflow. Building the future of AI-driven marketing.\n\n#ContentCommand #AI #Marketing";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Preview & Review</Text>
      <Text style={styles.subtitle}>See exactly how your post will look when published.</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activePlatform === 'TWITTER' && styles.activeTab]}
          onPress={() => setActivePlatform('TWITTER')}
        >
          <Text style={[styles.tabText, activePlatform === 'TWITTER' && styles.activeTabText]}>Twitter / X</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activePlatform === 'LINKEDIN' && styles.activeTab]}
          onPress={() => setActivePlatform('LINKEDIN')}
        >
          <Text style={[styles.tabText, activePlatform === 'LINKEDIN' && styles.activeTabText]}>LinkedIn</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        {activePlatform === 'TWITTER' ? (
          <View style={styles.twitterCard}>
            <View style={styles.twitterHeader}>
              <View style={styles.avatarPlaceholder} />
              <View>
                <Text style={styles.twitterName}>ContentCommand</Text>
                <Text style={styles.twitterHandle}>@ContentCmd</Text>
              </View>
            </View>
            <Text style={styles.twitterContent}>{mockContent}</Text>
            <View style={styles.twitterActions}>
              <Text style={styles.twitterActionIcon}>💬</Text>
              <Text style={styles.twitterActionIcon}>🔁</Text>
              <Text style={styles.twitterActionIcon}>❤️</Text>
              <Text style={styles.twitterActionIcon}>📊</Text>
            </View>
          </View>
        ) : (
          <View style={styles.linkedinCard}>
            <View style={styles.linkedinHeader}>
              <View style={styles.avatarPlaceholderSquare} />
              <View>
                <Text style={styles.linkedinName}>ContentCommand AI</Text>
                <Text style={styles.linkedinSub}>10,492 followers</Text>
                <Text style={styles.linkedinTime}>Just now • 🌐</Text>
              </View>
            </View>
            <Text style={styles.linkedinContent}>{mockContent}</Text>
            <View style={styles.linkedinStats}>
              <Text style={styles.linkedinStatsText}>👍 ❤️ 👏 42</Text>
              <Text style={styles.linkedinStatsText}>12 comments</Text>
            </View>
            <View style={styles.linkedinActions}>
              <Text style={styles.linkedinActionText}>👍 Like</Text>
              <Text style={styles.linkedinActionText}>💬 Comment</Text>
              <Text style={styles.linkedinActionText}>🔁 Repost</Text>
              <Text style={styles.linkedinActionText}>✈️ Send</Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.publishButton}>
        <Text style={styles.publishButtonText}>Approve & Schedule</Text>
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
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#111827',
  },
  previewContainer: {
    marginBottom: 32,
  },
  // Twitter Styles
  twitterCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  twitterHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1d5db',
    marginRight: 12,
  },
  twitterName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f1419',
  },
  twitterHandle: {
    fontSize: 14,
    color: '#536471',
  },
  twitterContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0f1419',
    marginBottom: 16,
  },
  twitterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 40,
    marginTop: 8,
  },
  twitterActionIcon: {
    fontSize: 18,
    color: '#536471',
  },
  // LinkedIn Styles
  linkedinCard: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  linkedinHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatarPlaceholderSquare: {
    width: 48,
    height: 48,
    backgroundColor: '#d1d5db',
    marginRight: 12,
  },
  linkedinName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
  },
  linkedinSub: {
    fontSize: 12,
    color: '#666666',
  },
  linkedinTime: {
    fontSize: 12,
    color: '#666666',
  },
  linkedinContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  linkedinStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  linkedinStatsText: {
    fontSize: 12,
    color: '#666666',
  },
  linkedinActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  linkedinActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  publishButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
