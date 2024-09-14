import BaseRoute from './navigation/stack-navigation/BaseRoute';
import UserContext from './context/UserContext';
import {useContext, useEffect, useState} from 'react';
import {Appearance, AppearanceProvider} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

import {
  DATABASE_ID,
  COLLECTION_ID,
  APPWRITE_FUNCTION_PROJECT_ID,
  APPWRITE_API_KEY,
} from '@env';
import {StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {AuthContext, AuthProvider} from './src/auth/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/screens/SplashScreen';
import {getDeviceToken} from './src/utils/notificationService';
import NoNetworkScreen from './src/screens/NoNetworkScreen';
import CodePush from 'react-native-code-push';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',
    // Add other light mode styles here
  },
};

const App = () => {
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(true);
  const {user} = useContext(AuthContext);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsNetworkAvailable(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const {
    setAccessToken,
    setUserType,
    accessToken,
    setLoggedUser,
    setL1ID,
    setUserEmail,
    setDeviceToken,
  } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  //==============================
  //To get zoho access token from Appwrite
  const getAppWriteToken = async () => {
    try {
      console.log('database id : ', DATABASE_ID);
      let res = await fetch(
        `https://cloud.appwrite.io/v1/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': APPWRITE_FUNCTION_PROJECT_ID,
            'X-Appwrite-Key': APPWRITE_API_KEY,
          },
        },
      );
      console.log('After api call');
      res = await res.json();
      //console.log("Access token in App: ", res.documents[0].Token)
      setAccessToken(res.documents[0].Token);
    } catch (error) {
      console.log('Error in App.js in getAppWriteToken function: ', error);
      Alert.alert(error);
    }
  };

  //UseEffect to call Appwrite and device token functions
  useEffect(() => {
    const fetchToken = async () => {
      await getAppWriteToken();
      const dToken = await getDeviceToken();
      setDeviceToken(dToken);
      console.log('device token is app.js: ', dToken);
    };

    fetchToken();
  }, []);

  //===================================
  //To check user exists in local storage, if exists set in Context
  useEffect(() => {
    const checkUserExist = async () => {
      let existedUser = await AsyncStorage.getItem('existedUser');
      existedUser = JSON.parse(existedUser);
      if (existedUser) {
        setLoggedUser(existedUser);
        setUserType(existedUser.role);
        setL1ID(existedUser.userId);
        setUserEmail(existedUser.email);
        console.log('Existed user in App.js:', existedUser);
      }
    };

    checkUserExist();
  }, []);

  useEffect(() => {
    if (accessToken) {
      console.log('Access token in App useEffect: ', accessToken);
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <PaperProvider theme={lightTheme}>
      {!isNetworkAvailable ? (
        <NoNetworkScreen />
      ) : loading ? (
        // <ActivityIndicator size="large" color="#752A26" style={styles.loadingContainer}/>
        <SplashScreen />
      ) : (
        <BaseRoute />
      )}
    </PaperProvider>
  );
};

export default CodePush(App);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
