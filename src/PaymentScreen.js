import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PaymentScreen = ({navigation}) => {
  const paymentOptions = [
    {
      name: 'GPay',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png',
    },
    {
      name: 'Paytm',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/paytm-icon.png',
    },

    {
      name: 'Amazon Pay UPI',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png',
    },
  ];
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Choose Payment Mode</Text>
      </View>

      {/* UPI Section */}
      <Text style={styles.sectionTitle}>UPI</Text>
      <View style={styles.card}>
        {paymentOptions.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionRow}
            onPress={() =>
              navigation.navigate('TicketLoader', {loderData: method.name})
            }>
            <Image source={{uri: method.logo}} style={styles.icon} />
            <Text style={styles.optionText}>{method.name}</Text>
            <MaterialIcons name="chevron-right" size={22} color="#000" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Others */}
      <Text style={styles.sectionTitle}>Others</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() =>
            navigation.navigate('TicketLoader', {loderData: 'Wallet, Cards'})
          }>
          <FontAwesome
            name="credit-card"
            size={20}
            color="#000"
            style={styles.walletIcon}
          />
          <Text style={styles.optionText}>Wallet, Cards, Net Banking</Text>
          <MaterialIcons name="chevron-right" size={22} />
        </TouchableOpacity>
      </View>

      {/* Chartr Wallet */}
      <Text style={styles.sectionTitle}>Chartr Wallet</Text>
      <View style={styles.chartrCard}>
        <Text style={styles.lowBalance}>Low balance!</Text>
        <View style={styles.chartrTop}>
          <Text style={styles.chartrTitle}>
            ⚡ Chartr Wallet -{' '}
            <Text style={styles.highlight}>Instant Payment</Text>
          </Text>
          <MaterialIcons name="chevron-right" size={22} color="#fff" />
        </View>
        <Text style={styles.walletBalance}>Wallet Balance: ₹85.00</Text>
        <View style={styles.addButtons}>
          <TouchableOpacity style={styles.rechargeButton}>
            <Text
              style={styles.rechargeText}
              onPress={() =>
                navigation.navigate('TicketLoader', {loderData: 'Add Data'})
              }>
              Add ₹50
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeButton}>
            <Text
              style={styles.rechargeText}
              onPress={() =>
                navigation.navigate('TicketLoader', {loderData: 'Add Data'})
              }>
              Add ₹100
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerHeading}>
          Use Paytm UPI or UPI Lite to book any public transport ticket
        </Text>
        <TouchableOpacity style={styles.bookNow}>
          <Text style={{color: '#fff'}}>Book Now →</Text>
        </TouchableOpacity>
        <Text style={styles.cashback}>Get up to ₹20 Cashback</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#000"
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  walletIcon: {
    width: 24,
    marginRight: 8,
  },
  chartrCard: {
    backgroundColor: '#1e4f92',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  lowBalance: {
    color: '#fff',
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 12,
  },
  chartrTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartrTitle: {
    color: '#fff',
    fontSize: 16,
  },
  highlight: {
    fontWeight: 'bold',
    color: 'yellow',
  },
  walletBalance: {
    marginTop: 4,
    color: '#fff',
  },
  addButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  rechargeButton: {
    backgroundColor: '#00c4cc',
    padding: 10,
    borderRadius: 6,
  },
  rechargeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  banner: {
    backgroundColor: '#c9f3ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  bannerHeading: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  bookNow: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  cashback: {
    fontWeight: 'bold',
    color: '#003366',
  },
});

export default PaymentScreen;
