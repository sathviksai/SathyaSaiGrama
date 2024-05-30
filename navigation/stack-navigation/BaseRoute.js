import { StyleSheet } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import ForgotPassword from '../../src/screens/ForgotPassword';
import { AuthContext, AuthProvider } from '../../src/auth/AuthProvider';
import ApprovalTab from '../../src/screens/approval/ApprovalTab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { getAccessFromRefresh } from '../../src/components/RefreshToken';
import FooterTab from '../tab-navigation/FooterTab';
import UserContext from '../../context/UserContext';
import VerificationNotice from '../../src/auth/VerificationNotice';

const BaseRoute = () => {
  const { setAccessToken } = useContext(UserContext);

  const setToken = async () => {
    try {
      const res = await getAccessFromRefresh();
      setAccessToken(res);
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(setToken, 300000); // Adjust the interval as needed (e.g., 300000 for 5 minutes)
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

const Routes = () => {
  const { user } = useContext(AuthContext);
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
