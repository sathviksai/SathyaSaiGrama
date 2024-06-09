import { StyleSheet, Text, View,TouchableOpacity,Alert,Modal,Image,TextInput } from 'react-native'
import React, { useContext,useState } from 'react'
import {auth} from '../auth/firebaseConfig';
import {signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider, } from "firebase/auth";
import { SafeAreaView } from 'react-native-safe-area-context';
import UserContext from '../../context/UserContext';
import { getDataWithInt, getDataWithString, getDataWithStringAndInt, getDataWithoutStringAndWithInt } from '../components/ApiRequest';
import { AuthContext } from '../auth/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const Profile = ({navigation}) => {
  const { getAccessToken,userEmail,L1ID } = useContext(UserContext)
  const {user, setUser} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    const credential = EmailAuthProvider.credential(email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      console.log('User reauthenticated successfully.');

      await deleteUser(user);
      console.log('User account deleted successfully.');
      Alert.alert('Success', 'User account deleted successfully.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error reauthenticating or deleting user:', error);
      Alert.alert(
        'Error',
        `Error reauthenticating or deleting user: ${error.message}`,
      );
    }
  };


  const onLogout = () => {
    signOut(auth)
      .then(async (response) => {
        console.log('response :', response);
        setUser(null);
        await AsyncStorage.removeItem("existedUser");
        RNRestart.Restart(); 
      })
      .catch(error => {
        console.log('error :', error);
        Alert.alert('Not able to logout!');
      });
  };

  const toMyprofile = async() =>{
    console.log("Email from context: ",userEmail)
    console.log(getAccessToken())
    const resFromUser= await getDataWithString('All_App_Users', 'Email', userEmail,getAccessToken());
    const resFromVehicleInfo= await getDataWithInt('All_Vehicle_Information', 'App_User_lookup', L1ID,getAccessToken());
    const resFromFlat = await getDataWithInt("All_Flats","Primary_Contact_app_user_lookup",L1ID,getAccessToken())
    console.log("from the profile: ",resFromFlat)
    
    if(resFromFlat.data){
      const resFromFamilyMember = await getDataWithoutStringAndWithInt("All_Residents","Relationship_with_the_primary_contact","Self","Flats_lookup",resFromFlat.data[0].ID,getAccessToken())
      console.log("resfromfamilyrelation: ",resFromFamilyMember.data)
      console.log("resfromfamilyinfo ",resFromFamilyMember.data[0].App_User_lookup)
      if(resFromFamilyMember.data){
        navigation.navigate("MyProfile",{userInfo: resFromUser.data,vehicleInfo: resFromVehicleInfo.data,flatExists:true, familyMembersData:resFromFamilyMember.data, flatid: resFromFlat.data[0].ID})
      }
      else{ 
        navigation.navigate("MyProfile",{userInfo: resFromUser.data,vehicleInfo: resFromVehicleInfo.data,flatExists:true})
      }
    }else{
      navigation.navigate("MyProfile",{userInfo: resFromUser.data,vehicleInfo: resFromVehicleInfo.data,flatExists:false})
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.account}>
        <Text style={styles.accountTitle}>Account</Text>
      </View>
      <View style={styles.topSection}>
          <Image source={require("../assets/profilePhoto.png")} style={styles.propic} />
          <Text style={styles.name}>Vivek Kashyap</Text>
          <View style={styles.imgdel}>
          <Text style={styles.email}>{userEmail}</Text>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
          <Image source={require("../assets/delete.png")} style={styles.del}/>
          </TouchableOpacity>
          </View>
      </View>


      <View style={styles.options}>
        <TouchableOpacity style={styles.buttonSection} onPress={toMyprofile}>
          <View style={styles.buttonArea}>
            <Text style={styles.buttonName}>My Profile</Text>
            <Image source={require("../assets/RightArrow.png")} style={styles.img}/>
          </View>
          {/* <View style={styles.sp}></View> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} onPress={()=>navigation.navigate("Notifications")}>
        <View style={styles.buttonArea}>
            <Text style={styles.buttonName}>Notifications</Text>
            <Image source={require("../assets/RightArrow.png")} style={styles.img}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} onPress={()=>navigation.navigate("Feedback")}>
        <View style={styles.buttonArea}>
            <Text style={styles.buttonName}>Send Feedback</Text>
            <Image source={require("../assets/RightArrow.png")} style={styles.img}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} onPress={onLogout}>
        <View style={styles.buttonArea}>
            <Text style={styles.buttonName}>Logout</Text>
            <Image source={require("../assets/RightArrow.png")} style={styles.img}/>
          </View>
        </TouchableOpacity>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Enter your credentials to delete you account permanantly
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
        </Modal>
      </View>
  </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  account:{
    width: 375,
    height:56,
    paddingTop: 19.5,
    paddingRight:0,
    justifyContent:"center",
    alignItems:"center",
    flexShrink: 0
  },
  accountTitle:{
    fontFamily: "Inter",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight:'800',
    color: "#1F2024",
    textAlign: "center"
    // lineHeight:"normal"
  },
  propic: {
    width: 81.5,
    height: 82,
    borderRadius:85,
    textAlign:"center"
  },
  name: {
    color: '#1F2024',
    textAlign:"center",
    fontFamily:"Inter",
    fontSize:16,
    fontStyle:"normal",
    fontWeight:"900",
    letterSpacing:0.8
  },
  email:{
    color: "#71727A",
    textAlign:"center",
    fontFamily:"Inter",
    fontSize:12,
    fontStyle:"normal",
    fontWeight:"400",
    letterSpacing:0.12,
    marginEnd:30,
    marginStart:30,
    alignSelf:"center"
  },
  options:{
    width:375,
    paddingTop:44,
    paddingRight:16,
    flexDirection:"column",
    alignItems:"flex-start",
    gap:2
  },
  buttonSection: {
    padding:15,
    marginStart:10,
    marginEnd:10,
    gap:10,
    alignSelf:"stretch",
    borderBottomWidth:0.3,
    borderBottomColor:"#D4D6DD"
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonName: {
    color:"#1F2024",
    fontFamily:"Inter",
    fontSize:14,
    fontStyle:"normal",
    fontWeight:"400",
  },
  buttonArea: {
    flexDirection: 'row',
     justifyContent:"space-between",
  },
  img:{
    height: 12,
    width:12
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  imgdel:{
    flexDirection:"row"
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
  // sp:{
  //   height: 0,
  //   justifyContent: "center",
  //   alignItems:"center",
  //   alignSelf:"stretch"
  // }
})