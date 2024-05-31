import { StyleSheet } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import ForgotPassword from '../../src/screens/ForgotPassword';
import { AuthContext, AuthProvider } from '../../src/auth/AuthProvider';
import ApprovalTab from '../../src/screens/approval/ApprovalTab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import FooterTab from '../tab-navigation/FooterTab';
import UserContext from '../../context/UserContext';
import VerificationNotice from '../../src/auth/VerificationNotice';
import {DATABASE_ID, COLLECTION_ID, APPWRITE_FUNCTION_PROJECT_ID, APPWRITE_API_KEY} from "@env"

const BaseRoute = () => {
  const { setAccessToken } = useContext(UserContext);


  const getAppWriteToken = async () => {
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
  }



  useEffect(() => {
    const intervalId = setInterval(getAppWriteToken, 300000); 
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

const Routes = () => {
  const { user } = useContext(AuthContext);
  // console.log("user data : ", user)
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && user.emailVerified ? (
          <Stack.Screen name="Footer" component={FooterTab} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="VerificationNotice" component={VerificationNotice} />
            <Stack.Screen name="ApprovalTab" component={ApprovalTab} />
            <Stack.Screen name="Footer" component={FooterTab} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default BaseRoute;

const styles = StyleSheet.create({});
