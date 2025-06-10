import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';

const {width} = Dimensions.get('window');

function QrCard({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text
          style={styles.closeBtn}
          onPress={() => navigation.navigate('Home')}>
          X
        </Text>
        <Text style={styles.issueText}>⚠️ Issue with ticket?</Text>
        <Text style={styles.allTickets}>All tickets</Text>
      </View>

      {/* Center Card with QR */}
      <View style={styles.cardContainer}>
        <Image
          source={require('./assets/qr-code.png')} // Make sure this image exists
          style={styles.qrImage}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00c4cc',
    alignItems: 'center',
    justifyContent: 'center', // Center vertically
  },
  headerBar: {
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 30, // Fix header at top
    zIndex: 1,
  },
  closeBtn: {
    color: '#fff',
    fontSize: 20,
    // fontWeight: 400,
  },
  issueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  allTickets: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.9,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  qrImage: {
    width: width * 0.9,
    height: width * 0.8,
  },
});

export default QrCard;
