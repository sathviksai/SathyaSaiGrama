import {
  StyleSheet,
  Text,
  Touchable,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, {useContext} from 'react';
import { Image } from 'react-native-elements';
import FamilyMember from './FamilyMember';


const MyProfile = ({route, navigation}) => {
  const userdata = route.params?.userInfo[0]
  const vehicledata = route.params?.vehicleInfo;
  const familyMembersData = route.params?.familyMembersData
  console.log("user data in my: ",userdata)
  console.log("vehicle data in my: ",vehicledata);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.head}>
          <Text style={styles.title}>Basic Information</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Edit',{formType: "BasicInfo",userdata: userdata,vehicledata: vehicledata})} style={styles.edit}>
            <Image source={require('../assets/edit.png')} style={{width:30, height: 30}}/>
            <Text style={{color: 'blue', fontWeight: 'bold',alignSelf:"center"}}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sp}></View>

        <View>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userdata.Name_field}</Text>
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userdata.Email}</Text>
        </View>
        <View>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{userdata.Phone_Number}</Text>
        </View>
        <View>
          <Text style={styles.label}>Secondary Phone</Text>
          <Text style={styles.value}>{userdata.Secondary_Phone}</Text>
        </View>
        <View>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{userdata.Gender}</Text>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.head}>
          <Text style={styles.title}>Vehicle Information</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Edit',{formType: "VehicleInfo",userdata: userdata,vehicledata: vehicledata})}  style={styles.edit}>
             <Image source={require('../assets/edit.png')} style={{width:30, height: 30}}/>
            <Text style={{color: 'blue', fontWeight: 'bold',alignSelf:"center"}}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sp}></View>

        {vehicledata?(
           vehicledata.map((vehicle, index) => (
            <View key={index} style={{flexDirection:"row",justifyContent:"space-around"}}> 
              <View>
                <Text style={styles.label}>Vehicle Type</Text>
                <Text style={styles.value}>{vehicle.Vehicle_Type}</Text>
              </View>
              <View>
                <Text style={styles.label}>Vehicle Number</Text>
                <Text style={styles.value}>{vehicle.Vehicle_Number}</Text>
              </View>
            </View>
          ))
        ):(
          <></>
        )}
      
      </View>

      {route.params.flatExists ? (
        <View>
          <View style={styles.main}>
            <View style={styles.head}>
              <Text style={styles.title}>Family Members</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddData')} style={styles.edit}>
                <Image source={require('../assets/add.jpg')} style={{ width: 30, height: 30 }} />
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          
          {familyMembersData?.map((memberInfo, index) => (
            <FamilyMember key={index} member={memberInfo} navigation={navigation}/>
          ))}
          </View>
        </View>
      ) : (
        <></>
      )}

    </ScrollView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C19F83',
    flex: 1,
  },
  main: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
    margin:"3%",
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 2, height: 2},
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sp: {
    width: 400,
    marginTop: 10,
    height: 1,
    backgroundColor: '#FFFFFF45',
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom:"3%"
  },
  label: {
    fontSize: 18,
  },
  value: {
    color: 'black',
    fontSize: 20,
    marginBottom: 15,
  },
  edit:{
    flexDirection:"row",
    alignItems:"baseline"
  }
});
