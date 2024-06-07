import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {useForm, Controller} from 'react-hook-form';
import { getDataWithInt, postDataWithInt } from '../components/ApiRequest';
import UserContext from '../../context/UserContext';

const AddData = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

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
  const { getAccessToken,L1ID } = useContext(UserContext)

  const gender = ['Male', 'Female'];
  const [selectedGender, setSelectedGender] = useState('');

  const saveMemberData = async(memeberdata) => {
    console.log(memeberdata)
    const user ={
      data:{
        Name_field: memeberdata.name,
        Email: memeberdata.email,
        Phone_Number: memeberdata.phone,
        Secondary_Phone: memeberdata.secondary_phone,
        Gender: memeberdata.gender
      }
    }
    console.log(user)
    const resFromAppUser = await postDataWithInt("App_User",user,getAccessToken())
    console.log(resFromAppUser)
    if(resFromAppUser.message === "Data Added Successfully"){
       const resFromFlat = await getDataWithInt("All_Flats","Primary_Contact_app_user_lookup",L1ID,getAccessToken())
       console.log(resFromFlat)
       if(resFromFlat.data){
          const residenceinfo = {
            data:{
              App_User_lookup: L1ID,
              Flats_lookup: resFromFlat.data[0].ID,
              Accommodation_Approval: "PENDING APPROVAL",
              Relationship_with_the_primary_contact: memeberdata.relation
            }
          }
          console.log(residenceinfo)
          const resFromResident = await postDataWithInt("Resident",residenceinfo,getAccessToken())
          if(resFromResident.message === "Data Added Successfully"){
            navigation.navigate("MyProfile")
          }
       }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.main}>
      <Text style={styles.title}>Family Member Form</Text>
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
            Relation Type<Text style={{color: 'red'}}>*</Text>
          </Text>
          <Controller
            name="relation" // Use unique key for Controller name
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
        rules={{ required: 'Gender is required' }}
        render={({ field: { onChange } }) => (
          <View style={styles.radioButtonContainer}>
            {gender.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.singleOptionContainer}
                onPress={() => {
                  setSelectedGender(option);
                  onChange(option);
                }}
              >
                <View style={styles.outerCircle}>
                  {selectedGender === option && <View style={styles.innerCircle} />}
                </View>
                <Text style={{marginLeft: 10}}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.gender && <Text style={{ color: 'red' }}>{errors.gender.message}</Text>}
      </View>

        <TouchableOpacity
          style={styles.register}
          onPress={handleSubmit(saveMemberData)}>
          <Text style={styles.registerTitle}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddData;

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
