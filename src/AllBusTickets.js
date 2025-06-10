import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const AllBusTickets = ({ navigation }) => {
  const [ticketss, setticketss] = useState([]);
  console.log("ticketss",ticketss)

  useEffect(() => {
    apical();
  }, []);

  const apical = async () => {
    try {
      const data = await AsyncStorage.getItem('tikats');
      if (data !== null) {
        let dd = JSON.parse(data);
        setticketss(dd);
      } else {
        console.log("No data found in tikats");
      }
    } catch (error) {
      console.error('Error fetching ticket data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
     {[...ticketss].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
         .map((ticket) => (
        <TouchableOpacity key={ticket.id} style={styles.card} onPress={() => navigation.navigate("TikatCard", { ticketSingle: ticket })}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <Text style={styles.vehicleBox}>{ticket.vehicle}</Text>

            <View style={styles.statusBox}>
              {/* <FontAwesome name="rupee" size={14} color="#000" /> */}
              <EvilIcons name="refresh" color="#000" size={24} />
              <Text style={styles.statusText}> {ticket.status}</Text>
            </View>

            <View style={styles.fareBox}>
              <Text style={styles.fareText}>{ticket.payment}</Text>
              <Ionicons name="information-circle-outline" size={16} color="#333" />
            </View>
          </View>

          {/* Route Row */}
          <View style={styles.routeRow}>
            <Text style={styles.routeText}>{ticket.start}</Text>

            <View style={styles.routeLineWrapper}>
              <View style={styles.routeLine} />
              <View style={styles.routeCircle}>
                <Text style={styles.routeNumber}>540</Text>
              </View>
              <View style={styles.routeLine} />
            </View>

            <Text style={styles.routeText}>{ticket.end}</Text>
          </View>

          {/* Tags Row */}
          <View style={styles.tagsRow}>
            <Text style={styles.tagBox}>DTC</Text>
            <Text style={[styles.tagBox, { backgroundColor: '#F58220', color: '#fff' }]}>General</Text>
            <Text style={[styles.tagBox, { backgroundColor: '#28A745', color: '#fff' }]}>{ticket.status}</Text>

            <View style={styles.passengerBox}>
              <Ionicons name="person-outline" size={16} color="#000" />
              <Text style={styles.passengerText}> 1</Text>
            </View>
          </View>

          {/* INVALID overlay */}
          {!ticket.isValid && (
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
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleBox: {
    backgroundColor: '#eff6ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderColor: '#bfdbfe',
    borderWidth: 1,
    fontWeight: 'bold',
    color:"#000"
  },
  statusBox: {
    backgroundColor: '#d1fae5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    
  },
  statusText: {
    color: '#000',
    fontWeight: '500',
  },
  fareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    
  },
  fareText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 4,
      color:"#000"
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  routeText: {
    fontWeight: 500,
    fontSize: 16,
    maxWidth: 100,
      color:"#000"
  },
  routeLineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  routeLine: {
    height: 2,
    backgroundColor: '#28A745',
    width: 50,
    zIndex: 1,
  },
  routeCircle: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -20 }],
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: '#fff',
  },
  routeNumber: {
    fontWeight: 'bold',
    color: '#22c55e',
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  tagBox: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
    fontSize: 15,
    color: '#000',
  },
  passengerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  passengerText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#000',
  },
  invalidOverlay: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    transform: [{ rotate: '-15deg' }],
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
    width: 190,
    height: 50,
  },
});

export default AllBusTickets;
