import React, {useState, useContext, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import {getToday, getFormatedDate} from 'react-native-modern-datepicker';
import PhoneInput, {isValidNumber} from 'react-native-phone-number-input';
import UserContext from '../../context/UserContext';
import {Dropdown} from 'react-native-element-dropdown';
import {BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME} from '@env';
import moment from 'moment';

const FillByYourSelf = () => {
  const [prefix, setPrefix] = useState('Prefix');
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
  const [phoneError, setPhoneError] = useState('');
  const phoneInput = useRef(null);

  const handleChange = (text) => {
    return (
      phoneInput.current?.isValidNumber(value) && phoneInput.current !== null
    );
  };
  const {getAccessToken, L1ID} = useContext(UserContext);
  const [date, setDate] = useState('Select Date');
  const [showModal, setShowModal] = useState(false);

  const today = new Date();

  const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    'YYYY/MM/DD',
  );

  const options = ['Male', 'Female'];
  const singleorgroup = ['Single', 'Group'];
  const homeoroffice = ['Home', 'Office'];

  const handleDateChange = (selectedDate) => {
    const formatteddate = moment(selectedDate, 'YYYY-MM-DD').format(
      'DD-MMM-YYYY',
    );
    setDate(formatteddate);
    setShowModal(!showModal);
  };

  const prefixValues = [
    {label: 'Mr.', value: '1'},
    {label: 'Mrs.', value: '2'},
    {label: 'Ms.', value: '3'},
    {label: 'Dr.', value: '4'},
    {label: 'Prof.', value: '5'},
    {label: 'Rtn.', value: '6'},
    {label: 'Sri', value: '7'},
    {label: 'Smt.', value: '8'},
  ];

  const getEmpId = async () => {
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_Employees?criteria=App_User_lookup==${L1ID}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
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

  const posttoL1aprroved = async (DepartmentID) => {
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

        Date_of_Visit: date,
        Gender: selectedGender,

        Number_of_Men: men,
        Number_of_Boys: boys,
        Number_of_Women: women,
        Number_of_Girls: girls,
        Home_or_Office: selectedHO,
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

      return res;
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };
  const validateName = () => {
    if (prefix == 'Prefix') {
      Alert.alert('Please Select Prefix ');

      return false;
    }
    if (!firstName.trim() || !lastName.trim() || !prefix.trim) {
      Alert.alert('Please enter prefix, Firstname and LastName');
      return false;
    }
    return true;
  };
  const validatePhone = () => {
    if (formattedValue === '') {
      Alert.alert('Enter the Phone Number');
      return false;
    }
    return true;
  };
  const validateGender = () => {
    if (selectedGender == '') {
      Alert.alert('Select Gender');
      return false;
    } else if (selectedGender == 'Male') {
      setMen(1);
      return true;
    } else if (selectedGender == 'Female') {
      setWomen(1);
      return true;
    }
  };
  const validateSOrG = () => {
    if (selectedSG == '') {
      Alert.alert('Select Single or Group Visit');
      return false;
    } else if (selectedSG == 'Single') {
      return validateGender() && validateTotalPeople();
    } else if (selectedSG == 'Group') {
      return validateTotalPeople();
    }
    return true;
  };

  const validateHO = () => {
    if (selectedHO == '') {
      Alert.alert('Select Home or Office Visit');
      return false;
    }
    return true;
  };
  const validateTotalPeople = () => {
    if (men + women + boys + girls > 0) {
      return true;
    }
    return false;
  };

  const validateForm = () => {
    if (validateName() && validatePhone() && validateSOrG() && validateHO()) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const empId = await getEmpId();
      console.log("Employee id:", empId)
      try {
        const rese = await posttoL1aprroved(empId.data[0].Office_lookup.ID);
        console.log(rese);
      } catch (err) {
        Alert.alert(err);
      }
      navigation.navigate('Invite');
      // Add form submission logic here
    }
  };

  const handleReset = () => {
    setBoys('0');
    setWomen('0');
    setMen('0');
    setGirls('0');
    setPrefix('Prefix');
    setDate(startDate);
    setSelectedGender('');
    setSelectedHO('');
    setSelectedSG('');
    setLastName('');
    setFirstName('');
    setValue('');
    phoneInput.current.setState({number: ''});
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (/^\+91\d{10}$/.test(formattedValue)) {
        setPhoneError('');
      } else {
        setPhoneError(
          'Phone number must be 10 digits and it must not contain non-numeric character',
        );
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', paddingBottom: 20}}>
        <Text style={{color: '#752A26', fontSize: 20, fontWeight: '900'}}>
          Visitor Information Form
        </Text>
      </View>
      <View style={styles.name}>
        <Text style={styles.label}>
          Name <Text style={styles.required}>*</Text>:
        </Text>
        <View style={styles.row}>
          <View style={{borderColor: '#222'}}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={{
                flex: 1,
                justifyContent: 'center',
                paddingLeft: 10,
                color: '#222',
              }}
              selectedTextStyle={styles.selectedTextStyle}
              data={prefixValues}
              labelField="label"
              valueField="value"
              value={prefix}
              onChange={item => {
                setPrefix(item.label);
              }}
              placeholder={prefix}
            />
          </View>
          <TextInput
            style={[
              styles.input,
              isSubmitted && !firstName.trim() ? styles.error : null,
            ]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            style={[styles.input]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
        </View>
      </View>
      <View style={styles.date}>
        <Text style={styles.label}>
          Date of Visit <Text style={styles.required}>*</Text>:
        </Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <TextInput style={styles.input} value={date} editable={false} />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DatePicker
                mode="calendar"
                minimumDate={startDate}
                onSelectedChange={handleDateChange}
                options={{
                  backgroundColor: '#fff',
                  textHeaderColor: '#333',
                  textDefaultColor: '#333',
                  selectedTextColor: '#fff',
                  mainColor: '#F4725B',
                  textSecondaryColor: '#999',
                  borderColor: '#ccc',
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <Text style={styles.label}>
          Phone <Text style={styles.required}>*</Text>:
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
            setPhoneError('');
          }}
          onChangeFormattedText={text => {
            setFormattedValue(text);
            setCountryCode(phoneInput.current?.getCountryCode());
          }}
          countryPickerProps={{withAlphaFilter: true}}
          disabled={disabled}
          withDarkTheme
          withShadow
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
      </View>

      {/* {!handleChange() && value != '' ? (
        <View>
          <Text style={{color: 'red'}}>Please enter valid number</Text>
        </View>
      ) : null} */}
      <View>
        <Text style={styles.label}>
          Single or Group Visit <Text style={styles.required}>*</Text>:
        </Text>
        <View style={styles.radioButtonContainer}>
          {singleorgroup.map(optionss => {
            return (
              <TouchableOpacity
                key={optionss}
                style={styles.singleOptionContainer}
                onPress={() => setSelectedSG(optionss)}>
                <View style={styles.outerCircle}>
                  {selectedSG === optionss ? (
                    <View style={styles.innerCircle} />
                  ) : null}
                </View>
                <Text style={{marginLeft: 10}}>{optionss}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View>
        <Text style={styles.label}>
          Is the Guest being invited to Home or Office
          <Text style={styles.required}>*</Text>:
        </Text>
        <View style={styles.radioButtonContainer}>
          {homeoroffice.map(option => {
            return (
              <TouchableOpacity
                key={option}
                style={styles.singleOptionContainer}
                onPress={() => setSelectedHO(option)}>
                <View style={styles.outerCircle}>
                  {selectedHO === option ? (
                    <View style={styles.innerCircle} />
                  ) : null}
                </View>
                <Text style={{marginLeft: 10}}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View>
        <Text style={styles.label}>
          Select Gender <Text style={styles.required}>*</Text>:
        </Text>
        <View style={styles.radioButtonContainer}>
          {options.map(option => {
            return (
              <TouchableOpacity
                key={option}
                style={styles.singleOptionContainer}
                onPress={() => setSelectedGender(option)}>
                <View style={styles.outerCircle}>
                  {selectedGender === option ? (
                    <View style={styles.innerCircle} />
                  ) : null}
                </View>
                <Text style={{marginLeft: 10}}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {selectedSG === 'Group' ? (
        <View>
          <Text style={styles.label}>
            Nuumber of Men <Text style={styles.required}>*</Text>:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={men}
            onChangeText={setMen}
          />

          <Text style={styles.label}>
            Nuumber of Women <Text style={styles.required}>*</Text>:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={women}
            onChangeText={setWomen}
          />
          <Text style={styles.label}>
            Nuumber of Boys <Text style={styles.required}>*</Text>:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={boys}
            onChangeText={setBoys}
          />
          <Text style={styles.label}>
            Nuumber of Girls <Text style={styles.required}>*</Text>:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={girls}
            onChangeText={setGirls}
          />
        </View>
      ) : null}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.Reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#752A26',
    fontWeight: '600',
  },
  phoneInputContainer: {
    width: '90%',
    height: 50,
    marginBottom: 8, // Adjusted margin to make space for error message
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#ece2e2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'center',
  },
  textContainer: {
    paddingVertical: 0,
    borderRadius: 10,
    backgroundColor: '#e2e2e2',
    flex: 1,
  },
  flagButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e2e2',
    marginLeft: 10,
  },
  codeText: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 1,
  },
  icon: {
    marginRight: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdown: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#222',
    marginRight: 10,
    backgroundColor: '#e2e2e2',
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
  required: {
    color: 'red',
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
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#e2e2e2',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    flex: 1,
    borderRadius: 5,
  },
  error: {
    borderColor: 'red',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    backgroundColor: '#752A26',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    paddingTop: 30,
    alignItems: 'center',
  },
  headertext: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#ffefd9',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  name: {
    marginBottom: 8,
  },
  date: {marginBottom: 12},
  phones: {
    marginBottom: 10,
  },
  Reset: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    marginLeft: 10,
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
  radioButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'auto',
  },
});

export default FillByYourSelf;
