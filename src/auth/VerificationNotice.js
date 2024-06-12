import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { auth } from './firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';
import UserContext from '../../context/UserContext';
import { getDataWithInt } from '../components/ApiRequest';
import { AuthContext } from './AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerificationNotice = ({ route, navigation }) => {

  const { id } = route.params
  console.log("Id in verification notice: ", id)
  const user = auth.currentUser;
  const { setUserEmail, setL1ID, accessToken, userType, setUserType, setLoggedUser } = useContext(UserContext)
  const { setUser } = useContext(AuthContext)
  const [departmentIds, setDepartmentIds] = useState([])


  useEffect(() => {

    const fetchDataFromOffice = async () => {

      console.log("inside useEffect ofVerificationNotice: ", accessToken, id);
      const res = await getDataWithInt("All_Offices", "Approver_app_user_lookup", id, accessToken);
      if (res && res.data) {
        const deptIds = res.data.map(dept => dept.ID); 
        setDepartmentIds(deptIds)
        setUserType("L2")
      }
      else {
        setUserType("L1")
      }
    }

    fetchDataFromOffice()

  }, [])


  useEffect(() => {

    const interval = setInterval(() => {
      checkEmailVerification();
    }, 5000);

    const checkEmailVerification = async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified && userType) {
          setUserEmail(user.email)
          setL1ID(id)
          if (userType && departmentIds) {
            console.log("department id in verificationNotice: ", departmentIds);
            await AsyncStorage.setItem("existedUser", JSON.stringify({ userId: id, role: userType, email: user.email, deptIds: departmentIds }));
            let existedUser = await AsyncStorage.getItem("existedUser");
            existedUser = JSON.parse(existedUser)
            console.log("Existed user in Base route useEffect:", existedUser)
            setLoggedUser(existedUser);
            clearInterval(interval);
            navigation.navigate('FooterTab');
          }
        }
      }
    };

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [userType]);

  const handleResendVerification = async () => {
    if (user) {
      try {
        await sendEmailVerification(user)
        Alert.alert('Verification email resent. Please check your inbox.');
      } catch (error) {
        if (error.message === 'Network request failed')
          Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.');
        if (error.code === 'auth/too-many-requests') {
          Alert.alert('Too many requests. Please try again later.');
        }
        else {
          console.error('Failed to resend verification email:', error);
          Alert.alert('Failed to resend verification email. Please try again.');
        }
      }
    } else {
      Alert.alert('No user is currently signed in.');
    }
  }


  return (
<View
      style={{
        flex: 1,
        alignItems: 'center',

        backgroundColor: 'white',
      }}>
      <Image
        style={{width: '20%', marginTop: 150}}
        resizeMode="contain"
        source={require('../../src/assets/imagekey.png')}
      />
      <Text
        style={{
          width: 256,
          height: 44,
          color: '#1F2024',
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: 18,
          fontWeight: '900',
          letterSpacing: 0.09,
        }}>
        We have sent you an email
      </Text>
      <Text
        style={{
          width: 220,
          color: '#71727A',
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 20,
        }}>
        Click on the email verification link sent to you on userinfor@gmail.com
      </Text>
      <TouchableOpacity
        style={[styles.register, styles.register1]}
        onPress={() => navigation.navigate('FillByYourSelf')}>
        <Text style={[styles.registerTitle, {color: 'white'}]}>
          Open Email App
        </Text>
      </TouchableOpacity>

      <View style={styles.redirect}>
        <Text
          style={{
            width: 154,
            color: '#71727A',
            textAlign: 'center',
            marginEnd: 1,
            fontFamily: 'Inter',
            fontSize: 12,
            flexShrink: 0,
            fontStyle: 'normal',
            fontWeight: '600',
            letterSpacing: 0.12,
          }}>
          Didn't receive the Email?
        </Text>
        <TouchableOpacity onPress={handleResendVerification}>
          <Text
            style={{
              color: '#B21E2B',
              width: 124,
              fontFamily: 'Inter',
              fontSize: 12,
              flexShrink: 0,
              fontStyle: 'normal',
              fontWeight: '600',
              letterSpacing: 0.12,
            }}>
            Click to Resend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  register: {
    width: 211,
    height: 55,
    backgroundColor: '#B21E2B',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  redirect: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    paddingLeft: 40,
  },
  register1: {
    backgroundColor: '#B21E2B',
    margin: 35,
  },
  register2: {
    backgroundColor: '#ffbe65',
    marginLeft: 35,
    marginBottom: 30,
  },
  registerTitle: {
    fontSize: 15,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default VerificationNotice;