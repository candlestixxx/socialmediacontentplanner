import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function Notifications() {
  const notifications = [
    { id: 1, title: 'Campaign Published', desc: '"Q3 Launch" was successfully published to Twitter and LinkedIn.', time: '2 hours ago', unread: true },
    { id: 2, title: 'AI Generation Complete', desc: 'Your podcast script for "AI in 2026" is ready for review.', time: '5 hours ago', unread: true },
    { id: 3, title: 'New Comment', desc: 'You received a new comment on your recent Facebook post.', time: '1 day ago', unread: false },
    { id: 4, title: 'Subscription Renewed', desc: 'Your Pro plan was successfully renewed.', time: '3 days ago', unread: false },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {notifications.map(note => (
        <View key={note.id} style={[styles.card, note.unread && styles.unreadCard]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, note.unread && styles.unreadText]}>{note.title}</Text>
            {note.unread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.cardDescription}>{note.desc}</Text>
          <Text style={styles.timeText}>{note.time}</Text>
        </View>
      ))}
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadCard: {
    borderLeftColor: '#3b82f6',
    backgroundColor: '#f0fdf4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  unreadText: {
    color: '#111827',
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  }
});
