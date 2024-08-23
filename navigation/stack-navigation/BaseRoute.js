import {ActivityIndicator, Linking, StyleSheet, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import ForgotPassword from '../../src/screens/ForgotPassword';
import {AuthContext} from '../../src/auth/AuthProvider';
import ApprovalTab from '../../src/screens/approval/ApprovalTab';
import L2ApprovalTab from '../../src/screens/L2-approval/L2ApprovalTab';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import FooterTab from '../tab-navigation/FooterTab';
import UserContext from '../../context/UserContext';
import VerificationNotice from '../../src/auth/VerificationNotice';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from './RootNavigation';
import {
  DATABASE_ID,
  COLLECTION_ID,
  APPWRITE_FUNCTION_PROJECT_ID,
  APPWRITE_API_KEY,
} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAVIGATION_IDS = [
  'VerifyDetails',
  'FillByYourSelf',
  'Profile',
  'ViewDetails',
];

function buildDeepLinkFromNotificationData(data) {
  // if (JSON.isRawJSON(dataString)) {
  //   console.log('rawJson');
  // } else {
  //   console.log('Not raw Json');
  // }
  // data = JSON.parse(dataString);
  console.log(data);
  // const data = dataString;
  const navigationId = data?.navigationId;
  console.log(data.navigationId);
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'FillByYourSelf') {
    return 'myapp://FillByYourSelf';
  }
  if (navigationId === 'Profile') {
    return 'myapp://Profile';
  }
  if (navigationId === 'VerifyDetails') {
    const dataString = JSON.stringify(data);
    return `myapp://VerifyDetails?user=${dataString}&stringified=true`;
  }
  if (navigationId === 'ViewDetails') {
    const dataString = JSON.stringify(data);
    return `myapp://ViewDetails?user=${dataString}&stringified=true`;
  }
  // const postId = data?.postId;
  // if (typeof postId === 'string') {
  //   return `myapp://post/${postId}`;
  // }
  console.warn('Missing navigationId');
  return null;
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      FooterTab: {
        screens: {
          InviteStackScreen: {
            screens: {
              FillByYourSelf: 'FillByYourSelf',
            },
          },
          ProfileStackScreen: {
            screens: {
              Profile: 'Profile',
            },
          },
          AppApproveStack: {
            screens: {
              ApprovalStack: {
                screens: {
                  VerifyDetails: 'VerifyDetails',
                },
              },
            },
          },
          L2ApprovalStack: {
            screens: {
              ViewDetails: 'ViewDetails',
            },
          },
        },
      },
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({url}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
};

const BaseRoute = () => {
  // const { user } = useContext(AuthContext);

  const {setAccessToken, loggedUser, setLoggedUser} = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    // Get the deep link used to open the app
    const getUrl = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl === null) {
        return;
      }

      if (initialUrl.includes('ViewDetails')) {
        Alert.alert(initialUrl);
        RootNavigation.current?.reset({
          index: 1,
          routes: [{name: 'L2ApprovalTab'}, {name: 'ViewDetails'}],
        });
      }
    };

    getUrl();
  }, []);

  //To get Apprwrite token
  const getAppWriteToken = async () => {
    try {
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
      setAccessToken(res.documents[0].Token);
      console.log(
        'Zoho token in base route using app write:',
        res.documents[0].Token,
      );
    } catch (error) {
      console.log('Error in Base route: ', error);
      Alert.alert(error);
    }
  };
  //To fetch Zoho Access token from Appwrite for every 30 mins
  useEffect(() => {
    const intervalId = setInterval(getAppWriteToken, 1800000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkUserExist = async () => {
      let existedUser = await AsyncStorage.getItem('existedUser');
      existedUser = JSON.parse(existedUser);
      console.log('Existed user in Base route useEffect:', existedUser);
      if (existedUser) {
        setLoggedUser(existedUser);
      }
    };

    if (!loggedUser) {
      checkUserExist();
    }
  }, []);

  return (
    // <>
    //   {loading ? (
    //     <ActivityIndicator size="large" color="#752A26" style={styles.loadingContainer} />
    //   ) : (
    <NavigationContainer
      linking={linking}
      fallback={<Text>Loading...</Text>}
      ref={RootNavigation.navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {loggedUser ? (
          <Stack.Screen name="FooterTab" component={FooterTab} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen
              name="VerificationNotice"
              component={VerificationNotice}
            />
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
