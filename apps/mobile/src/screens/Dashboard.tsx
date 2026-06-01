import { API_BASE_URL } from '../lib/api';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Scheduled</Text>
          <Text style={styles.cardValue}>42</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Published</Text>
          <Text style={styles.cardValue}>128</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Drafts</Text>
          <Text style={styles.cardValue}>15</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Upcoming Posts</Text>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Launch Announcement</Text>
        <Text style={styles.itemSubtitle}>Twitter • Tomorrow, 10:00 AM</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>Weekly Tips</Text>
        <Text style={styles.itemSubtitle}>Instagram • Wed, 2:00 PM</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#212529',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
});
