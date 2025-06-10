import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TicketLoader from './TicketLoader';

const TicketDetails = ({route, navigation}) => {
  const {enteredNumber} = route.params;
  const [startCity, setStartCity] = useState('Tara Apartments');
  const [endCity, setEndCity] = useState('AIIMS');

  // cureent date and time
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [Tikatdate, setTikatdate] = useState('');

  console.log('time---', time, date);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      setTime(`${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`);
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const year = now.getFullYear();
      setTikatdate(`${day}${month}${year}`);

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
      setDate(
        `${now.getDate()} ${monthNames[now.getMonth()]} ${now
          .getFullYear()
          .toString()
          .slice(-2)}`,
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    'Tara Apartments',
    'Alaknanda Apartments',
    'Don Bosco School',
    'S Block Greater Kailash 2',
    'M Block Greater Kailash 2',
    'Savitri Cinema',
    'Chirag Delhi',
    'Swami Nagar',
    'Panchsheel Enclave',
    'Shahpur Jat',
    'Khel Gaon',
    'Jija Bai I.T.I.',
    'Kamla Nehru College',
    'Neeti Bagh',
    'Uday Park',
    'Ayurvigyan Nagar',
    'South Extension',
    'AIIMS',
  ];

  const busRoute540Reverse = [
    'AIIMS',
    'South Extension',
    'Ayurvigyan Nagar',
    'Uday Park',
    'Neeti Bagh',
    'Kamla Nehru College',
    'Jija Bai I.T.I.',
    'Khel Gaon',
    'Shahpur Jat',
    'Panchsheel Enclave',
    'Swami Nagar',
    'Chirag Delhi',
    'Savitri Cinema',
    'M Block Greater Kailash 2',
    'S Block Greater Kailash 2',
    'Don Bosco School',
    'Alaknanda Apartments',
    'Tara Apartments',
  ];

  const handleChange = async () => {
    if (startCity !== '' && endCity !== '') {
      const newData = {
        busRoute: '540',
        vehicle: `DL51EV${enteredNumber}`,
        payment: '13.75',
        tickets: '1',
        // start: "Sadhna Enc..",
        // end: "AIIMS",
        start: startCity,
        end: endCity,
        currentTime: time,
        currentDate: date,
        Tikatdate: Tikatdate,
        status: 'Success',
        isValid: true,
        createdAt: new Date().toISOString(),
      };

      console.log('all data,', newData);

      try {
        // Step 1: Get existing data
        const existingData = await AsyncStorage.getItem('tikats');
        let tikatsArray = [];

        if (existingData !== null) {
          tikatsArray = JSON.parse(existingData); // Existing array
        }

        // Step 2: Add new data
        tikatsArray.push(newData);

        // Step 3: Save updated array
        await AsyncStorage.setItem('tikats', JSON.stringify(tikatsArray));

        console.log('Ticket added successfully');

        // ✅ Now Navigate after saving
        navigation.navigate('TikatCard', {busNumber: newData});
      } catch (error) {
        console.error('Failed to store ticket:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {' '}
          <MaterialIcons
            style={{gap: 2}}
            name="arrow-back"
            size={24}
            onPress={() => navigation.goBack()}
          />{' '}
          Ticket Details
        </Text>
        {/* <View style={styles.timerBadge}>
          <Text style={styles.timerText}>02:18</Text>
        </View> */}
      </View>

      {/* Card Section */}
      <View style={styles.card}>
        {/* Red Info Row */}
        <View style={styles.redBanner}>
          <Text style={styles.redText}>{date} | {time}</Text>
          <Text style={styles.redText}>DL1PC{enteredNumber}</Text>
        </View>
        <View style={styles.card2}>
          {/* Bus Info */}
          <View style={styles.row}>
            <FontAwesome5
              name="bus"
              size={22}
              color="#fff"
              style={{
                backgroundColor: '#00c4cc',
                padding: 10,
                borderRadius: 20,
                marginTop: -10,
              }}
            />
            <View style={{marginLeft: 10}}>
              <Text style={styles.busNumber}>119</Text>
              {/* <Text style={styles.subText}>towards Old Delhi Railway Station</Text> */}

              <Picker
                selectedValue={startCity}
                style={{
                  height: 50,
                  width: 250,
                  padding: 0,
                  marginTop: -14,
                  marginLeft: -10,
                    color: '#000',
                }}
                 dropdownIconColor="#000"
                mode={'dialog'}
                onValueChange={itemValue => setStartCity(itemValue)}>
                {cities.map(item => (
                  <Picker.Item label={item} value={item} />
                ))}
              </Picker>
            </View>
            {/* <MaterialIcons name="edit" size={20} style={{ marginLeft: 'auto',  color: '#000', }} /> */}
          </View>

          {/* Route Info */}
          <View style={styles.stopSection}>
            <View style={styles.dotColumn}>
              <FontAwesome5 name="circle" size={12} color="#aaa" solid />
              <View style={styles.dottedLine} />
              <FontAwesome5 name="circle" size={12} color="#aaa" />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.stopLabel}>Starting stop</Text>
              <Text style={styles.stopText}>{startCity}</Text>

              <Text style={styles.stopLabel2}>Ending stop</Text>
              <Text style={styles.stopText}>{endCity}</Text>
            </View>
            <MaterialIcons name="edit" size={20} />
          </View>

          {/* Input field */}
          {/* <View style={styles.inputRow}>
          <TextInput
            defaultValue="Old Delhi Railway Station"
            style={styles.textInput}
          />
          <MaterialIcons name="close" size={22} color="#666" />
        </View> */}
          <View style={styles.inputRow}>
            <Picker
              selectedValue={endCity}
              style={{flex: 1,  color: '#000',}}
              mode="dropdown"
               dropdownIconColor="#000"
              onValueChange={itemValue => setEndCity(itemValue)}>
              {busRoute540Reverse.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
            <TouchableOpacity onPress={() => setEndCity('')}>
              <MaterialIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Tickets */}
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Number of tickets</Text>
            <View style={styles.counter}>
              <TouchableOpacity>
                <MaterialIcons name="remove" size={20} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>1</Text>
              <TouchableOpacity>
                <MaterialIcons name="add" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Fare Card */}
      {/* <View style={styles.card}>
        <View style={styles.fareTop}>
          <Text style={styles.fareLabel}>Final Fare</Text>
          <MaterialIcons name="info" size={16} color="#777" />
        </View>
        <Text style={styles.fareText}>
          ₹13.75 <Text style={styles.discountText}>(10% off)</Text>
        </Text>
        <Text style={styles.couponText}>Coupon Applied</Text>
        <Text style={styles.couponCode}>WELCOME10</Text>
      </View> */}
      <View style={styles.card3}>
        <View style={styles.row}>
          <Text style={styles.label}>Final Fare</Text>
          <MaterialIcons
            name="info"
            size={16}
            color="#777"
            style={{marginLeft: 4}}
          />
          <Text style={styles.amount}> ₹13.75 </Text>
          <Text style={styles.discount}>(10% off)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.couponText}>Coupon Applied</Text>
          <Text style={styles.couponCode}>WELCOME10</Text>
        </View>
      </View>
      <View style={styles.topRow}>
        <View style={styles.walletInfo}>
          <Image
            source={require('./assets/chtarapp.png')}
            //    style={{width: 20, height: 20, marginRight: 8}}
            resizeMode="contain"
            style={styles.walletIcon}
          />
          <Text style={styles.walletText}>Wallet</Text>
          <Text style={styles.walletDivider}>|</Text>
          <Text style={styles.walletAmount}>₹85</Text>
        </View>
        <TouchableOpacity
          style={styles.changeBtn}
          onPress={() => navigation.navigate('PaymentScreen')}>
          <Text style={styles.changeText}>Change</Text>
          <MaterialIcons name="chevron-right" size={20} color="#d12d2d" />
        </TouchableOpacity>
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={handleChange}>
        <Text style={styles.payButtonText}>Pay ₹13.75</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 500,
      color:"#000"
  },
  timerBadge: {
    backgroundColor: '#00c4cc',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    elevation: 3,
  },
  card2: {
    // backgroundColor: '#fff',
    // borderRadius: 12,
    padding: 16,
    // marginBottom: 16,
    // shadowColor: '#000',
    // elevation: 3,
  },
  card3: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    elevation: 3,
    // backgroundColor: '#fff',
    // borderRadius: 12,
    padding: 16,
    // marginBottom: 16,
    // shadowColor: '#000',
    // elevation: 3,
  },
  redBanner: {
    backgroundColor: '#00c4cc',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  redText: {
    color: '#fff',
    fontWeight: 'bold',

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#000"
  },
  subText: {
    color: '#555',
    
  },
  stopSection: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 20,
    
    
  },
  dotColumn: {
    alignItems: 'center',
    marginRight: 12,
  },
  dottedLine: {
    height: 50,
    borderLeftWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    
  },
  stopLabel2: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
  },
  stopLabel: {
    // marginTop:10,
    fontSize: 12,
    color: '#999',
  },
  stopText: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 8,
      color:"#000"
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    marginTop: 10,
    height: 40,
    
  },
  textInput: {
    flex: 1,
    height: 40,
    
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketLabel: {
    fontSize: 16,
      color:"#000"
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
      color:"#000"
  },
  fareTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  fareLabel: {
    fontWeight: 'bold',
  },
  fareText: {
    fontSize: 18,
    fontWeight: '600',
  },
  discountText: {
    color: '#00bfa5',
    fontSize: 16,
  },
  couponText: {
    marginTop: 8,
    color: '#f57c00',
  },
  couponCode: {
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#00c4cc',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //   card: {
  //     backgroundColor: '#fff',
  //     borderRadius: 12,
  //     padding: 12,
  //     borderColor: '#ddd',
  //     borderWidth: 1,
  //     marginBottom: 16,
  //   },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#000',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 'auto',
    color: '#000',
  },
  discount: {
    fontWeight: '600',
    fontSize: 18,
    color: 'green',
    marginLeft: 4,
  },
  couponText: {
    color: '#00c4cc',
    fontSize: 15,
  },
  couponCode: {
    // fontWeight: 'bold',
    fontSize: 13,
    color: '#000',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  walletText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  walletDivider: {
    marginHorizontal: 6,
    color: '#aaa',
  },
  walletAmount: {
    fontSize: 18,
    color: '#rgb(214, 63, 63)',
    fontWeight: '600',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: '#rgb(214, 63, 63)',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TicketDetails;
