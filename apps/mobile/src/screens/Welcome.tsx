import { StyleSheet, Text, View, Button } from 'react-native';

export default function Welcome({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ContentCommand AI</Text>
      <Text style={styles.subtitle}>Welcome to the App</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24, fontWeight: 'bold' }, subtitle: { fontSize: 16, marginVertical: 20 } });
