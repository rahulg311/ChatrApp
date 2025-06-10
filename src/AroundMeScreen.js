// screens/AboutScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AroundMeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the About Page</Text>
      <Button
        title="Go back to Home"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20, marginBottom: 10 },
});
