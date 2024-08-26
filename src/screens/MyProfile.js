import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native-elements';
import FamilyMember from './FamilyMember';
import {getDataWithInt} from '../components/ApiRequest';

const MyProfile = ({route, navigation}) => {
  const userdata = route.params?.userInfo[0];
  const vehicledata = route.params?.vehicleInfo;
  const familyMembersData = route.params?.familyMembersData;
  const [refreshing, setRefreshing] = useState(false);
  console.log(
    'object: ',

    route.params.flatExists,
    route.params.flatMember,
    route.params.flat,
  );
  const dept = route.params?.dapartment;
  const deptExists = route.params?.dapartmentExists;
  // console.log('user data in my: ', userdata);
  // console.log('vehicle data in my: ', vehicledata);

  console.log('from ', dept, deptExists);

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.myprofile}>
        <Text style={styles.myprofileTitle}>My Profile</Text>
      </View> */}
      <View style={styles.main}>
        <View style={styles.head}>
          <Text style={styles.title}>Personal Info</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Edit', {
                formType: 'BasicInfo',
                userdata: userdata,
                vehicledata: vehicledata,
                family: route.params?.familyMembersData,
                flat: route.params.flatExists,
                flatdata: route.params.flat,
                departmentName: dept, // Fix typo here
                departmentNameExists: deptExists, // Fix typo here
                flatMember: route.params.flatMember,
              })
            }
            style={styles.edit}>
            <Image
              source={require('../assets/edit.png')}
              style={{width: 17, height: 14.432, marginEnd: 5, flexShrink: 0}}
            />
            <Text style={[styles.title, styles.editText]}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.input}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userdata.Name_field}</Text>
        </View>
        <View style={styles.input}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{userdata.Phone_Number}</Text>
        </View>
        <View style={styles.input}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userdata.Email}</Text>
        </View>
        <View style={styles.input}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{userdata.Gender}</Text>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.head}>
          <Text style={styles.title}>Vehicle Info</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Edit', {
                formType: 'VehicleInfo',
                userdata: userdata,
                vehicledata: vehicledata,
                family: route.params?.familyMembersData,
                flat: route.params.flatExists,
                flatdata: route.params.flat,
                departmentName: dept, // Fix typo here
                departmentNameExists: deptExists, // Fix typo here
                flatMember: route.params?.flatMember,
              })
            }
            style={styles.edit}>
            <Image
              source={require('../assets/edit.png')}
              style={{width: 17, height: 14.432, marginEnd: 5, flexShrink: 0}}
            />
            <Text style={[styles.title, styles.editText]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sp}></View>

        {vehicledata ? (
          vehicledata.map((vehicle, index) => (
            <View key={index} style={styles.input}>
              <Text style={styles.label}>{vehicle.Vehicle_Type}:</Text>
              <Text style={styles.value}>{vehicle.Vehicle_Number}</Text>
            </View>
          ))
        ) : (
          <></>
        )}
      </View>

      {route.params.flatExists ? (
        <TouchableOpacity
          style={styles.main}
          activeOpacity={0.6}
          onPress={() =>
            navigation.navigate('FlatMembers', {membersInfo: familyMembersData})
          }>
          <View>
            <View style={styles.head}>
              <Text style={styles.title}>Flat Members</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddData', {
                    formType: 'FlatMember',
                    user: userdata,
                    vehicle: route.params.vehicleInfo,
                    family: route.params?.familyMembersData,
                    flat: route.params.flatExists,
                    flatdata: route.params.flat,
                    department: dept,
                    departmentExists: deptExists,
                  })
                }
                style={styles.edit}>
                <Image
                  source={require('../assets/add.png')}
                  style={{width: 14, height: 14, marginEnd: 5, flexShrink: 0}}
                />
                <Text style={[styles.title, styles.editText]}>Add</Text>
              </TouchableOpacity>
            </View>

            {familyMembersData?.map((memberInfo, index) => (
              // <FamilyMember
              //   key={index}
              //   member={memberInfo}
              //   navigation={navigation}
              // />
              <View key={index} style={[styles.input]}>
                <Text style={[styles.label]}>
                  {memberInfo.Relationship_with_the_primary_contact}:
                </Text>
                <Text style={[styles.value]}>
                  {memberInfo.App_User_lookup.Name_field}
                </Text>
              </View>
            ))}
            {/* {familyMembersData?(
               <FlatList
               data={familyMembersData}
               renderItem={({item}) => (
                 <FamilyMember
                   navigation={navigation}
                   key={item.ID}
                   member={item}
                 />
               )}
               keyExtractor={item => item.ID.toString()}
               refreshControl={
                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
               }
             />
            ):(
              <></>
            )} */}
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}

      {(route.params?.flatExists || route.params?.flatMember) && deptExists ? (
        <View style={styles.main}>
          <Text style={styles.title}>Office & Flat Info</Text>

          <View style={styles.input}>
            <Text style={styles.label}>Flat:</Text>
            <Text style={styles.value}>
              {route.params.flat.building}-{route.params.flat.flat}
            </Text>
          </View>
          <View style={styles.input}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{route.params.dapartment}</Text>
          </View>
        </View>
      ) : route.params?.flatExists || route.params?.flatMember ? (
        <View style={styles.main}>
          <Text style={styles.title}>Flat Info</Text>

          <View style={styles.input}>
            <Text style={styles.label}>Flat:</Text>
            <Text style={styles.value}>
              {route.params.flat.building}-{route.params.flat.flat}
            </Text>
          </View>
        </View>
      ) : deptExists ? (
        <View style={styles.main}>
          <Text style={styles.title}>Department Info</Text>

          <View style={styles.input}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{route.params.dapartment}</Text>
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
    flex: 1,
    backgroundColor: '#FFF',
  },
  myprofile: {
    width: 375,
    height: 56,
    paddingTop: 19.5,
    paddingRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  myprofileTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '800',
    color: '#1F2024',
    textAlign: 'center',
    // lineHeight:"normal"
  },
  main: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: '3%',
    borderRadius: 8,
    flexShrink: 0,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 2, height: 2},
        shadowColor: '#FFF',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.07,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  editText: {
    color: '#B21E2B',
  },
  input: {
    flexDirection: 'row',
    margin: 5,
    marginStart: '5%',
  },
  label: {
    marginEnd: 10,
    color: '#1F2024',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  value: {
    color: '#1F2024',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.25,
  },
});
