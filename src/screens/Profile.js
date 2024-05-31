import { StyleSheet, Text, View,TouchableOpacity,Alert } from 'react-native'
import React, { useContext } from 'react'
import {auth} from '../auth/firebaseConfig';
import {signOut } from "firebase/auth";
import { AuthContext } from '../auth/AuthProvider';

const Profile = ({navigation}) => {
  const { user,setUser } = useContext(AuthContext);
  const onLogout = () => {
    signOut(auth)
    .then(response => {
      console.log('response :', response);
      setUser(null)
      navigation.navigate('Login')
      Alert.alert('User signed out!');
    })
    .catch(error => {
      console.log('error :', error);
      Alert.alert('Not able to logout!');
    });
  }
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Home</Text>
    <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
      <Text style={styles.logout}>Logout</Text>
    </TouchableOpacity>
  </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#FCAF03',
    padding: 12,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    marginBottom: 30,
  },
  logout: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  }
})