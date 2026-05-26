import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const MOCK_CAMPAIGNS = [
  { id: '1', name: 'Summer Launch', status: 'Active', posts: 12 },
  { id: '2', name: 'Q3 Retargeting', status: 'Draft', posts: 0 },
];

export default function Campaigns() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaigns</Text>
      <FlatList
        data={MOCK_CAMPAIGNS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.posts} posts • {item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  card: { padding: 15, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, marginBottom: 10, backgroundColor: '#f9f9f9' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
});
