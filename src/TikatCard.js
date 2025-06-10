import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TicketLoader from './TicketLoader';

const {width} = Dimensions.get('window');

function TikatCard({route, navigation}) {
  const {busNumber, ticketSingle} = route.params;
  const displayData = busNumber?.vehicle ? busNumber : ticketSingle;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // After 3s, show ticket
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
   
      {isLoading ? (
        <TicketLoader /> // Your custom loading component
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.headerBar}>
            <Text
              style={styles.warningIcon}
              onPress={() => navigation.navigate('Home')}>
              X
            </Text>
            <Text style={styles.headerText}> ⚠️Issue with ticket?</Text>
            <Text
              style={styles.allTickets}
              onPress={() => navigation.navigate('AllBusTickets')}>
              All tickets
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Transport Dept. of Delhi</Text>

            <View style={styles.row}>
              <Text style={styles.boldText}>{displayData.vehicle}</Text>
              <Text style={styles.boldText}>₹{displayData.payment}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Bus Route</Text>
                <Text style={styles.value}>{displayData.busRoute}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.label}>Fare</Text>
                <Text style={styles.value}>₹{displayData.payment}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Booking Time</Text>
                <Text style={styles.value}>
                  
                  {displayData.currentDate} | {displayData.currentTime}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.label}>Tickets</Text>
                <Text style={styles.value}>{displayData.tickets}</Text>
              </View>
            </View>

            <View style={{marginBottom: 8}}>
              <Text style={styles.label}>Starting stop</Text>
              <Text style={styles.value}>{displayData.start}</Text>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.label}>Ending stop</Text>
              <Text style={styles.value}>{displayData.end}</Text>
            </View>

            <Text style={styles.ticketId}>
              T{displayData.Tikatdate}ef5ea0056c
            </Text>

            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => navigation.navigate('QrCard')} 
              >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="qr-code" size={22} color="#34A853" />
                {/* <View style={{width: 8}}  > </View>  */}
                <Text style={styles.qrText}> {" "}Show QR code</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.ondc}>
              {/* <Text style={{ color: "#000" }}>ON</Text>
          <Text style={{ color: "#2563eb" }}>DC </Text> */}
              <Image
                source={require('./assets/network.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />

              {/* <Text style={{ color: "#000" }}>NETWORK</Text> */}
            </View>
          </View>

          {/* INVALID overlay */}
          {!displayData.isValid && (
            <View style={styles.invalidOverlay}>
              <View style={styles.invalidImageWrapper}>
                <Image
                  source={require('./assets/INVALID_stamp_no_border.png')}
                  style={styles.invalidImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00c4cc',
    // backgroundColor:"#rgba(47, 197, 189, 0.85)",
    alignItems: 'center',
    paddingTop: 20,
  },
  headerBar: {
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // spacing between icon and text (React Native >= 0.71)
  },
  qrText: {
    fontSize: 16,
    color: '#34a853',
    fontWeight: '600',
  },
  warningIcon: {
    fontSize: 18,
    color: '#fff',
  },
  headerText: {
    color: '#fff',
    fontSize: 17,
  },
  allTickets: {
    color: '#fff',
    fontSize: 17,
    textDecorationLine: 'underline',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.9,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginTop: 80,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    color:"#000f"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  divider: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  label: {
    color: '#000',
    fontSize: 15,
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    fontWeight: '590',
     color:"#000f"
  },
  boldText: {
    fontWeight: '490',
    fontSize: 18,
     color:"#000f"
  },
  ticketId: {
    textAlign: 'center',
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
  },
  qrButton: {
    border: '#1px solid #a3d9b1',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    marginBottom: 10,
  },
  qrText: {
    color: '#34a853',

    fontWeight: '600',
  },
  ondc: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  logoImage: {
    width: 150,
    height: 40,
    alignSelf: 'center',
    marginTop: 8,
    marginLeft: 3,
  },

  invalidOverlay: {
    position: 'absolute',
    top: '50%',
    left: '15%',
    transform: [{rotate: '-15deg'}],
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  invalidImageWrapper: {
    borderWidth: 4,
    borderColor: '#B22B1F',
    borderRadius: 8,
    padding: 4,
  },
  invalidImage: {
    width: 240,
    height: 50,
  },
});

export default TikatCard;
