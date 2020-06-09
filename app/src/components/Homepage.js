import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Header from './Header';
import Footer from './Footer'


export default ({ history }) => {
  return (
  <View style={style.container}>
    <Header />
    <View style={{flex: 1, justifyContent: 'space-between'} }>
        <Button title="Sessions" onPress={() => history.push("/sessions")}></Button>
        <Button title="Results" onPress={() => history.push("/results")}></Button>
        <Button title="Invitation" onPress={() => history.push("/invitation")}></Button>
        <Button title="Lobby" onPress={() => history.push("/lobby")}></Button>
        <Button title="Login" onPress={() => history.push("/login")}></Button>
      </View>
    <Footer />
  </View>
  )};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfaf2',
    flexDirection: 'column',


  }

})