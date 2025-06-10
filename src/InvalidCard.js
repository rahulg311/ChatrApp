import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';

export default function InvalidCard() {
  return (
    <View style={styles.card}>
      {/* Your normal content */}
      <View style={styles.content}>
        <Text style={styles.text}>DL51EV9767</Text>
        <Text style={styles.text}>AIIMS Ring Road</Text>
      </View>

      {/* INVALID overlay */}
      <View style={styles.invalidOverlay}>
        <Text style={styles.invalidText}>INVALID</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignSelf: 'center',
    marginTop: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  content: {
    zIndex: 1, // ensure content stays under the overlay
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  invalidOverlay: {
    position: 'absolute',
    top: '40%',
    left: '-10%',
    transform: [{rotate: '-20deg'}],
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  invalidText: {
    color: 'red',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
