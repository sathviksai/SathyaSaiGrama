import { ActivityIndicator, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import ForgotPassword from '../../src/screens/ForgotPassword';
import { AuthContext } from '../../src/auth/AuthProvider';
import ApprovalTab from '../../src/screens/approval/ApprovalTab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import FooterTab from '../tab-navigation/FooterTab';
import UserContext from '../../context/UserContext';
import VerificationNotice from '../../src/auth/VerificationNotice';
import { DATABASE_ID, COLLECTION_ID, APPWRITE_FUNCTION_PROJECT_ID, APPWRITE_API_KEY } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const BaseRoute = () => {

  const { user } = useContext(AuthContext);
  
  const { setAccessToken, loggedUser, setLoggedUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true)

  const Stack = createNativeStackNavigator();


  const getAppWriteToken = async () => {
    try {
      let res = await fetch(`https://cloud.appwrite.io/v1/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_FUNCTION_PROJECT_ID,
          'X-Appwrite-Key': APPWRITE_API_KEY
        }
      }
      );
      res = await res.json()
      setAccessToken(res.documents[0].Token)
      console.log("Zoho token in base route using app write:", res.documents[0].Token)
    } catch (error) {
      console.log("Error in Base route: ", error)
      Alert.alert(error)
    }

  }

  useEffect(() => {
    const intervalId = setInterval(getAppWriteToken, 600000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(()=>{

    const checkUserExist = async () =>{
        let existedUser = await AsyncStorage.getItem("existedUser");
        existedUser = JSON.parse(existedUser)
        console.log("Existed user in Base route useEffect:", existedUser)
        if(existedUser){
          setLoggedUser(existedUser);
        }
      }

      if(!loggedUser){
        checkUserExist();
      }
      
}, [])

  return (
    // <>
    //   {loading ? (
    //     <ActivityIndicator size="large" color="#752A26" style={styles.loadingContainer} />
    //   ) : (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        { loggedUser ? (
          <Stack.Screen name="FooterTab" component={FooterTab} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="VerificationNotice" component={VerificationNotice} />
            <Stack.Screen name="ApprovalTab" component={ApprovalTab} />
            <Stack.Screen name="FooterTab" component={FooterTab} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    // )}
    // </>
  );
};


export default BaseRoute;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
