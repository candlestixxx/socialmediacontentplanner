import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function Calendar() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.toggleText}>List View ▼</Text>
      </View>

      <ScrollView>
        <Text style={styles.dateHeader}>Today</Text>
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Twitter: Launch Announcement</Text>
          <Text style={styles.eventTime}>10:00 AM</Text>
        </View>

        <Text style={styles.dateHeader}>Tomorrow</Text>
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Instagram: Behind the Scenes</Text>
          <Text style={styles.eventTime}>2:00 PM</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  toggleText: { fontSize: 16, color: '#007bff' },
  dateHeader: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#333' },
  eventCard: { padding: 15, borderRadius: 8, backgroundColor: '#eef2ff', borderWidth: 1, borderColor: '#d0d9ff', marginBottom: 10 },
  eventTitle: { fontSize: 16, fontWeight: '500', color: '#1e3a8a' },
  eventTime: { fontSize: 14, color: '#3b82f6', marginTop: 5 },
});
