import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Switch, Route} from 'react-router-native';

import Home from './src/components/Home';
import Room from './src/components/Room';
import Results from './src/components/Results';
import Invitation from './src/components/Invitation';
import Lobby from './src/components/Lobby';
import Loader from './src/components/Loader'
import Swiper from './src/components/Swiper';
import Login from './src/components/Login';
import Filters from './src/components/Filters';
import Footer from './src/components/Footer';
import io from "socket.io-client";
import { IP_ADDRESS } from 'react-native-dotenv';


export default function App() {

  const [roomId, setRoomId] = useState(null)
  
  const [filters, setFilters] = useState({
    searchType: 'nearby',
    type: 'restaurant',
    area: null,
    radius: 500,
    price: 1,
    vegan: false,
    family: false,
    casual: false,
    fine: false,
    cafe: false,
    buffet: false,
    bistro: false,
    breakfast: false,
  })
  
  const [socket] = useState(() => io(IP_ADDRESS));

  useEffect(() => {
    socket.on('connect', () => console.log("Client connected:", socket.connected));
    socket.on('usersSentToRoom', setUserArray);
    socket.on('dataSentToRoom', setData);
    socket.on('resultSentToRoom', setWinner);
    socket.on('disconnect', () => {console.log("Disconnected")});
    
    return () => socket.close();
  }, [])

  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [result, setResult] = useState('');

  function createRoom(nickname) {
    console.log('sending create room event')
    //event to create a room to server, response with server code
    socket.emit('createRoom', filters, nickname, (roomId) => {
      console.log("ROOM CODE:", roomId);
      setRoomId(roomId);
      //pass roomId to Share component
    })
  }
  
  function joinRoom(roomId, nickname) {
    console.log(roomId);
    socket.emit('joinRoom', roomId, nickname, (hasJoined) => {
      console.log('has joined', hasJoined)
      if (hasJoined === false) {
        failToJoinAlert();
      } else {
        setRoomId(roomId);
      }
    })
    
    const failToJoinAlert = () =>
    Alert.alert(
      "Room does not exist",
      "Unable to join room",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );  
  }
    
  function emitReady() {
    socket.emit('lobbyReady');
  }

  function setUserArray(users) {
    setUsers(users);
  }
  
  function setData(data) {
    console.log("1: Received Cards")
    setPlaces(data) 
    console.log("2: DATA:" , data.length)
  }
  
  function setWinner(winner) {
    setResult(winner);
  }
  
  function addToResults(like) {
    socket.emit('addToResults', like)
  }  

  function readyForResult() {
    socket.emit('readyForResult')
  }    

  return (
    <NativeRouter>
    
    <View style={styles.container}>
      <Switch>
        <Route exact path="/"  render={(routeProps) => {
          let homeProps = { ...routeProps, createRoom, joinRoom, setRoomId, filters, setFilters }
          return (<Home {...homeProps}/>)}} />

        <Route exact path="/filters"  render={(routeProps) => {
          let filtersProps = { ...routeProps, createRoom, filters, setFilters }
          return (<Filters {...filtersProps}/>)}} />

        <Route exact path="/room" exact render={(routeProps)=> {
          let roomProps = { ...routeProps, emitReady, users }
          return (<Room {...roomProps}/>)}} />
          
        <Route exact path="/invitation" exact render={(routeProps) => {
          let invitationProps = {...routeProps, roomId} 
          return (<Invitation {... invitationProps} />)}}/>

        <Route exact path="/loader" component={Loader}/>

        <Route exact path ="/swiper" exact render={(routeProps) => {
          let swiperProps = {...routeProps, places, addToResults, readyForResult} 
          return (<Swiper {...swiperProps} />)}}/>

        <Route exact path ="/results" exact render={(routeProps) => {
          let resultsProps = {...routeProps, result} 
          return (<Results {...resultsProps} />)}}/>
      </Switch>

      </View>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
