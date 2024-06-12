import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {useForm, Controller} from 'react-hook-form';
import {getDataWithInt, postDataWithInt} from '../components/ApiRequest';
import UserContext from '../../context/UserContext';

const AddData = ({navigation, route}) => {
  const formType = route.params?.formType;
  const userdata = route.params?.user;
  const vehicledata = route.params?.vehicle;
  const memberdata = route.params?.family;
  const dept = route.params.department;
  const deptExist = route.params.departmentExists;

  const {getAccessToken, L1ID} = useContext(UserContext);

  console.log('object: ', dept, deptExist);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const flatexist = route.params.flat;
  const flatdata = route.params.flatdata;

  const vehicleTypeDropDown = [
    {label: '2-wheeler', value: '2-wheeler'},
    {label: 'Car', value: 'Car'},
    {label: 'Bus', value: 'Bus'},
    {label: 'Taxi', value: 'Taxi'},
    {label: 'School Bus', value: 'School Bus'},
    {label: 'Police Van', value: 'Police Van'},
  ];

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

  const [isFocus, setIsFocus] = useState(true);

  const gender = ['Male', 'Female'];
  const [selectedGender, setSelectedGender] = useState('');

  const saveDataFromVehicle = async vehicledata => {
    console.log(vehicledata);
    const vehicle = {
      data: {
        App_User_lookup: L1ID,
        Vehicle_Type: vehicledata.vehicleType,
        Vehicle_Number: vehicledata.vehicleNumber,
      },
    };

    const resFromVehicle = await postDataWithInt(
      'Vehicle_Information',
      vehicle,
      getAccessToken(),
    );

    if (resFromVehicle.message === 'Data Added Successfully') {
      navigation.navigate('Profile', {
        userInfo: route.params.user,
        vehicleInfo: route.params.vehicle,
        familyMembersData: route.params.family,
        flatExists: flatexist,
        flat: flatdata,
        dapartment: dept,
        dapartmentExists: deptExist,
      });
    }
  };

  const handleCancelByMemeberInfo = () => {
    navigation.navigate('MyProfile', {
      userInfo: [{...userdata}],
      vehicleInfo: vehicledata,
      familyMembersData: route.params.family,
      flatExists: flatexist,
      flat: flatdata,
      dapartment: dept,
      dapartmentExists: deptExist,
    });
  };

  const saveMemberData = async memeberdata => {
    console.log(memeberdata);
    const user = {
      data: {
        Name_field: memeberdata.name,
        Email: memeberdata.email,
        Phone_Number: memeberdata.phone,
        Secondary_Phone: memeberdata.secondary_phone,
        Gender: memeberdata.gender,
      },
    };
    console.log(user);
    const resFromAppUser = await postDataWithInt(
      'App_User',
      user,
      getAccessToken(),
    );
    console.log('resFromAppUser: ', resFromAppUser);
    if (resFromAppUser.message === 'Data Added Successfully') {
      const resFromFlat = await getDataWithInt(
        'All_Flats',
        'Primary_Contact_app_user_lookup',
        L1ID,
        getAccessToken(),
      );
      console.log(resFromFlat);
      if (resFromFlat && resFromFlat.data) {
        const residenceinfo = {
          data: {
            App_User_lookup: resFromAppUser.data.ID,
            Flats_lookup: resFromFlat.data[0].ID,
            Accommodation_Approval: 'PENDING APPROVAL',
            Relationship_with_the_primary_contact: memeberdata.relation,
          },
        };
        console.log(residenceinfo);
        const resFromResident = await postDataWithInt(
          'Resident',
          residenceinfo,
          getAccessToken(),
        );
        if (resFromResident.message === 'Data Added Successfully') {
          navigation.navigate('Profile', {
            userInfo: route.params.user,
            vehicleInfo: route.params.vehicle,
            familyMembersData: route.params.family,
            flatExists: route.params.flat,
          });
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        {formType === 'FlatMember' ? (
          <View style={styles.main}>
            <Text style={styles.title}>Flat Member Form</Text>
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
                    onChangeText={onChange}
                  />
                )}
                rules={{required: true}}
              />
              {errors.email && (
                <Text style={styles.textError}>Email is required</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Relation Type <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="relation" // Use unique key for Controller name
                control={control}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={styles.inputBox}
                    data={relationTypeDropDown}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={value}
                    placeholder="Select an option"
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
              {errors['relation'] && (
                <Text style={styles.textError}>Relation type is required</Text>
              )}
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

            <View>
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
              onPress={handleSubmit(saveMemberData)}>
              <Text style={styles.registerTitle}>Save</Text>
            </TouchableOpacity>  */}

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleSubmit(saveMemberData)}
                style={styles.submit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelByMemeberInfo}
                style={styles.Cancel}>
                <Text style={styles.buttonText1}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : formType === 'VehicleInfo' ? (
          // Placeholder for VehicleInfo form implementation
          <View style={styles.main}>
            <Text style={styles.title}>Vehicle Information Form</Text>
            <View style={styles.field}>
              <Text style={styles.label}>
                Vehicle Type <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="vehicleType" // Use unique key for Controller name
                control={control}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={styles.inputBox}
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
              {errors['vehicleType'] && (
                <Text style={styles.textError}>Vehicle type is required</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Vehicle Number <Text style={{color: 'red'}}>*</Text>
              </Text>
              <Controller
                name="vehicleNumber"
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
              {errors.vehicleNumber && (
                <Text style={styles.textError}>Vehicle number is required</Text>
              )}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleSubmit(saveDataFromVehicle)}
                style={styles.submit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.Cancel}>
                <Text style={styles.buttonText1}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default AddData;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
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
  infoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    flexDirection: 'column',
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
    width: 327,
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.08,
    marginBottom: 24,
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
    backgroundColor: '#B21E2B',
  },
});
