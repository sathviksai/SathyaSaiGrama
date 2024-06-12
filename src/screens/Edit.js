import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import React, {useContext, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {
  patchDataWithInt,
  patchDataWithRecordId,
} from '../components/ApiRequest';
import UserContext from '../../context/UserContext';

const Edit = ({route, navigation}) => {
  const formType = route.params?.formType;
  const userdata = route.params?.userdata;
  const vehicledata = route.params?.vehicledata;
  const memberdata = route.params?.memberdata;

  const gender = ['Male', 'Female'];
  const [selectedGender, setSelectedGender] = useState(userdata?.Gender);
  const [memSelectedGender, setMemSelectedGender] = useState(
    memberdata?.App_User_lookup.Gender,
  );
  console.log(
    'object: ',
    formType,
    route.params?.departmentName, // Ensure the parameter names match
    route.params?.departmentNameExists,
  );
  const dept = route.params?.departmentName;
  const deptExists = route.params?.departmentNameExists;

  const [loading, setLoading] = useState(false);

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
      familymemberrelation: memberdata?.Relationship_with_the_primary_contact,
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

  const handleCancelByMemberBasicInfo = () => {
    navigation.navigate('Profile');
  };

  const handleCancelByBasicInfo = () => {
    navigation.navigate('MyProfile', {
      userInfo: [{...userdata}],
      vehicleInfo: vehicledata,
      familyMembersData: route.params.family,
      flatExists: route.params.flat,
      flat: route.params.flatdata,
      dapartment: dept,
      dapartmentExists: deptExists,
      flatMember: route.params.flatMember,
    });
  };

  const saveDataFromBasicInfo = async basicInfo => {
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
        familyMembersData: route.params.family,
        flatExists: route.params.flat,
        flat: route.params.flatdata,
        dapartment: dept,
        dapartmentExists: deptExists,
        flatMember: route.params.flatMember,
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
        familyMembersData: route.params.family,
        flatExists: route.params.flat,
        flat: route.params.flatdata,
        dapartment: dept,
        dapartmentExists: deptExists,
        flatMember: route.params.flatMember,
      });
    } else {
      Alert.alert('Error code', resFromUserUpdate.code);
    }
  };

  const saveDataFromFamilyMemberBasicInfo = async memberInfo => {
    const sendUpdateddata = {
      App_User_lookup: {
        Name_field: memberInfo.familymembername,
        Phone_Number: memberInfo.familymemberphone,
        Email: memberInfo.familymemberemail,
        Gender: memSelectedGender,
        ID: memberdata?.App_User_lookup.ID,
      },
      Relationship_with_the_primary_contact: memberInfo?.familymemberrelation,
      ID: memberdata?.ID,
    };

    console.log(memberdata?.App_User_lookup.ID);
    const user = {
      criteria: `ID==${memberdata?.App_User_lookup.ID}`,
      data: {
        Name_field: memberInfo?.familymembername,
        Phone_Number: memberInfo?.familymemberphone,
        Gender: memSelectedGender,
      },
    };
    console.log(user);

    console.log(memberdata?.ID);

    const relationUpdate = {
      criteria: `ID==${memberdata?.ID}`,
      data: {
        Relationship_with_the_primary_contact: memberInfo?.familymemberrelation,
      },
    };

    console.log(relationUpdate);
    console.log(getAccessToken());

    const resFromRelation = await patchDataWithInt(
      'All_Residents',
      relationUpdate,
      getAccessToken(),
    );
    console.log('resFromRelation: ', resFromRelation);

    const resFromMemberUpdate = await patchDataWithInt(
      'All_App_Users',
      user,
      getAccessToken(),
    );
    console.log(getAccessToken());

    console.log('resFromMemUpdate: ', resFromMemberUpdate);
    console.log('route.params?.membersData: ', route.params?.membersData);

    if (
      resFromMemberUpdate &&
      resFromMemberUpdate.result[0].message === 'Data Updated Successfully' &&
      resFromRelation &&
      resFromRelation.result[0].message === 'Data Updated Successfully'
    ) {
      const membersData = route.params?.membersData;

      // const index = membersData.findIndex(obj => obj.ID === memberdata?.ID);

      // if (index === -1) {
      //   membersData[index] = {}
      // }
      navigation.navigate('Profile', {
        userInfo: route.params.user,
        vehicleInfo: route.params.vehicle,
        familyMembersData: route.params.family,
        flatExists: route.params.flat,
        flat: route.params.flatdata,
        dapartment: dept,
        dapartmentExists: deptExists,
      });
    } else {
      Alert.alert('Error code', resFromMemberUpdate.code);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        {formType === 'BasicInfo' ? (
          <View>
            <Text style={styles.title}>Personal Info</Text>
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

            {/* <TouchableOpacity
              style={styles.register}
              onPress={handleSubmit(saveDataFromBasicInfo)}>
              <Text style={styles.registerTitle}>Save</Text>
            </TouchableOpacity> */}

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleSubmit(saveDataFromBasicInfo)}
                style={styles.submit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelByBasicInfo}
                style={styles.Cancel}>
                <Text style={styles.buttonText1}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : formType === 'VehicleInfo' ? (
          <View>
            <View style={styles.head}>
              <Text style={styles.title}>Vehicle Info</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddData', {
                    formType: 'VehicleInfo',
                    userdata: userdata,
                    vehicledata: vehicledata,
                    family: route.params?.familyMembersData,
                    flat: route.params.flatExists,
                  })
                }
                style={styles.edit}>
                <Image
                  source={require('../assets/add.png')}
                  style={{
                    width: 17,
                    height: 14.432,
                    marginEnd: 5,
                    flexShrink: 0,
                  }}
                />
                <Text style={[styles.title, styles.editText]}>Add</Text>
              </TouchableOpacity>
            </View>
            {vehicledata ? (
              vehicledata.map((vehicle, index) => (
                <View style={styles.main} key={index}>
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      marginBottom: 0,
                    }}>
                    <View style={{marginEnd: 15}}>
                      <Text style={styles.label}>Vehicle Type</Text>
                      <Controller
                        name={`vehicleType${index}`} // Use unique key for Controller name
                        control={control}
                        defaultValue={vehicle.Vehicle_Type}
                        render={({field: {onChange, value}}) => (
                          <Dropdown
                            style={[styles.dropdownVehicle, styles.inputBox]}
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
                            style={[styles.inputBox, styles.dropdownVehicle]}
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
                    {/* <TouchableOpacity
                    style={styles.registerVehicle}
                    onPress={handleSubmit(
                      data => saveDataFromVehicleInfo(data, vehicle.ID, index), // Passed index correctly to handleSubmit
                    )}>
                    <Text style={styles.registerVehicleTitle}>Save</Text>
                  </TouchableOpacity> */}
                  </View>

                  <View style={[styles.footer, styles.submitButton]}>
                    <TouchableOpacity
                      style={styles.submit}
                      onPress={handleSubmit(
                        data =>
                          saveDataFromVehicleInfo(data, vehicle.ID, index), // Passed index correctly to handleSubmit
                      )}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <></>
            )}
          </View>
        ) : formType === 'MemberBasicInfo' ? (
          <>
            <Text style={styles.title}>Personal Info</Text>
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
                Relation Type <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="familymemberrelation" // Use unique key for Controller name
                control={control}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={styles.inputBox}
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
                    editable={false}
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
                    }}>
                    <View style={styles.outerCircle}>
                      {memSelectedGender === option && (
                        <View style={styles.innerCircle} />
                      )}
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Inter',
                        fontSize: 14,
                        fontStyle: 'normal',
                        fontWeight: '400',
                      }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleSubmit(saveDataFromFamilyMemberBasicInfo)}
                style={styles.submit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelByMemberBasicInfo}
                style={styles.Cancel}>
                <Text style={styles.buttonText1}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  submitButton: {
    alignSelf: 'center',
    marginTop: 4,
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    flexDirection: 'column',
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  editText: {
    color: '#B21E2B',
  },
  label: {
    alignSelf: 'stretch',
    color: '#2F3036',
    fontFamily: 'Inter',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  inputBox: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: 12,
  },
  title: {
    width: 327,
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.08,
    marginBottom: 24,
  },
  dropdownVehicle: {
    width: '100%',
    marginEnd: 85,
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
    // flexDirection:"row"
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
    marginEnd: 8,
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 11,
    backgroundColor: '#B21E2B',
  },
  footer: {
    flex: 1,
    width: 340,
    height: 45,
    paddingVertical: 20,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  buttonText1: {
    color: '#B21E2B',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  submit: {
    height: 50,
    width: 110,
    backgroundColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Cancel: {
    height: 50,
    width: 110,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleSubmit: {
    width: 80,
  },
  main: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: '3%',
    width: 310,
    alignSelf: 'center',
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
});
