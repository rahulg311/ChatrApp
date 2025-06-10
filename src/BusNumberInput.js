import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TextInput, StyleSheet, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // ADD THIS
import AsyncStorage from '@react-native-async-storage/async-storage';

const BusNumberInput = () => {
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const navigation = useNavigation(); // ADD THIS

  // cureent date and time
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [Tikatdate, setTikatdate] = useState('');

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

  const handleChange = async (text, index) => {
    const newDigits = [...digits];
    newDigits[index] = text;
    setDigits(newDigits);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }

    const enteredNumber = newDigits.join('');

    if (enteredNumber.length === 4 && !newDigits.includes('')) {
      navigation.navigate('TicketDetails', {enteredNumber: enteredNumber});
    }
    //   const newData = {
    //     busRoute: "540",
    //     vehicle: `DL51EV${enteredNumber}`,
    //     payment: "13.75",
    //     tickets: "1",
    //     // start: "Sadhna Enc..",
    //     // end: "AIIMS",
    //     start: "AIIMS",
    //     end: "Sadhna Enc..",
    //     currentTime: time,
    //     currentDate: date,
    //     Tikatdate: Tikatdate,
    //     status: 'Success',
    //     isValid: true,
    //     createdAt: new Date().toISOString(),
    //   };

    //   try {
    //     // Step 1: Get existing data
    //     const existingData = await AsyncStorage.getItem('tikats');
    //     let tikatsArray = [];

    //     if (existingData !== null) {
    //       tikatsArray = JSON.parse(existingData); // Existing array
    //     }

    //     // Step 2: Add new data
    //     tikatsArray.push(newData);

    //     // Step 3: Save updated array
    //     await AsyncStorage.setItem('tikats', JSON.stringify(tikatsArray));

    //     console.log('Ticket added successfully');

    //     // ✅ Now Navigate after saving
    //     navigation.navigate('TikatCard', { busNumber: newData });

    //   } catch (error) {
    //     console.error('Failed to store ticket:', error);
    //   }
    // }
  };

  const handleKeyPress = ({nativeEvent}, index) => {
    if (nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.handleIndicator} />

      <Text style={styles.heading}>Enter Bus Number (Last 4 digits)</Text>
      <Text style={styles.subHeading}>Like 1234 for DL 1PC 1234</Text>

      <View style={styles.inputContainer}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.inputBox}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)} // ADD THIS
            ref={ref => (inputs.current[index] = ref)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 40,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    color: '#777',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  inputBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
  },
});

export default BusNumberInput;
