import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import React, {useContext, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {patchDataWithInt, patchDataWithRecordId} from '../components/ApiRequest';
import UserContext from '../../context/UserContext';

const Edit = ({route, navigation}) => {
  const formType = route.params?.formType;
  const userdata = route.params?.userdata;
  const vehicledata = route.params?.vehicledata;
  const memberdata = route.params?.memberdata

  const gender = ['Male', 'Female'];
  const [selectedGender, setSelectedGender] = useState(userdata?.Gender);
  const [memSelectedGender, setMemSelectedGender] = useState(memberdata?.App_User_lookup.Gender);

  const relationTypeDropDown = [
    {label: 'Spouse', value: 'Spouse'},
    {label: 'Son', value: 'Son'},
    {label: 'Daughter', value: 'Daughter'},
    {label: 'Mother', value: 'Mother'},
    {label: 'Father', value: 'Father'},
    {label: 'Brother', value: 'Brother'},
    {label: 'Sister', value: 'Sister'},
    {label: 'Colleague', value: 'Colleague'},
    {label: 'Grand Mother', value: 'Grand Mother'},
    {label: 'Grand Father', value: 'Grand Father'},
    {label: 'Aunt', value: 'Aunt'},
    {label: 'Uncle', value: 'Uncle'},
    {label: 'Father-in-Law', value: 'Father-in-Law'},
    {label: 'Mother-in-Law', value: 'Mother-in-Law'},
    {label: 'Sister-in-Law', value: 'Sister-in-Law'},
    {label: 'Brother-in-Law', value: 'Brother-in-Law'},
    {label: 'Niece', value: 'Niece'},
    {label: 'Nephew', value: 'Nephew'},
    {label: 'Grandson', value: 'Grandson'},
    {label: 'Granddaughter', value: 'Granddaughter'},
    {label: 'Other', value: 'Other'},
  ];

  // const { formType, userdata, vehicledata } = route.params;
  const {L1ID, getAccessToken} = useContext(UserContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: userdata?.Name_field,
      phone: userdata?.Phone_Number,
      secondary_phone: userdata?.Secondary_Phone,
      email: userdata?.Email,
      gender: userdata?.Gender,
      familymembername: memberdata?.App_User_lookup.Name_field,
      familymemberemail: memberdata?.App_User_lookup.Email,
      familymemberphone: memberdata?.App_User_lookup.Phone_Number,
      familymemberrelation: memberdata?.Relationship_with_the_primary_contact
    },
  });
  const vehicleTypeDropDown = [
    {label: '2-wheeler', value: '2-wheeler'},
    {label: 'Car', value: 'Car'},
    {label: 'Bus', value: 'Bus'},
    {label: 'Taxi', value: 'Taxi'},
    {label: 'School Bus', value: 'School Bus'},
    {label: 'Police Van', value: 'Police Van'},
  ];

  const [isFocus, setIsFocus] = useState(true);

  const saveDataFromBasicInfo = async (basicInfo) => {
    const updateddata = {
      Name_field: basicInfo.name,
      Phone_Number: basicInfo.phone,
      Secondary_Phon: basicInfo.secondary_phone,
      Gender: basicInfo.gender,
    };
    const user = {
      criteria: `ID==${L1ID}`,
      data: updateddata,
    };

    const resFromUserUpdate = await patchDataWithInt(
      'All_App_Users',
      user,
      getAccessToken(),
    );
    if (resFromUserUpdate.result[0].code === 3000) {
      console.log(basicInfo);
      navigation.navigate('MyProfile', {
        userInfo: [{...userdata, ...updateddata}],
        vehicleInfo: vehicledata,
      });
    } else {
      Alert.alert('Error code', resFromUserUpdate.code);
    }
  };

  const saveDataFromVehicleInfo = async (vehicleInfo, id, ind) => {
    console.log('object');
    const updateddata = {
      Vehicle_Type: vehicleInfo[`vehicleType${ind}`],
      Vehicle_Number: vehicleInfo[`vehicleNumber${ind}`],
    };

    const vehicle = {
      criteria: `App_User_lookup==${L1ID}&&ID==${id}`,
      data: updateddata,
    };

    console.log(vehicle);
    const resFromVehicleUpdate = await patchDataWithInt(
      'All_Vehicle_Information',
      vehicle,
      getAccessToken(),
    );
    console.log(resFromVehicleUpdate);
    if (resFromVehicleUpdate.result[0].code === 3000) {
      console.log(updateddata);
      const ind = vehicledata.findIndex(vehicle => vehicle.ID === id);

      if (ind != -1) {
        vehicledata[ind] = {...vehicledata[ind], ...updateddata};
      }
      navigation.navigate('MyProfile', {
        userInfo: [{...userdata}],
        vehicleInfo: vehicledata,
      });
    } else {
      Alert.alert('Error code', resFromUserUpdate.code);
    }
  };

  const saveDataFromFamilyMemberBasicInfo = async(memberInfo) => {

    const sendUpdateddata = {
      App_User_lookup:{
        Name_field: memberInfo.familymembername,
        Phone_Number: memberInfo.familymemberphone,
        Email:memberInfo.familymemberemail,
        Gender: memSelectedGender,
      }
    };

    console.log(memberdata.App_User_lookup.ID)
    const user = {
      criteria: `ID==${memberdata.App_User_lookup.ID}`,
      data: {
        Name_field: memberInfo.familymembername,
        Phone_Number: memberInfo.familymemberphone,
        Gender: memSelectedGender,
      }
    };


    console.log(user)

    const resFromMemberUpdate = await patchDataWithInt('All_App_Users',user,getAccessToken());
    console.log(getAccessToken())

    console.log("resFromMemUpdate: ",resFromMemberUpdate)

     if (resFromMemberUpdate.result[0].message ===  "Data Updated Successfully") {
      navigation.navigate('FamilyMemberVerifyDetails', {memberDetails:{...sendUpdateddata}});
    } else {
      Alert.alert('Error code', resFromMemberUpdate.code);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {formType === 'BasicInfo' ? (
          <>
            <Text style={styles.title}>Basic Information</Text>
            <View style={styles.field}>
              <Text style={styles.label}>
                Name <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="name"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                rules={{required: true}}
              />
              {errors.name && (
                <Text style={styles.textError}>Name is required</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Email <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="email"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    value={value}
                    editable={false}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Phone <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="phone"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                rules={{required: true}}
              />
              {errors.phone && (
                <Text style={styles.textError}>Phone number is required</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Secondary Phone</Text>
              <Controller
                name="secondary_phone"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Gender <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                control={control}
                name="gender"
                rules={{required: 'Gender is required'}}
                render={({field: {onChange}}) => (
                  <View style={styles.radioButtonContainer}>
                    {gender.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.singleOptionContainer}
                        onPress={() => {
                          setSelectedGender(option);
                          onChange(option);
                        }}>
                        <View style={styles.outerCircle}>
                          {selectedGender === option && (
                            <View style={styles.innerCircle} />
                          )}
                        </View>
                        <Text style={{marginLeft: 10}}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.gender && (
                <Text style={{color: 'red'}}>{errors.gender.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.register}
              onPress={handleSubmit(saveDataFromBasicInfo)}>
              <Text style={styles.registerTitle}>Save</Text>
            </TouchableOpacity>
          </>
        ) : formType === 'VehicleInfo' ? (
          <>
            <View style={styles.head}>
              <Text style={styles.title}>Vehicle Information</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddData')}
                style={styles.add}>
                <Image
                  source={require('../assets/add.jpg')}
                  style={{width: 30, height: 30}}
                />
                <Text
                  style={{
                    color: 'blue',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            {vehicledata ? (
              vehicledata.map((vehicle, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{marginEnd: 15}}>
                    <Text style={styles.label}>Vehicle Type</Text>
                    <Controller
                      name={`vehicleType${index}`} // Use unique key for Controller name
                      control={control}
                      defaultValue={vehicle.Vehicle_Type}
                      render={({field: {onChange, value}}) => (
                        <Dropdown
                          style={{
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingLeft: 10,
                            backgroundColor: '#F8F4F0',
                            width: 120,
                          }}
                          data={vehicleTypeDropDown}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          value={value}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            onChange(item.value); // Update the form value
                            setIsFocus(false);
                          }}
                        />
                      )}
                      rules={{required: true}}
                    />
                    {errors[`vehicleType-${index}`] && (
                      <Text style={styles.textError}>
                        Vehicle type is required
                      </Text>
                    )}
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Vehicle Number</Text>
                    <Controller
                      name={`vehicleNumber${index}`} // Use unique key for Controller name
                      control={control}
                      defaultValue={vehicle.Vehicle_Number}
                      render={({field: {onChange, value}}) => (
                        <TextInput
                          style={styles.inputBox}
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                      rules={{required: true}}
                    />
                    {errors[`vehicleNumber${index}`] && ( // Corrected error handling for dynamic field names
                      <Text style={styles.textError}>
                        Vehicle number is required
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.registerVehicle}
                    onPress={handleSubmit(
                      data => saveDataFromVehicleInfo(data, vehicle.ID, index), // Passed index correctly to handleSubmit
                    )}>
                    <Text style={styles.registerVehicleTitle}>Save</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <></>
            )}
          </>
        ) : formType === 'MemberBasicInfo' ?(
          <>
            <Text style={styles.title}>Basic Information</Text>
            <View style={styles.field}>
              <Text style={styles.label}>
                Name <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="familymembername"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                rules={{required: true}}
              />
              {errors.familymembername && (
                <Text style={styles.textError}>Name is required</Text>
              )}
            </View>

            <View style={styles.field}>
          <Text style={styles.label}>
            Relation Type<Text style={{color: 'red'}}>*</Text>
          </Text>
          <Controller
            name="familymemberrelation" // Use unique key for Controller name
            control={control}
            render={({field: {onChange, value}}) => (
              <Dropdown
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingLeft: 10,
                  backgroundColor: '#F8F4F0',
                  borderWidth: 1,
                  borderColor: 'grey',
                  paddingHorizontal: 12,
                  width: '90%',
                  marginTop: 5,
                }}
                data={relationTypeDropDown}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  onChange(item.value); // Update the form value
                  setIsFocus(false);
                }}
              />
            )}
            rules={{required: true}}
          />
          {errors['familymemberrelation'] && (
            <Text style={styles.textError}>Relation type is required</Text>
          )}
        </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Email <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="familymemberemail"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Phone <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="familymemberphone"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                rules={{required: true}}
              />
              {errors.familymemberphone && (
                <Text style={styles.textError}>Phone number is required</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Gender <Text style={{color: 'red'}}>*</Text>
              </Text>
                  <View style={styles.radioButtonContainer}>
                    {gender.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.singleOptionContainer}
                        onPress={() => {
                          setMemSelectedGender(option);
                          onChange(option);
                        }}
                      >
                        <View style={styles.outerCircle}>
                          {memSelectedGender === option && <View style={styles.innerCircle} />}
                        </View>
                        <Text style={{marginLeft: 10}}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
            </View>

            <TouchableOpacity style={styles.register} onPress={handleSubmit(saveDataFromFamilyMemberBasicInfo)}>
              <Text style={styles.registerTitle}>Save</Text>
            </TouchableOpacity>
          </>
        ):(
          <></>
        )}
      </View>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C19F83',
    flex: 1,
  },
  main: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginStart: 10,
    marginEnd: 10,
    marginBottom: 10,
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
  label: {
    fontSize: 15,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    borderRadius: 10,
    width: '90%',
    marginTop: 5,
  },
  register: {
    width: '90%',
    backgroundColor: '#752A26',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  registerTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
  },
  registerVehicleTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    alignSelf: 'center',
  },
  registerVehicle: {
    width: '25%',
    backgroundColor: '#752A26',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'flex-start',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  add: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  textError: {
    color: 'red',
    fontSize: 12,
  },
  field: {
    marginBottom: 15,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'auto',
  },
  singleOptionContainer: {
    flexDirection: 'row', // ensure the circle and text are in a row
    alignItems: 'center', // vertically center align the circle and text
    marginRight: 20, // add space between the buttons
    marginVertical: 10, // add vertical margin for spacing above and below buttons
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e2e2',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 11,
    backgroundColor: '#752A26',
  },
});
