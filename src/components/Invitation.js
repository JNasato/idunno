import React from 'react';
import { View, Text, Button } from 'react-native';

export default ({ history }) => {
  return(
<View>
  <Text>This is the Invitation page </Text>
    <Button title="Homepage" onPress={() => history.push("/")}></Button>
</View>
  )};