import { StyleSheet, Text, View,TouchableOpacity,Alert,ScrollView,Image } from 'react-native'
import React, { useContext } from 'react'
import {auth} from '../auth/firebaseConfig';
import {signOut } from "firebase/auth";
import { SafeAreaView } from 'react-native-safe-area-context';
import UserContext from '../../context/UserContext';
import RNRestart from 'react-native-restart';
import { getDataWithInt, getDataWithString, getDataWithStringAndInt, getDataWithoutStringAndWithInt } from '../components/ApiRequest';
import { AuthContext } from '../auth/AuthProvider';

const Profile = ({navigation}) => {
  const { getAccessToken, userEmail, L1ID } = useContext(UserContext)
  const { setUser } = useContext(AuthContext)

  const onLogout = () => {
    signOut(auth)
      .then(response => {
        console.log('response :', response);
        setUser(null);
        RNRestart.Restart(); 
      })
      .catch(error => {
        console.log('error :', error);
        Alert.alert('Not able to logout!');
      });
  };

  const toMyprofile = async() =>{
    console.log("Email from context: ",userEmail)
    const resFromUser= await getDataWithString('All_App_Users', 'Email', userEmail,getAccessToken());
    const resFromVehicleInfo= await getDataWithInt('All_Vehicle_Information', 'App_User_lookup', L1ID,getAccessToken());
    const resFromFlat = await getDataWithInt("All_Flats","Primary_Contact_app_user_lookup",L1ID,getAccessToken())
    console.log("from the profile: ",resFromFlat)
    
    if(resFromFlat.data){
      const resFromFamilyMember = await getDataWithoutStringAndWithInt("All_Residents","Relationship_with_the_primary_contact","Self","Flats_lookup",resFromFlat.data[0].ID,getAccessToken())
      console.log("resfromfamilyrelation: ",resFromFamilyMember.data)
      console.log("resfromfamilyinfo ",resFromFamilyMember.data[0].App_User_lookup)
      if(resFromFamilyMember.data){
        navigation.navigate("MyProfile",{userInfo: resFromUser.data,vehicleInfo: resFromVehicleInfo.data,flatExists:true,familyMembersData:resFromFamilyMember.data})
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
       <View style={styles.safeArea}>
      <View style={styles.topSection}>
          <View style={styles.propicArea}>
            <Image source={require("../assets/sathya.jpg")} style={styles.propic} />
          </View>
          <Text style={styles.name}>User name</Text>
          <Text style={styles.membership}>L1 Approval</Text>
        </View>


        <View style={styles.buttonList}>
        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9} onPress={toMyprofile}>
          <View style={styles.buttonArea}>
          <View style={styles.iconArea}>
            <Image source={require("../assets/myprofile.png")} style={styles.iconStyle} resizeMode="contain" />
          </View> 
          <Text style={styles.buttonName}>My Profile</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9} onPress={()=>navigation.navigate("Notifications")}>
          <View style={styles.buttonArea}>
          <View style={styles.iconArea}>
            <Image source={require("../assets/notification.png")} style={styles.iconStyle} resizeMode="contain" />
          </View> 
          <Text style={styles.buttonName}>Notifications</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9} onPress={()=>navigation.navigate("Settings")}>
          <View style={styles.buttonArea}>
          <View style={styles.iconArea}>
            <Image source={require("../assets/setting.png")} style={styles.iconStyle} resizeMode="contain" />
          </View>
          <Text style={styles.buttonName}>Settings</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9} onPress={onLogout} >
          <View style={styles.buttonArea}>
          <View style={styles.iconArea}>
            <Image source={require("../assets/logout.png")} style={styles.iconStyle} resizeMode="contain" />
          </View>
          <Text style={styles.buttonName}>Logout</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>
        </View>
      </View>
  </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  log:{
      alignItems:"center"
  },
  logoutButton: {
    backgroundColor: '#FCAF03',
    padding: 12,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    marginBottom: 30,
  },
  logout: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#2F3133',
  },
  safeArea: {
    flex: 1,
  },
  topSection: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propicArea: {
    width: 140,
    height: 140,
     borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FFBB3B'
  },
  propic: {
    width: '100%',
    height: '100%',
    borderRadius:85,
  },
  name: {
    marginTop: 20,
    color: 'white',
    fontSize: 32,
  },
  membership: {
    color: '#FFBB3B',
    fontSize: 18,
  },
  buttonList: {
    marginTop: 20,
  },
  buttonSection: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 25,

  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconArea: {
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  buttonName: {
    width: 300,
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
  },
  sp: {
    width: 400,
    marginTop: 10,
    height: 1,
    backgroundColor: '#FFFFFF45'
  }
})