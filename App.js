import BaseRoute from './navigation/stack-navigation/BaseRoute';
import UserContext from './context/UserContext';
import {useContext, useEffect, useState} from 'react';
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
import {requestUserPermission} from './src/utils/notificationService';

const App = () => {
  const {user} = useContext(AuthContext);

  const {
    setAccessToken,
    setUserType,
    accessToken,
    setLoggedUser,
    setL1ID,
    setUserEmail,
  } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const getAppWriteToken = async () => {
    try {
      console.log(DATABASE_ID);
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
      res = await res.json();
      //console.log("Access token in App: ", res.documents[0].Token)
      setAccessToken(res.documents[0].Token);
    } catch (error) {
      console.log('Error in App.js: ', error);
      Alert.alert(error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      await getAppWriteToken();
    };

    fetchToken();
    requestUserPermission();
  }, []);

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
    <>
      {loading ? (
        // <ActivityIndicator size="large" color="#752A26" style={styles.loadingContainer}/>
        <SplashScreen />
      ) : (
        <BaseRoute />
      )}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
