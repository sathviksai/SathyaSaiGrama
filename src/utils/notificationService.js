import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export async function getDeviceToken() {
  console.log(
    'PermissionsAndroid.RESULTS.granted',
    PermissionsAndroid.RESULTS.GRANTED,
  );
  if (Platform.OS == 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('grantedgranted', granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('object');
      const token = await getFCMToken();
      return token

    } else {
      console.log('permission denied');
    }
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log("enable value:", enabled)
    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await getFCMToken();
      console.log("device token = ", token)
      return token
    }
  }
}

const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log("#####################################################")
    console.log('Generated device token is :   ', token);
    return token;
  } catch (err) {
    console.log('error during token generation: ', err);
  }
};
