import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {auth} from '../auth/firebaseConfig';
import {signInWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';
import {getDataWithInt, getDataWithString} from '../components/ApiRequest';
import UserContext from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME} from '@env';
import Dialog from 'react-native-dialog';

const Login = ({navigation}) => {
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const {
    userType,
    setUserType,
    accessToken,
    setUserEmail,
    setL1ID,
    loggedUser,
    setLoggedUser,
    deviceToken,
  } = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [DialogVisible, setDialogVisible] = useState(false);

  const onPressOk = () => {
    setDialogVisible(false);
  };
  const onPressRegister = () => {
    navigation.navigate('Register');
    setDialogVisible(false);
  };

  const fetchDataFromOffice = async id => {
    console.log(
      'access token and id in fetchDataFromOffice in login: ',
      accessToken,
      id,
    );
    const res = await getDataWithInt(
      'All_Offices',
      'Approver_app_user_lookup',
      id,
      accessToken,
    );
    if (res && res.data) {
      console.log('department data found in Login:', res.data);
      const deptIds = res.data.map(dept => dept.ID);
      setDepartmentIds(deptIds);
      setUserType('L2');
    } else {
      setUserType('L1');
    }
    console.log('response in fetchDataFromOffice in login: '.res);
  };

  useEffect(() => {
    const storeData = async () => {
      if (currentUser) {
        console.log('Inside the useEffect of login');
        await AsyncStorage.setItem(
          'existedUser',
          JSON.stringify({
            userId: currentUser.id,
            role: userType,
            email: currentUser.email,
            deptIds: departmentIds,
          }),
        );
        console.log('login data saved into local storage');
        let existedUser = await AsyncStorage.getItem('existedUser');
        existedUser = JSON.parse(existedUser);
        console.log('Existed user in Base route useEffect:', existedUser);
        setLoggedUser(existedUser);
        navigation.navigate('FooterTab');
      }
    };

    if (userType && departmentIds) {
      console.log('Before store data called in useEffect in Login');
      storeData();
      console.log('After store data called in useEffect in Login');
    }
  }, [currentUser]);

  const updateDeviceToken = async (modified_data, id) => {
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_App_Users/${id}`;
      console.log(url);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
        body: JSON.stringify(modified_data),
      });
      return await response.json();
    } catch (err) {
      if (err.message === 'Network request failed')
        Alert.alert(
          'Network Error',
          'Failed to fetch data. Please check your network connection and try again.',
        );
      else {
        Alert.alert('Error: ', err);
        console.log(err);
      }
    }
  };

  const findDeviceToken = async id => {
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_App_Users/${id}`;
      console.log(url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      });
      return await response.json();
    } catch (err) {
      if (err.message === 'Network request failed')
        Alert.alert(
          'Network Error',
          'Failed to fetch data. Please check your network connection and try again.',
        );
      else {
        Alert.alert('Error: ', err);
        console.log(err);
      }
    }
  };

  const handleLoginForm = async userCred => {
    setLoading(true);
    const res = await getDataWithString(
      'All_App_Users',
      'Email',
      userCred.email.toLowerCase().trim(),
      accessToken,
    );
    console.log('Whether user exis or not in login: ', res);
    if (res && res.data) {
      try {
        fetchDataFromOffice(res.data[0].ID);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          userCred.email.toLowerCase().trim(),
          userCred.password,
        );
        const user = userCredential.user;
        setLoading(false);
        if (user.emailVerified) {
          setL1ID(res.data[0].ID);
          setUserEmail(userCred.email.toLowerCase().trim());
          setCurrentUser({
            id: res.data[0].ID,
            email: userCred.email.toLowerCase().trim(),
          });
          const response = await findDeviceToken(res.data[0].ID);
          console.log('response is: ', response);
          let myDeviceToken;
          console.log('present token is: ', response.data.Device_Tokens);
          if (!response.data.Device_Tokens) {
            console.log('first time');
            myDeviceToken = '' + deviceToken + '||';
          } else {
            myDeviceToken = response.data.Device_Tokens + deviceToken + '||';
            console.log('second time');
          }
          console.log('local device token is: ', myDeviceToken);
          console.log('Response device token is : ', response);
          const updateData = {
            data: {
              Device_Tokens: myDeviceToken,
            },
          };
          const updateResponse = await updateDeviceToken(
            updateData,
            res.data[0].ID,
          );
          console.log('update device token response: ', updateResponse);
        } else {
          // Email is not verified, display message and send verification email (if needed)
          await sendEmailVerification(auth.currentUser);
          navigation.navigate('VerificationNotice', {id: res.data[0].ID});
        }
      } catch (error) {
        setLoading(false);
        if (error.message === 'Network request failed')
          Alert.alert(
            'Network Error',
            'Failed to fetch data. Please check your network connection and try again.',
          );
        else if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        } else {
          // Alert.alert('Error in account details:','Please check your email or password and try again.');
          setDialogVisible(true);
        }
        console.log('Error in auth: ', error);
      }
    } else {
      setLoading(false);
      // Alert.alert('Account does not exist Please register first');
      // navigation.navigate('Register');
      setDialogVisible(true);
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#752A26"
          style={styles.loadingContainer}
        />
      ) : (
        <>
          <ScrollView>
            <KeyboardAvoidingView>
              <Image
                source={require('../../src/assets/aashram.png')}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: 340,
                  marginTop: 5,
                }}
              />

              <View style={[styles.head]}>
                <Text style={styles.login}>Welcome!</Text>
                <View
                  style={[
                    styles.email,
                    focusedInput === 'email' && styles.inputFocused,
                  ]}>
                  <Controller
                    name="email"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder="Email Address"
                        value={value}
                        selectionColor="#B21E2B"
                        onFocus={() => setFocusedInput('email')}
                        onChangeText={onChange}
                        autoCapitalize="none"
                        style={{color: 'black'}}
                      />
                    )}
                    rules={{required: true, pattern: /^\S+@\S+$/i}}
                  />
                </View>
                {errors.email?.type === 'required' && (
                  <Text style={styles.textError}>Email is required</Text>
                )}
                {errors.email?.type === 'pattern' && (
                  <Text style={styles.textError}>Enter valid email</Text>
                )}

                <View
                  style={[
                    styles.passBorder,
                    focusedInput === 'password' && styles.inputFocused,
                  ]}>
                  <Controller
                    name="password"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder="Password"
                        style={styles.inputBox}
                        value={value}
                        selectionColor="#B21E2B"
                        onFocus={() => setFocusedInput('password')}
                        secureTextEntry={!showPassword}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{
                      required: true,
                      minLength: 6,
                    }}
                  />
                  {showPassword === false ? (
                    <TouchableOpacity
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}>
                      <Image
                        source={require('../assets/eyestrike.png')}
                        style={{width: 16, height: 16}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}>
                      <Image
                        source={require('../assets/eye.png')}
                        style={{width: 16, height: 16}}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {errors.password?.type === 'required' && (
                  <Text style={styles.textError}>Password is required</Text>
                )}
                {errors.password?.type === 'minLength' && (
                  <Text style={styles.textError}>
                    Password must be 6 characters long
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit(handleLoginForm)}
                  style={styles.register}>
                  <Text style={styles.registerTitle}>Login</Text>
                </TouchableOpacity>
                <View style={styles.redirect}>
                  <Text
                    style={{
                      width: 154,
                      color: '#71727A',
                      textAlign: 'right',
                      marginEnd: 4,
                      fontFamily: 'Inter',
                      fontSize: 12,
                      flexShrink: 0,
                      fontStyle: 'normal',
                      fontWeight: '600',
                      letterSpacing: 0.12,
                    }}>
                    Do not have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Register');
                    }}>
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
                      Register now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
          <Dialog.Container visible={DialogVisible}>
            <Dialog.Title>Unable to find user</Dialog.Title>
            <Dialog.Description>
              Please check your email or password and try again. Otherwise
              please register.
            </Dialog.Description>
            <Dialog.Button label="Register" onPress={onPressRegister} />
            <Dialog.Button label="Cancel" onPress={onPressOk} />
          </Dialog.Container>
        </>
      )}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    backgroundColor: '#FFF',
    flex: 1,
  },
  head: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    flexDirection: 'column',
  },
  redirect: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
  inputBox: {
    color: '#1F2024',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingEnd: 4,
    alignItems: 'center',
    height: 48,
    width: '90%',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  inputFocused: {
    borderColor: '#B21E2B',
  },
  passBorder: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: 18,
    height: 48,
    alignSelf: 'center',
    marginBottom: 8,
  },
  email: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    color: '#1F2024',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: 12,
  },
  register: {
    width: 216,
    backgroundColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    marginTop: 40,
    alignSelf: 'center',
    marginBottom: 30,
  },
  registerTitle: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    width: 33,
    height: 15,
  },
  login: {
    color: '#000',
    fontFamily: 'Inter',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.24,
    width: 124,
    height: 29,
    marginBottom: 24,
  },
  textError: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
  },
  forgotPassword: {
    color: '#B21E2B',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    alignSelf: 'stretch',
    marginStart: 6,
  },
});
