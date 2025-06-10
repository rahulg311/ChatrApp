// App.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import AroundMeScreen from './src/AroundMeScreen';
import {Image, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TikatCard from './src/TikatCard';
import BusNumberInput from './src/BusNumberInput';
import AllBusTickets from './src/AllBusTickets';
import TicketLoader from './src/TicketLoader';
import QrCard from './src/QrCard';
import TicketDetails from './src/TicketDetails';
import PaymentScreen from './src/PaymentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // options={{ title: 'Chartr' }}
           // options={{ headerShown: false }}
          options={{
            headerTitle: () => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 0,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('./src/assets/chtarapp.png')}
                    style={{width: 20, height: 20, marginRight: 8}}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: 'bold',
                      color: '#1d4ed8',
                    }}>
                    Chartr
                  </Text>
                </View>
                <Icon name="account-circle" size={30} color="black" />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="About"
          component={AroundMeScreen}
          options={{title: 'About Page'}}
        />
        <Stack.Screen
          name="TikatCard"
          component={TikatCard}
          options={{headerShown: false}}
          // options={{ title: 'TikatCard' }}
        />
        <Stack.Screen
          name="BusNumberInput"
          component={BusNumberInput}
          options={{headerShown: false}}
          // options={{ title: 'TikatCard' }}
        />
        <Stack.Screen
          name="AllBusTickets"
          component={AllBusTickets}
          // options={{ headerShown: false }}
          options={{title: 'All Bus Tickets'}}
        />
        <Stack.Screen
          name="TicketLoader"
          component={TicketLoader}
          options={{headerShown: false}}
          // options={{ title: 'All Bus Tickets' }}
        />
        <Stack.Screen
          name="QrCard"
          component={QrCard}
          options={{headerShown: false}}
          // options={{ title: 'All Bus Tickets' }}
        />
           <Stack.Screen
          name="TicketDetails"
          component={TicketDetails}
          options={{headerShown: false}}
          // options={{ title: 'All Bus Tickets' }}
        />
            <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{headerShown: false}}
          // options={{ title: 'All Bus Tickets' }}
        />
        


      </Stack.Navigator>
    </NavigationContainer>
  );
}
