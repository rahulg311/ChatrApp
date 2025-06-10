import React from 'react';
import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';

const TicketLoader = ({route}) => {
  const {loderData = ''} = route?.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.loaderBox}>
        <View style={styles.spinnerWrapper}>
          {/* <ActivityIndicator size="large" color="#0B3BA7" style={styles.spinner} /> */}
          <ActivityIndicator
            size="large"
            color="#0B3BA7"
            style={[styles.spinner, {transform: [{scale: 2.0}]}]}
          />
          <View style={styles.logoContainer}>
            <Image
              // source={require('./assets/logo.png')} // 🔁 Replace with your actual logo path
              source={require('./assets/chtarapp.png')} // Replace with your logo path
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.text}>Fetching {loderData}...</Text>
      </View>
    </View>
  );
};

export default TicketLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555', // dark gray background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    width: 300,
    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  spinnerWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    position: 'absolute',
    borderRadius: 100,
    zIndex: 1,
  },
  logoContainer: {
    width: 30,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});
