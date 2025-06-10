import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({navigation}) => {
  


  useEffect(() => {
    const updateTickets = async () => {
      try {
        const getallTickat = await AsyncStorage.getItem('tikats');
        const now = new Date();
        const monthNames = [
          'January',
          'February',
          'March',
          'Apr',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        let today = `${now.getDate()} ${monthNames[now.getMonth()]} ${now
          .getFullYear()
          .toString()
          .slice(-2)}`;

        if (getallTickat) {
          let tickets = JSON.parse(getallTickat);

          const updatedTickets = tickets.map(item =>
            item?.currentDate === today ? item : {...item, isValid: false},
          );

          // Store updated data back in AsyncStorage
          await AsyncStorage.setItem('tikats', JSON.stringify(updatedTickets));

          console.log('Updated tickets:', updatedTickets);
        }
      } catch (error) {
        console.error('Error processing tickets:', error);
      }
    };

    updateTickets();
  }, []);
  const locations = [
    {id: '1', name: 'Kalka Ji Extn.DDA Flat'},
    {id: '2', name: 'Kalka Ji Extn.DDA Flat'},
  ];
  const topItems = [
    {
      label: 'Bus Ticket',
      path: 'BusNumberInput',
      icon: 'film',
      lib: FontAwesome,
    },
    {
      label: 'Metro Ticket',
      icon: 'remove-circle-outline',
      new: true,
      lib: Ionicons,
      path: '',
    },
    {label: 'DTC Daily P...', icon: 'account-circle', lib: MaterialIcons},
    {
      label: 'Monthly Pass',
      icon: 'calendar-today',
      new: true,
      lib: MaterialIcons,
      path: '',
    },
  ];

  const bottomItems = [
    {
      label: 'Chartr Wallet',
      icon: 'wallet-outline',
      lib: Ionicons,
      amount: '₹0.0',
      blue: true,
      path: '',
    },
    {label: 'Route info', path: '', icon: 'signpost-split', lib: FontAwesome},
    {label: 'See All', icon: 'layers-outline', lib: Ionicons, path: ''},
  ];

  const renderIcon = (IconLib, iconName, size = 34) => (
    <IconLib name={iconName} size={size} color="#000" />
  );

  // ne animated
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.logo}>Chartr</Text>
        <Icon name="account-circle" size={28} color="black" />
      </View> */}

      <View
        style={{
          // margin: 16,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 10,
          borderColor: '#e5e5e5',
          borderWidth: 1,
        }}>
        {/* Search bar */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#e4e4e2',
            borderRadius: 20,
            paddingVertical: 6,
            paddingHorizontal: 15,
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Ionicons
            name="search"
            size={20}
            color="#000"
            style={{marginRight: 10}}
          />
          <TextInput
            placeholder="Where do you want to go?"
            placeholderTextColor="#000"
            style={{
              flex: 1,
              color: '#000',
              fontSize: 18,
            }}
          />
        </View>

        {/* Location list */}
        {locations.map((location, index) => (
          <TouchableOpacity
            key={location.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              paddingHorizontal: 5,
              borderTopWidth: index !== 0 ? 1 : 0,
              borderTopColor: '#e0e0e0',
            }}>
            <Ionicons
              name="location-sharp"
              size={20}
              color="#000"
              style={{marginRight: 15}}
            />
            <Text style={{flex: 1, fontSize: 16, color: '#000'}}>
              {location.name}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#000" />
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{
          backgroundColor: '#fff',
          marginTop: 12,
          borderRadius: 12,
          padding: 10,
          borderColor: '#e5e5e5',
          borderWidth: 1,
        }}>
        {/* Top Row */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 10,
            marginTop: 10,
          }}>
          {topItems.map((item, idx) => {
            const IconLib = item.lib;
            return (
              <View key={idx} style={{alignItems: 'center', width: 80}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      item?.path && item.path !== ''
                        ? item.path
                        : 'TicketLoader',
                      {loderData: item.label},
                    )
                  }
                  style={{
                    backgroundColor: '#e6f4ff',
                    borderRadius: 16,
                    padding: 12,
                    position: 'relative',
                  }}>
                  {renderIcon(IconLib, item.icon)}
                  {item.new && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: -1,
                        // backgroundColor: '#d80000',
                        paddingHorizontal: 5,
                        borderRadius: 10,
                        zIndex: 1,
                      }}>
                      {/* <Text style={{color: '#fff', fontSize: 10}}>New</Text> */}
                      <Animated.Text style={[styles.newLabel, {opacity}]}>
                        New
                      </Animated.Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: '480',
                    textAlign: 'center',
                    color: '#000',
                  }}
                  onPress={() =>
                    navigation.navigate(
                      item?.path && item.path !== ''
                        ? item.path
                        : 'TicketLoader',
                      {loderData: item.label},
                    )
                  }>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      {/* Bottom Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 10,
          backgroundColor: '#fff',
        }}>
        {/* Wallet Card */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#2D64B3',
              paddingVertical: 18,
              paddingHorizontal: 16,
              borderRadius: 10,
              alignItems: 'center',
              flexDirection: 'row',
              width: 140,
            }}>
            <Ionicons name="wallet-outline" size={30} color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 6,
                marginLeft: 5,
              }}>
              ₹85
            </Text>
          </View>
          <Text
            style={{
              color: '#000',
              fontSize: 14,
              marginTop: 8,
              fontWeight: '500',
            }}>
            Chartr Wallet
          </Text>
        </TouchableOpacity>

        {/* Route Info */}
        <TouchableOpacity style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TicketLoader', {loderData: ' Route info'})
            }
            style={{
              backgroundColor: '#e6f4ff',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 65,
            }}>
            <FontAwesome name="code-fork" size={24} color="#000" />
          </TouchableOpacity>
          <Text
            onPress={() =>
              navigation.navigate('TicketLoader', {loderData: ' Route info'})
            }
            style={{
              color: '#000',
              fontSize: 14,
              marginTop: 8,
              fontWeight: '500',
            }}>
            Route info
          </Text>
        </TouchableOpacity>

        {/* See All */}
        <TouchableOpacity style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TicketLoader', {loderData: 'See All'})
            }
            style={{
              backgroundColor: '#e6f4ff',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 65,
            }}>
            <MaterialCommunityIcons name="layers" size={24} color="#000" />
          </TouchableOpacity>
          <Text
            style={{
              color: '#000',
              fontSize: 14,
              marginTop: 8,
              fontWeight: '500',
            }}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* tikat view all */}

      <View style={{padding: 16, backgroundColor: '#fff'}}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bus Ticket</Text>
          <Text
            style={styles.headerLink}
            onPress={() => navigation.navigate('AllBusTickets')}>
            View all tickets
          </Text>
        </View>

        {/* Card */}
        <TouchableOpacity style={styles.card}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <Text style={styles.vehicleBox}>DL51EV9613</Text>

            <View style={styles.statusBox}>
              <FontAwesome name="rupee" size={14} color="#000" />
              <Text style={styles.statusText}> Success</Text>
            </View>

            <View style={styles.fareBox}>
              <Text style={styles.fareText}>₹13.75</Text>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#333"
              />
            </View>
          </View>

          {/* Route */}
          {/* <View style={styles.routeRow}>
          <Text style={styles.routeText}>Sadhna Enc...</Text>
          <View style={styles.routeNumberBox}>
            <Text style={styles.routeNumber}>540</Text>
          </View>
          <Text style={styles.routeText}>AIIMS</Text>
        </View> */}
          <View style={styles.routeRow}>
            <Text style={styles.routeText}>Sadhna Enc...</Text>

            <View style={styles.routeLineWrapper}>
              <View style={styles.routeLine} />
              <View style={styles.routeCircle}>
                <Text style={styles.routeNumber}>540</Text>
              </View>
              <View style={styles.routeLine} />
            </View>

            <Text style={styles.routeText}>AIIMS</Text>
          </View>

          {/* Tags Row */}
          <View style={styles.tagsRow}>
            <Text style={styles.tagBox}>DTC</Text>
            <Text
              style={[
                styles.tagBox,
                {backgroundColor: '#f97316', color: '#fff'},
              ]}>
              General
            </Text>
            <Text
              style={[
                styles.tagBox,
                {backgroundColor: '#16a34a', color: '#fff'},
              ]}>
              Success
            </Text>

            <View style={styles.passengerBox}>
              <Ionicons name="person-outline" size={16} color="#000" />
              <Text style={styles.passengerText}> 1</Text>
            </View>
          </View>

          {/* Footer Note */}
         
        </TouchableOpacity>
        <View style={styles.footerNote}>
            <Text style={{textAlign: 'center', color: '#000'}}>
              Click on ticket to view.
            </Text>
          </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 10},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {fontSize: 22, fontWeight: 'bold', color: '#2D5BD2'},

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  newLabel: {
    color: '#fff',
    fontSize: 13,
    backgroundColor: '#rgb(235, 42, 32)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  optionButton: {
    width: '23%',
    backgroundColor: '#E5F4FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    position: 'relative',
  },
  newTag: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  optionText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  walletCard: {
    flex: 1,
    backgroundColor: '#2D5BD2',
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  walletAmount: {
    fontSize: 16,
    color: 'white',
    marginVertical: 4,
  },
  walletText: {
    color: 'white',
    fontSize: 12,
  },
  walletSubCard: {
    flex: 1,
    backgroundColor: '#E5F4FF',
    padding: 12,
    borderRadius: 10,
    marginLeft: 4,
    alignItems: 'center',
  },
  banner: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  bannerText: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D5BD2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#000"
  },
  headerLink: {
    fontSize: 15,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
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
    // fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontSize: 16,
    maxWidth: 100,
     color:"#000"
    
  },
  routeNumberBox: {
    borderWidth: 1.5,
    borderColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  routeNumber: {
    fontWeight: 'bold',
    color: '#22c55e',
    
  },
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  tagBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
    fontSize: 13,
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
  footerNote: {
    backgroundColor: '#d1fae5',
    marginTop: -10,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingVertical: 6,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 8,
  },

  routeText: {
    fontSize: 16,
    fontWeight: '600',
     color:"#000"
  },

  routeLineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  routeLine: {
    height: 2,
    backgroundColor: '#22c55e',
    width: 50,
    zIndex: 1,
  },

  routeCircle: {
    position: 'absolute',
    left: '50%',
    transform: [{translateX: -20}],
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
});

export default HomeScreen;
