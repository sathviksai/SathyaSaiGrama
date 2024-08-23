import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  LogBox,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';
import PhoneInput, { isValidNumber } from 'react-native-phone-number-input';
import UserContext from '../../context/UserContext';
import { Dropdown } from 'react-native-element-dropdown';
import { BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME } from '@env';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import SentForApproval from './SentForApproval';

LogBox.ignoreLogs(['Warnings...']);
LogBox.ignoreAllLogs();
const FillByYourSelf = ({ navigation }) => {
  const [prefix, setPrefix] = useState(' ');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [men, setMen] = useState('0');
  const [women, setWomen] = useState('0');
  const [boys, setBoys] = useState('0');
  const [girls, setGirls] = useState('0');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedSG, setSelectedSG] = useState('');
  const [selectedHO, setSelectedHO] = useState('');
  const [value, setValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [image, setImage] = useState('Upload Image');
  // const [imageurl, setImageUrl] = useState('');
  // const [RES_ID, setRES_ID] = useState('');
  const [guestCategory, setGuestCategory] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [focus, setFocus] = useState(false);
  const [priority, setPriority] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [isVehicle, setIsVehicle] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  //just so that the othe code gets commited can delete after
  const phoneInput = useRef(null);

  const [vehicles, setVehicles] = useState([]);

  const handleChange = text => {
    return (
      phoneInput.current?.isValidNumber(value) && phoneInput.current !== null
    );
  };
  const { getAccessToken, loggedUser } = useContext(UserContext);
  const [date, setDate] = useState('Select Date');
  const [showModal, setShowModal] = useState(false);
  const L1ID = loggedUser.userId;
  console.log('L1ID', L1ID);
  const today = new Date();

  const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    'YYYY/MM/DD',
  );

  const options = ['Male', 'Female'];
  const singleorgroup = ['Single', 'Group'];
  const homeoroffice = ['Home', 'Office'];

  const handleDateChange = selectedDate => {
    const formatteddate = moment(selectedDate, 'YYYY-MM-DD').format(
      'DD-MMM-YYYY',
    );
    setDate(formatteddate);
    setShowModal(!showModal); //Date Picker
    setDateOfVisitErr(null);
  };

  const prefixValues = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Ms.', value: 'Ms.' },
    { label: 'Dr.', value: 'Dr.' },
    { label: 'Prof.', value: 'Peof.' },
    { label: 'Rtn.', value: 'Rtn.' },
    { label: 'Sri', value: 'Sri.' },
    { label: 'Smt.', value: 'Smt.' },
  ];
  const guestCategoryValues = [
    { label: 'Govt Officials', value: 'Govt Officials' },
    { label: 'Politician', value: 'Politician' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Press', value: 'Press' },
    { label: 'Parent', value: 'Parent' },
    { label: 'Devotee', value: 'Devotee' },
    { label: 'Other', value: 'Other' },
  ];
  const priorityValues = [
    { label: 'P1', value: 'P1' },
    { label: 'P2', value: 'P2' },
    { label: 'P3', value: 'P3' },
  ];
  const vehicleTypeValues = [
    { label: '2-wheeler', value: '2-wheeler' },
    { label: 'Car', value: 'Car' },
    { label: 'Bus', value: 'Bus' },
    { label: 'Taxi', value: 'Taxi' },
    { label: 'School Bus', value: 'School Bus' },
    { label: 'Police Van', value: 'Police Van' },
    { label: 'Ambulence', value: 'Ambulence' },
    { label: 'Van', value: 'Van' },
    { label: 'Auto', value: 'Auto' },
    { label: 'Truck', value: 'Truck' },
    { label: 'Tractor', value: 'Tractor' },
    { label: 'Cement Mixer', value: 'Cement Mixer' },
    { label: 'Fire Engine', value: 'Fire Engine' },
    { label: 'Transport Van', value: 'Transport Van' },
    { label: 'Bulldozer', value: 'Bulldozer' },
    { label: 'Roller Machine', value: 'Roller Machine' },
    { label: 'Other', value: 'Other' },
  ];

  //To get employee record
  const getEmpId = async () => {
    try {
      console.log('into getEmpId');
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_Employees?criteria=App_User_lookup==${L1ID}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken  ${getAccessToken()}`,
        },
        params: {
          criteria: `App_User_lookup == ${L1ID}`,
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

  const posttoL1aprroved = async DepartmentID => {
    // const Vehicle_Info = await postVehicle();
    const formData = {
      data: {
        Single_or_Group_Visit: selectedSG,
        L2_Approval_Status: 'PENDING APPROVAL',
        Name_field: {
          prefix: prefix,
          last_name: lastName,
          first_name: firstName,
        },
        Referrer_App_User_lookup: L1ID,
        Referrer_Approval: 'APPROVED',
        Department: DepartmentID,

        Phone_Number: formattedValue,
        Priority: priority,
        Date_of_Visit: date,
        Gender: selectedGender,
        Guest_Category: guestCategory,
        Number_of_Men: men,
        Number_of_Boys: boys,
        Number_of_Women: women,
        Number_of_Girls: girls,
        Home_or_Office: selectedHO,
        Vehicle_Information: vehicles,
      },
    };

    try {
      const response = await fetch(
        `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Approval_to_Visitor`,
        {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
          },
          body: JSON.stringify(formData),
        },
      );
      const res = await response.json();
      console.log(res);
      return res;
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };
  //Validate Phone Number
  useEffect(() => {
    const timer = setTimeout(() => {
      if (/^\+91\d{10}$/.test(formattedValue)) {
        setPhoneError(null);
      } else {
        setPhoneError(
          'Phone number must be 10 digits and it must not contain non-numeric character',
        );
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [value]);


  const handleAddVehicle = () => {
    setVehicles([...vehicles, { Vehicle_Type: '', Vehicle_Number: '' }]);
  };

  const handleRemoveVehicle = (index) => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);
  };

  const handleTextChange = (index, field, value) => {
    const updatedVehicles = vehicles.map((vehicle, i) =>
      i === index ? { ...vehicle, [field]: value } : vehicle
    );
    setVehicles(updatedVehicles);
  };



  const [nameErr, setNameErr] = useState(null);
  const [dateOfVisitErr, setDateOfVisitErr] = useState(null);
  const [singleOrGroupErr, setSingleOrGroupErr] = useState(null);
  const [homeOrOfficeErr, setHomeOrOfficeErr] = useState(null);
  const [genderErr, setGenderErr] = useState(null);
  const [phoneErr, setPhoneErr] = useState(null);

  
  const [submitFlag, setSubmitFlag] = useState(false);

  const validateForm = () => {
    let valid = true;
    if (!prefix || !firstName || !lastName) {
      setNameErr("Prefix, First Name and Last Name are required");
      valid = false;
    } else {
      setNameErr(null);
    }

    if (date === "Select Date") {
      setDateOfVisitErr("Date of visit is required");
      valid = false;
    } else {
      setDateOfVisitErr(null);
    }

    if (!formattedValue) {
      setPhoneErr("Phone number is required");
      valid = false;
    } else {
      setPhoneErr(null);
    }

    if (!selectedSG) {
      setSingleOrGroupErr("Single or Group is required");
      valid = false;
    } else {
      setSingleOrGroupErr(null);
    }

    if (!selectedHO) {
      setHomeOrOfficeErr("Home or Office is required");
      valid = false;
    } else {
      setHomeOrOfficeErr(null);
    }

    if (!selectedGender) {
      setGenderErr("Gender is required");
      if (selectedGender === "Male") {
        setMen("1");
        setWomen("0");
      } else if (selectedGender === "Female") {
        setWomen("1");
        setMen("0");
      }
      valid = false;
    } else {
      setGenderErr(null);
    }

    return valid;
  };



  // const validate = async () => {
  //   if (!prefix || prefix === "" || !firstName || firstName === "" || !lastName || lastName === "") {
  //     setNameErr("Prefix, First Name and Last Name is required")
  //   } else {
  //     setNameErr(null)
  //   }
  //   if (date === "Select Date") {
  //     setDateOfVisitErr("Date of visit is required is required")
  //   } else {
  //     setDateOfVisitErr(null)
  //   }
  //   if (!formattedValue || formattedValue === "" || formattedValue === " ") {
  //     setPhoneErr("Phone number is required is required")
  //   } else {
  //     setPhoneErr(null)
  //   }
  //   if (!selectedSG || selectedSG === "" || selectedSG === " ") {
  //     setSingleOrGroupErr("Single or Group is required")
  //   } else {
  //     setSingleOrGroupErr(null)
  //   }
  //   if (!selectedHO || selectedHO === "" || selectedHO === " ") {
  //     setHomeOrOfficeErr("Home or Office is required")
  //   } else {
  //     setHomeOrOfficeErr(null)
  //   }
  //   if (!selectedGender || selectedGender === "" || selectedGender === " ") {
  //     setGenderErr("Gender is required")
  //     if (selectedGender === 'Male') {
  //       setMen('1');
  //       setWomen('0');
  //     } else if (selectedGender === 'Female') {
  //       setWomen('1');
  //       setMen('0');
  //     }
  //   } else {
  //     setGenderErr(null)
  //   }
  // }


  const handleSubmit = async () => {
    console.log("##########vehicles are: ", vehicles)
    setSubmitFlag(true)
    if (validateForm()) {
      setIsSubmitted(true);
      let office_id;

      if (selectedHO === 'Home') {
        office_id = '3318254000027832015';
        console.log('In Home conditional block');
      } else {
        const empId = await getEmpId();
        console.log(empId);
        office_id = empId.data[0].Office_lookup.ID;
      }

      try {
        const rese = await posttoL1aprroved(office_id);
        console.log('Response', rese);
        navigation.navigate('Invite');
        setIsSubmitted(false);
      } catch (err) {
        Alert.alert(err);
      }
      // Add form submission logic here
    }
  };

  const handleReset = () => {
    setBoys('0');
    setWomen('0');
    setMen('0');
    setGirls('0');
    setPrefix(' ');
    setDate('Select Date');
    setSelectedGender('');
    setSelectedHO('');
    setSelectedSG('');
    setLastName('');
    setFirstName('');
    setValue('');
    phoneInput.current.setState({ number: '' });
    setImage('Upload Image');
    setGuestCategory('');
    setPriority('');
    setVehicleType('');
    setVehicleNumber('');
    setIsVehicle(false);
    setIsFocus(false);
    setFocus(false);
    setNameErr(null)
    setDateOfVisitErr(null)
    setPhoneErr(null)
    setSingleOrGroupErr(null)
    setHomeOrOfficeErr(null)
    setGenderErr(null)
    setPhoneErr(null)
  };


  return isSubmitted ? (
    <SentForApproval />
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingStart: 8 }}>
        <View>
          <View style={styles.namecontainer}>
            <Text style={[styles.label, { marginTop: 20 }]}>
              Name <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Dropdown
                style={[styles.dropdown, { width: '25%' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={prefixValues}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select' : '...'}
                searchPlaceholder="Search..."
                value={prefix}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  if (submitFlag) {
                    validateForm();
                  }
                  setPrefix(item.value);
                  setIsFocus(false);
                }}
              />

              <TextInput
                style={[styles.dropdown, { width: '32%', color: '#71727A' }]}
                value={firstName}
                onChangeText={(txt) => {
                  setFirstName(txt);
                  if (submitFlag) {
                    validateForm();
                  }
                }}
                selectionColor={'#B21E2B'}
              />


              <TextInput
                style={[styles.dropdown, { width: '30%', color: '#71727A' }]}
                value={lastName}
                onChangeText={(txt) => {
                  setLastName(txt);
                  if (submitFlag) {
                    validateForm();
                  }
                }}
                selectionColor={'#B21E2B'}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <Text style={[styles.bottomtext, { marginRight: 75 }]}>Prefix</Text>
              <Text style={[styles.bottomtext, { marginRight: 72 }]}>
                First Name
              </Text>
              <Text style={styles.bottomtext}>Last Name</Text>
            </View>
          </View>
          {nameErr && (
            <Text style={styles.errorText}>{nameErr}</Text>
          )}
          <View style={styles.namecontainer}>
            <Text style={styles.label}>
              Phone <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="IN"
              layout="first"
              containerStyle={styles.phoneInputContainer}
              textContainerStyle={styles.textContainer}
              flagButtonStyle={styles.flagButton}
              codeTextStyle={styles.codeText}
              onChangeText={text => {
                handleChange();
                setValue(text);
                if (submitFlag) {
                  validateForm();
                }
                setPhoneError(null);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
                setCountryCode(phoneInput.current?.getCountryCode());
              }}
              countryPickerProps={{ withAlphaFilter: true }}
              disabled={disabled}
              withDarkTheme
              withShadow
            />
            {(value.length != 0 || value.length == 10) && (
              <Text style={styles.errorText}>{phoneError}</Text>
            )}
            {phoneErr && (
              <Text style={styles.errorText}>{phoneErr}</Text>
            )}
          </View>
          <View style={styles.namecontainer}>
            <Text style={styles.label}>
              Date of Visit <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <TextInput
                style={[
                  styles.phoneInputContainer,
                  { paddingLeft: 12, color: '#71727A' },
                ]}
                value={date}
                editable={false}
              />
            </TouchableOpacity>
            {dateOfVisitErr && (
              <Text style={styles.errorText}>{dateOfVisitErr}</Text>
            )}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showModal}
              onRequestClose={() => setShowModal(false)}>
              <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <DatePicker
                      mode="calendar"
                      minimumDate={startDate}
                      onSelectedChange={handleDateChange}
                      options={{
                        backgroundColor: 'white',
                        textHeaderColor: '#B21E2b',
                        textDefaultColor: '#333',
                        selectedTextColor: 'white',
                        mainColor: 'white',
                        textSecondaryColor: 'black',
                        borderColor: '#B21E2B',
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
          <View style={styles.namecontainer}>
            <Text style={styles.label}>
              Single or Group Visit <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={styles.radioButtonContainer}>
              {singleorgroup.map(optionss => {
                return (
                  <TouchableOpacity
                    key={optionss}
                    style={styles.singleOptionContainer}
                    onPress={() => {
                      setSelectedSG(optionss);
                      setSingleOrGroupErr(null);
                    }}>
                    <View style={styles.outerCircle}>
                      {selectedSG === optionss ? (
                        <View style={styles.innerCircle} />
                      ) : null}
                    </View>
                    <Text style={{ marginLeft: 10 }}>{optionss}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {singleOrGroupErr && (
              <Text style={styles.errorText}>{singleOrGroupErr}</Text>
            )}
          </View>
          <View style={styles.namecontainer}>
            <Text style={styles.label}>
              Is the Guest being invited to Home or Office
              <Text style={{ color: 'red' }}> *</Text>
            </Text>
            <View style={styles.radioButtonContainer}>
              {homeoroffice.map(option => {
                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.singleOptionContainer}
                    onPress={() => {
                      setSelectedHO(option)
                      setHomeOrOfficeErr(null);
                    }}>
                    <View style={styles.outerCircle}>
                      {selectedHO === option ? (
                        <View style={styles.innerCircle} />
                      ) : null}
                    </View>
                    <Text style={{ marginLeft: 10 }}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {homeOrOfficeErr && (
              <Text style={styles.errorText}>{homeOrOfficeErr}</Text>
            )}
          </View>
          <View style={styles.namecontainer}>
            <Text style={styles.label}>
              Select Gender <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={styles.radioButtonContainer}>
              {options.map(option => {
                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.singleOptionContainer}
                    onPress={() => {
                      setSelectedGender(option)
                      setGenderErr(null)
                    }}>
                    <View style={styles.outerCircle}>
                      {selectedGender === option ? (
                        <View style={styles.innerCircle} />
                      ) : null}
                    </View>
                    <Text style={{ marginLeft: 10 }}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {genderErr && (
              <Text style={styles.errorText}>{genderErr}</Text>
            )}

            <View style={styles.namecontainer}>
              <Text style={styles.label}>Guest Category</Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  { width: '95%', paddingLeft: 12, color: '#71727a' },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={guestCategoryValues}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select' : '...'}
                value={guestCategory}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setGuestCategory(item.value);
                  setIsFocus(false);
                }}
              />
            </View>
            <View style={styles.namecontainer}>
              <Text style={styles.label}>Priority</Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  { width: '95%', paddingLeft: 12, color: '#71727a' },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={priorityValues}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!focus ? 'Select' : '...'}
                value={priority}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={item => {
                  setPriority(item.value);
                  setFocus(false);
                }}
              />
            </View>

            <View style={styles.namecontainer}>
              <Text style={styles.label}>Vehicle Information</Text>
              <View style={styles.vehicle}>
                <Text>Vehicle type</Text>
                <Text>Vehicle Number</Text>
              </View>
              {vehicles.map((vehicle, index) => (
                <View key={index} style={styles.newvehicle}>
                  <Picker
                    selectedValue={vehicle.Vehicle_Type}
                    style={styles.picker}
                    onValueChange={(value) => handleTextChange(index, 'Vehicle_Type', value)}>
                    <Picker.Item label="Select" value="" />
                    <Picker.Item label="2-Wheeler" value="2-Wheeler" />
                    <Picker.Item label="Car" value="Car" />
                    <Picker.Item label="Bus" value="Bus" />
                    <Picker.Item label="Taxi" value="Taxi" />
                    <Picker.Item label="School Bus" value="School Bus" />
                    <Picker.Item label="Police Van" value="Police Van" />
                    <Picker.Item label="Van" value="Van" />
                    <Picker.Item label="Auto" value="Auto" />
                    <Picker.Item label="Ambulance" value="Ambulancer" />
                    <Picker.Item label="Truck" value="Truck" />
                    <Picker.Item label="Tractor" value="Tractor" />
                    <Picker.Item label="Cement Mixer" value="Cement Mixer" />
                    <Picker.Item label="Fire Engine" value="Fire Engine" />
                    <Picker.Item label="Transport Van" value="Transport Van" />
                    <Picker.Item label="Bulldozer" value="Bulldozer" />
                    <Picker.Item label="Roller Machine" value="Roller Machine" />
                    {/* Add more vehicle types as needed */}
                  </Picker>
                  <TextInput
                  style={styles.vehicleinput}
                    value={vehicle.Vehicle_Number}
                    onChangeText={(text) => handleTextChange(index, 'Vehicle_Number', text)}
                  />
                  <TouchableOpacity onPress={() => handleRemoveVehicle(index)}>
                    <Image source={require('../assets/delete.png')} style={styles.removeButton}/>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addvehicle} onPress={handleAddVehicle}>
                <Image
                  source={require('../assets/add.png')}
                  style={{ width: 15, height: 15 }}
                />
                <Text style={{ color: "black", fontSize: 15 }}>Add New</Text>
              </TouchableOpacity>
            </View>
          </View>
          {selectedSG === 'Group' ? (
            <View>
              <View style={styles.namecontainer}>
                <Text style={styles.label}>
                  Number of Men <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.phoneInputContainer, { paddingLeft: 15 }]}
                  keyboardType="numeric"
                  value={men}
                  onChangeText={setMen}
                  selectionColor="#B21E2B"
                />
              </View>

              <View style={styles.namecontainer}>
                <Text style={styles.label}>
                  Number of Women <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.phoneInputContainer, { paddingLeft: 15 }]}
                  keyboardType="numeric"
                  value={women}
                  onChangeText={setWomen}
                  selectionColor="#B21E2B"
                />
              </View>
              <View style={styles.namecontainer}>
                <Text style={styles.label}>
                  Number of Boys <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.phoneInputContainer, { paddingLeft: 15 }]}
                  keyboardType="numeric"
                  value={boys}
                  onChangeText={setBoys}
                  selectionColor="#B21E2B"
                />
              </View>
              <View style={styles.namecontainer}>
                <Text style={styles.label}>
                  Number of Girls <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.phoneInputContainer, { paddingLeft: 15 }]}
                  keyboardType="numeric"
                  value={girls}
                  onChangeText={setGirls}
                  selectionColor="#B21E2B"
                />
              </View>
            </View>
          ) : null}

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReset} style={styles.Cancel}>
              <Text style={styles.buttonText1}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexShrink: 0,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  vehicle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "lightgrey",
    marginHorizontal: 15,
    height: 30,
    borderRadius: 10
  },
  addvehicle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 10
  },
  newvehicle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    borderColor: "#B21E2B",
    borderWidth: 1,
    height: 50,
    marginHorizontal: 20
  },
  picker: {
    flex: 2,
    height: 40,
  },
  vehicleinput:{
    flex: 1,
    height: 40,
  },

  removeButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
    width: 20,
    height: 20
  },
  header: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#1F2024',
    marginBottom: 24,
  },
  namecontainer: {
    flex: 1,
    gap: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  dropdown: {
    height: 48,

    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 7,
    paddingRight: 7,
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginRight: 16,
    gap: 0,
  },
  bottomtext: {
    color: '#71727A',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 11,
    fontStyle: 'normal',
  },

  label: {
    fontSize: 14,

    color: '#2F3036',
    fontWeight: '500',
  },
  phoneInputContainer: {
    height: 50,
    width: '95%',
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    borderWidth: 1.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: '#B21e2B',
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
  textContainer: {
    paddingVertical: 0,
    borderRadius: 10,
    backgroundColor: 'white',
    flex: 1,
    fontSize: 10,
  },
  flagButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  codeText: {
    fontSize: 14,
    color: '#2f3036',
    paddingLeft: 1,
  },

  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    flex: 1,

    fontSize: 16,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    width: '95%',
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },

  HomeorOffice: {
    marginBottom: 15,
  },

  singlrOrgroup: {
    marginBottom: 10,
  },

  uploadText: {
    fontSize: 16,
    color: '#777777',
  },

  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#222',
    height: 40,
    width: '95%',
    paddingLeft: 8,
    fontSize: 15,
    justifyContent: 'center',
    backgroundColor: '#e2e2e2',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    flex: 1,
    borderRadius: 5,
  },
  error: {
    borderColor: 'red',
  },
  singleOptionContainer: {
    flexDirection: 'row', // ensure the circle and text are in a row
    alignItems: 'center', // vertically center align the circle and text
    marginRight: 60, // add space between the buttons
    marginVertical: 10, // add vertical margin for spacing above and below buttons
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#B21E2B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 11,
    backgroundColor: '#B21E2B',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'auto',
  },
});

export default FillByYourSelf;
