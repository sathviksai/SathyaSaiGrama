import {View, Text, Image, ActivityIndicator} from 'react-native';
import React from 'react';

const SentForApproval = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', marginTop: '40%'}}>
      <ActivityIndicator size="large" color="#B21E2B" />
      <Image
        style={{
          marginTop: '20%',
        }}
        source={require('../../src/assets/Group.png')}
      />
      <View style={{flex: 1, width: 259, height: 60, gap: 10}}>
        <Text
          style={{
            color: '#B21e2B',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: 19.533,
            marginTop: 50,
          }}>
          You have Approved successfully.
        </Text>
        <Text
          style={{
            color: '#B21e2B',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: 19.533,
          }}>
          {' '}
          Sent for L2 Approval
        </Text>
      </View>
    </View>
  );
};

export default SentForApproval;
