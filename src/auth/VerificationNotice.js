import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.text}>
        A verification email has been sent to your email address. Please verify your email to proceed.
      </Text>
      <TouchableOpacity onPress={handleResendVerification} style={styles.register}>
        <Text style={styles.registerTitle}>RESEND VERIFICATION EMAIL</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  register: {
    width: '90%',
    backgroundColor: '#752A26',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  registerTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default VerificationNotice;