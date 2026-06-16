import { StyleSheet, Text, View, Button } from 'react-native';

export default function Login({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button title="Enter Dashboard" onPress={() => navigation.replace('MainTabs')} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 } });
