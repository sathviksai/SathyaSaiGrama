import {View, Text, Image} from 'react-native';
import React from 'react';

const NoNetworkScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        style={{width: '75%'}}
        resizeMode="contain"
        source={require('../../src/assets/noConnection.png')}
      />
    </View>
  );
};

export default NoNetworkScreen; 