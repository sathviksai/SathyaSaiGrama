import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../auth/firebaseConfig';
// import ImagePicker from 'react-native-image-crop-picker';
import {
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserContext from '../../context/UserContext';
import {
  getDataWithInt,
  getDataWithString,
  getDataWithStringAndInt,
  getDataWithoutStringAndWithInt,
} from '../components/ApiRequest';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../auth/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import Dialog from 'react-native-dialog';
import { BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME } from '@env';
import Toast from 'react-native-toast-message';

const Profile = ({ navigation }) => {
  const {
    getAccessToken,
    userEmail,
    L1ID,
    deviceToken,
    loggedUser,
    accessToken,
  } = useContext(UserContext);
  const { user, setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImageModalVisible, setProfileImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  let OndeleteStyles;
  if (deleteLoading) {
    OndeleteStyles = deleteLoadingStyles;
  } else if (!deleteLoading) {
    OndeleteStyles = styles; }


  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onPressOk = () => {
    onLogout();
    setDialogVisible(false);
  }

  const handleProfileModal = () => {
    setProfileImageModalVisible(!profileImageModalVisible);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleDeleteAccount = async (email, password) => {
    const credential = EmailAuthProvider.credential(email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      console.log('User reauthenticated successfully.');

      await deleteUser(user);
      console.log('User account deleted successfully.');
      setModalVisible(!modalVisible);
      setDeleteLoading(false);
      setToastVisible(true);
    } catch (error) {
      console.error('Error reauthenticating or deleting user:', error);
      Alert.alert(
        'Error',
        `Error reauthenticating or deleting user: ${error.message}`,
      );
    }
  };

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

  const onDelete = async userCred => {
    setDeleteLoading(true);
    console.log(userCred);
    await handleDeleteAccount(userCred.email, userCred.password);
  };

  const onLogout = () => {
    signOut(auth)
      .then(async response => {
        console.log('response :', response);
        setUser(null);

        const respon = await findDeviceToken(loggedUser.userId);
        console.log('findDeviceToken response is: ', respon);
        const replaceToken = deviceToken + '||';
        let myDeviceToken = respon.data.Device_Tokens.replace(replaceToken, '');

        console.log('local device token is: ', myDeviceToken);
        console.log('Response device token is : ', respon);
        const updateData = {
          data: {
            Device_Tokens: myDeviceToken,
          },
        };
        const updateResponse = await updateDeviceToken(
          updateData,
          loggedUser.userId,
        );
        console.log('update device token response: ', updateResponse);

        await AsyncStorage.removeItem('existedUser');
        RNRestart.Restart();
      })
      .catch(error => {
        console.log('error :', error);
        Alert.alert('Not able to logout!');
      });
  };

  const changeProfile = () => {
    setProfileImageModalVisible(!profileImageModalVisible);
  };

  // const onCamera = () => {
  //   ImagePicker.openCamera({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   }).then(image => {
  //     console.log(image);
  //   });
  // };

  // const onGallery = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   }).then(image => {
  //     console.log(image);
  //   });
  // };

  const toMyprofile = async () => {
    setLoading(true);
    console.log('Email from context: ', userEmail);
    console.log(getAccessToken());
    const resFromUser = await getDataWithString(
      'All_App_Users',
      'Email',
      userEmail,
      getAccessToken(),
    );
    const resFromVehicleInfo = await getDataWithInt(
      'All_Vehicle_Information',
      'App_User_lookup',
      L1ID,
      getAccessToken(),
    );

    const resFromFlat = await getDataWithInt(
      'All_Flats',
      'Primary_Contact_app_user_lookup',
      L1ID,
      getAccessToken(),
    );

    const resFromEmployee = await getDataWithInt(
      'All_Employees',
      'App_User_lookup',
      L1ID,
      getAccessToken(),
    );
    // console.log('resFromFlat: ', resFromFlat);

    if (resFromFlat.data) {
      const resFromFamilyMember = await getDataWithoutStringAndWithInt(
        'All_Residents',
        'Relationship_with_the_primary_contact',
        'Self',
        'Flats_lookup',
        resFromFlat.data[0].ID,
        getAccessToken(),
      );
      console.log('resfromfamilyrelation: ', resFromFamilyMember.data);
      if (resFromFamilyMember.data) {
        setLoading(false);
        if (resFromEmployee.data)
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: true,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            familyMembersData: resFromFamilyMember.data,
            flatid: resFromFlat.data[0].ID,
            dapartmentExists: true,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        else
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: true,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            familyMembersData: resFromFamilyMember.data,
            flatid: resFromFlat.data[0].ID,
            dapartmentExists: false,
          });
      } else {
        setLoading(false);
        if (resFromEmployee.data)
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            flatExists: true,
            dapartmentExists: true,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        else
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            flatExists: true,
            dapartmentExists: false,
          });
      }
    } else {
      const resFromFamilyMemberRoom = await getDataWithInt(
        'All_Residents',
        'App_User_lookup',
        L1ID,
        getAccessToken(),
      );
      console.log('resfromfamilyrelation: ', resFromFamilyMemberRoom.data);
      setLoading(false);

      if (resFromEmployee.data) {
        if (resFromFamilyMemberRoom.data) {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            flatMember: true,
            flat: {
              building: resFromFamilyMemberRoom.data[0].Flats_lookup.Building,
              flat: resFromFamilyMemberRoom.data[0].Flats_lookup.Flat,
            },
            dapartmentExists: true,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        } else {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            dapartmentExists: true,
            flatMember: false,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        }
      } else {
        if (resFromFamilyMemberRoom.data) {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            flatMember: true,
            flat: {
              building: resFromFamilyMemberRoom.data[0].Flats_lookup.Building,
              flat: resFromFamilyMemberRoom.data[0].Flats_lookup.Flat,
            },
            dapartmentExists: false,
          });
        } else {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            dapartmentExists: false,
          });
        }
      }
    }
  };

  useEffect(() => {

    if(toastVisible){

        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Account Deleted',
          text2: 'Your account has been deleted successfully',
          visibilityTime: 4000,
          autoHide: true,
        
          bottomOffset: 20,
          
      });
    onLogout();
    
    
    } }, [toastVisible]);
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B21E2B" />
        </View>
      ) : (
        <View>
          <View style={styles.account}>
            <Text style={styles.accountTitle}>Account</Text>
          </View>
          <View style={styles.topSection}>
            <View>
              <Image
                source={require('../assets/sathya.png')}
                style={styles.propic}
              />
              {/* <TouchableOpacity style={styles.edit} onPress={changeProfile}>
                <Image
                  source={require('../assets/Edit.png')}
                  style={{
                    width: 17,
                    height: 14.432,
                    marginEnd: 5,
                    flexShrink: 0,
                    marginLeft: 70,
                    textAlign: 'right',
                  }}
                />
              </TouchableOpacity> */}
            </View>
            <Text style={styles.name}>{ }</Text>
            <View style={styles.imgdel}>
              <Text style={styles.emailVisible}>{userEmail}</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setModalVisible(true)}>
                <Image
                  source={require('../assets/delete.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.buttonSection}
              onPress={toMyprofile}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>My Profile</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.buttonSection}
              onPress={() => navigation.navigate('Notifications')}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>Notifications</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.buttonSection}
              onPress={() => navigation.navigate('Feedback')}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>Send Feedback</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSection} onPress={onLogout}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>Logout</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Enter your credentials to delete your account permanently
                </Text>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonDelete]}
                    onPress={async () => {
                      setModalVisible(!modalVisible);
                      await handleDeleteAccount();
                    }}>
                    <Text style={styles.textStyle}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal> */}
 
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}>
            <TouchableWithoutFeedback onPress={handleModal}>
              <View style={styles.centeredView}>
                <View style={OndeleteStyles.modalView}>
                { deleteLoading ? (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#B21E2B" /><Text>Deleting profile...</Text></View>)  : <>
                  <Text style={styles.shareLink}>
                    Enter your credentials to delete your account permanently
                  </Text>

                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Email Address"
                        value={value}
                        style={[
                          styles.email,
                          focusedInput === 'email' && styles.inputFocused,
                        ]}
                        selectionColor="#B21E2B"
                        onFocus={() => setFocusedInput('email')}
                        onChangeText={onChange}
                        autoCapitalize="none"
                      />
                    )}
                    rules={{ required: true, pattern: /^\S+@\S+$/i }}
                  />
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
                      render={({ field: { onChange, value } }) => (
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
                        minLength: 8,
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      }}
                    />
                    {showPassword === false ? (
                      <TouchableOpacity
                        onPress={() => {
                          setShowPassword(!showPassword);
                        }}>
                        <Image
                          source={require('../assets/eyestrike.png')}
                          style={{ width: 16, height: 16 }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}>
                        <Image
                          source={require('../assets/eye.png')}
                          style={{ width: 16, height: 16 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {errors.password?.type === 'required' && (
                    <Text style={styles.textError}>Password is required</Text>
                  )}
                  {errors.password?.type === 'minLength' && (
                    <Text style={styles.textError}>
                      Password must be 8 characters long
                    </Text>
                  )}
                  {errors.password?.type === 'pattern' && (
                    <Text style={styles.textError}>
                      Password must contain at least a uppercase,lowercase,
                      number and a special character
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={[styles.HomeButton, { backgroundColor: '#B21E2B' }]}
                      onPress={handleSubmit(onDelete)}>
                      <Text style={[styles.wewe, styles.wewe1]}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.HomeButton, { backgroundColor: '#FFBE65' }]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={[styles.wewe, styles.wewe2]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal> 

          <Modal
            animationType="fade"
            transparent={true}
            visible={profileImageModalVisible}
            onRequestClose={() =>
              setProfileImageModalVisible(!profileImageModalVisible)
            }>
            <TouchableWithoutFeedback onPress={handleProfileModal}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.profileHead}>
                    <Text style={styles.shareLink}>Profile Photo</Text>
                    <Image source={require('../assets/delete.png')} />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={[styles.HomeButton, { backgroundColor: '#B21E2B' }]}>
                      <Text style={[styles.wewe, styles.wewe1]}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.HomeButton, { backgroundColor: '#FFBE65' }]}>
                      <Text style={[styles.wewe, styles.wewe2]}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}

<Toast />


    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  profileHead: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  account: {
    height: 80,
    paddingTop: 19.5,
    paddingRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  accountTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '800',
    color: '#1F2024',
    textAlign: 'center',
    // lineHeight:"normal"
  },
  propic: {
    width: 81.5,
    height: 82,
    borderRadius: 85,
    textAlign: 'center',
    borderWidth: 0.2,
    borderColor: 'gray',
  },
  name: {
    color: '#1F2024',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  emailVisible: {
    color: '#71727A',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.12,
    marginEnd: 15,
    marginStart: 30,
    alignSelf: 'center',
  },
  options: {
    width: 375,
    paddingTop: 44,
    paddingRight: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  buttonSection: {
    padding: 15,
    marginStart: 10,
    marginEnd: 10,
    gap: 10,
    alignSelf: 'stretch',
    borderBottomWidth: 0.3,
    borderBottomColor: '#D4D6DD',
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonName: {
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    height: 12,
    width: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  imgdel: {
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 20,
    margin: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonDelete: {
    backgroundColor: '#ff0000',
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
    width: 250,
    marginTop: 10,
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
  textError: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  shareLink: {
    color: '#1F2024',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.08,
    height: 41,
    alignSelf: 'stretch',
  },
  wewe: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
  },
  wewe1: {
    color: '#fff',
  },
  wewe2: {
    color: '#B21E2B',
  },
  HomeButton: {
    height: 50,
    width: 120,
    backgroundColor: '#752A26',
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 12,
    marginTop: 20,
    marginLeft: 4,
    marginRight: 4,
  },
  detailsNotEditableDialogue: {
    borderRadius: 30,
    backgroundColor: 'pink',

  },

  detailsNotEditableTitle: {

    fontWeight: 'bold',

  }
});

const deleteLoadingStyles = StyleSheet.create({ 
  modalView: {
    margin: 20,
    height:180 ,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    }
  }



});