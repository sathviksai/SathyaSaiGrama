import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useContext } from 'react'
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { updateRecord } from "./VerifyDetails"
import UserContext from '../../../context/UserContext';
import { Alert } from 'react-native';

const EditVerifyDetails = ({ navigation, route }) => {

  const { user } = route.params;

  const [date, setDate] = useState(user.Date_of_Visit)
  const [phone, setPhone] = useState(user.Phone_Number)
  const [isSingleFocus, setIsSingleFocus] = useState(false);
  const [isHomeFocus, setIsHomeFocus] = useState(false);
  const [isCategoryFocus, setIsCategoryFocus] = useState(false);
  const [isPriorityFocus, setIsPriorityFocus] = useState(false);
  const [isHome, setIsHome] = useState(user.Home_or_Office)
  const [isSingle, setIsSingle] = useState(user.Single_or_Group_Visit)
  const [category, setCategory] = useState(user.Guest_Category)
  const [priority, setPriority] = useState(user.Priority)
  const [men, setMen] = useState(user.Number_of_Men)
  const [women, setWomen] = useState(user.Number_of_Women)
  const [boys, setBoys] = useState(user.Number_of_Boys)
  const [girls, setGirls] = useState(user.Number_of_Girls)
  const [remarks, setRemarks] = useState(user.Remarks)
  const [selectedGender, setSelectedGender] = useState(user.Gender);


  const [showModal, setShowModal] = useState(false);
  const gender = ['Male', 'Female'];

  console.log("No of boys initially : ", user)

  const {getAccessToken} = useContext(UserContext)

  const handleDateChange = (selectedDate) => {
    const formattedDate = moment(selectedDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    setDate(formattedDate);
    setShowModal(false);
  };





  const homeOrOffice = [
    { label: 'Home', value: 'Home' },
    { label: 'Office', value: 'Office' },
  ];

  const singleOrGroup = [
    { label: 'Single', value: 'Single' },
    { label: 'Group', value: 'Group' },
  ];

  const guestCategory = [
    { label: "Govt Officials", value: "Govt Officials" },
    { label: "Politician", value: "Politician" },
    { label: "Corporate", value: "Corporate" },
    { label: "Press", value: "Press" },
    { label: "Parent", value: "Parent" },
    { label: "Devotee", value: "Devotee" }
  ]

  const guestPriority = [
    { label: "P1", value: "P1" },
    { label: "P2", value: "P2" },
    { label: "P3", value: "P3" },
  ]



  const today = new Date();

  const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    'YYYY/MM/DD',
  );

  const onSave = async () => {

    if(!remarks){
      setRemarks("")
    }

    let menCount = men;
    let womenCount = women;
    let boysCount = boys;
    let girlsCount = girls;

    if(selectedGender=="Male" && isSingle=="Single"){
      menCount = 1
      womenCount = 0
      boysCount = 0
      girlsCount = 0;
    }else if(selectedGender=="Female" && isSingle=="Single"){
      menCount = 0
      womenCount = 1
      boysCount = 0
      girlsCount = 0;
    }

    let people = menCount+womenCount+boysCount+girlsCount;
    console.log("Total people : ", people)

    const updateField = {
      Date_of_Visit: date,
      Gender: selectedGender,
      Home_or_Office: isHome,
      Number_of_Boys	:	boysCount,
      Number_of_Girls	:	girlsCount,
      Number_of_Men	:	menCount,
      Number_of_People	:	people,
      Number_of_Women	:	womenCount,
      Priority: priority,
      Remarks: remarks,
      Single_or_Group_Visit	:	isSingle,
      Guest_Category: category,	
    }

    const updateData = {
      criteria: `ID==${user.ID}`,
      data: updateField
    }

    console.log("saved details : ", updateField)
    const response = await updateRecord('Approval_to_Visitor_Report', updateData, getAccessToken());

    if(response.result[0].code === 3000){
      Alert.alert("Edit Successful")
      const newUser = {...user, ...updateData}
      console.log("New user data is:", newUser)
      navigation.navigate('VerifyDetails', {user: {...user, ...updateField}})
    }
    else{
      Alert.alert("Error: ", response.code)
    }
  }

  const onCancel = () => {
    navigation.navigate("VerifyDetails", {user: user})
  }

  console.log("User in verify details : ", user)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headertxt}>Edit visitor details</Text>
      </View>
      <ScrollView style={{ height: "92%s" }}>

        <View style={styles.v}>
          <Text style={[styles.txt, { marginTop: 20 }]}>Visitor Name</Text>
          <TextInput style={styles.inputtxt} value={user.Name_field.zc_display_value} editable={false} />
        </View>
        <View style={styles.v}>
          <Text style={styles.txt}>Phone</Text>
          <TextInput
            style={styles.inputtxt}
            value={phone}
            editable={false}
          />
        </View>

        <View style={styles.v}>
          <Text style={styles.txt}>Date of visit</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <TextInput style={[styles.inputtxt, { color: "black" }]} value={date} editable={false} />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={() => { }}>
                  <View style={styles.modalContent}>
                    <DatePicker
                      mode="calendar"
                      onSelectedChange={handleDateChange}
                      minimumDate={startDate}
                      options={{
                        backgroundColor: '#fff',
                        textHeaderColor: '#333',
                        textDefaultColor: '#333',
                        selectedTextColor: '#fff',
                        mainColor: '#F4722B',
                        textSecondaryColor: '#999',
                        borderColor: '#ccc',
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <View style={styles.v}>
        <Text style={styles.txt}>Gender</Text>
        <View style={styles.radioButtonContainer}>
          {gender.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.singleOptionContainer}
              onPress={() => {
                setSelectedGender(option);
              }}
            >
              <View style={styles.outerCircle}>
                {selectedGender === option && <View style={styles.innerCircle} />}
              </View>
              <Text style={{ marginLeft: 10 }}>{option}</Text>
            </TouchableOpacity>
          ))}
          </View>
          </View>

        <View style={styles.v}>
          <Text style={styles.txt}>Single or Group Visit</Text>
          <Dropdown
            style={{ borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, backgroundColor: "#F8F4F0" }}
            data={singleOrGroup}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={isSingle}
            onFocus={() => setIsSingleFocus(true)}
            onBlur={() => setIsSingleFocus(false)}
            onChange={item => {
              setIsSingle(item.value);
              setIsSingleFocus(false);
            }} />
        </View>
        {
          isSingle === 'Group' &&
          <View style={{ width: "100%", height: "20%", marginTop: 10 }}>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt}>No. of Men</Text>
              </View>
              <View style={styles.right}>
                <TextInput style={styles.num} value={men} onChangeText={txt => setMen(Number(txt))} />
              </View>
            </View>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt} >No. of Women</Text>
              </View>
              <View style={styles.right}>
                <TextInput style={styles.num} value={women} onChangeText={txt => setWomen(Number(txt))} />
              </View>
            </View>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt} >No. of Boys</Text>
              </View>
              <View style={styles.right}>
                <TextInput style={styles.num} value={boys} onChangeText={txt => setBoys(Number(txt))} />
              </View>
            </View>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt}>No. of Girls</Text>
              </View>
              <View style={styles.right}>
                <TextInput style={styles.num} value={girls} onChangeText={txt => setGirls(Number(txt))} />
              </View>
            </View>
          </View>

        }


        <View style={styles.v}>
          <Text style={styles.txt}>Is the guest being invited to your Home or Office</Text>
          <Dropdown
            style={{ borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, backgroundColor: "#F8F4F0" }}
            data={homeOrOffice}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={isHome}
            onFocus={() => setIsHomeFocus(true)}
            onBlur={() => setIsHomeFocus(false)}
            onChange={item => {
              setIsHome(item.value);
              setIsHomeFocus(false);
            }} />
        </View>

        <View style={styles.v}>
          <Text style={styles.txt}>Guest Category</Text>
          <Dropdown
            style={{ borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, backgroundColor: "#F8F4F0" }}
            data={guestCategory}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isCategoryFocus ? 'Select Category' : '...'}
            value={category}
            onFocus={() => setIsCategoryFocus(true)}
            onBlur={() => setIsCategoryFocus(false)}
            onChange={item => {
              setCategory(item.value);
              setIsCategoryFocus(false);
            }} />
        </View>
        <View style={styles.v}>
          <Text style={styles.txt}>Priority</Text>
          <Dropdown
            style={{ borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, backgroundColor: "#F8F4F0" }}
            data={guestPriority}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={priority}
            onFocus={() => setIsPriorityFocus(true)}
            onBlur={() => setIsPriorityFocus(false)}
            placeholder={!isPriorityFocus ? 'Select priority' : ''}
            onChange={item => {
              setPriority(item.value);
              setIsPriorityFocus(false);
            }} />
        </View>
        <View style={styles.v}>
          <Text style={styles.txt}>Remark</Text>
          <TextInput style={{ height: 100, borderWidth: 1, borderColor: 'black', borderRadius: 6, padding: 10 }} multiline={true} value={remarks} onChangeText={txt => setRemarks(txt)} />
        </View>

        <View style={styles.btnRoot}>
          <TouchableOpacity style={styles.save} onPress={onSave}>
            <View style={styles.btn}>
              <Text style={styles.btnsave}>Save</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onCancel}>
            <View style={styles.btn}>
              <Text style={styles.btncancel}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditVerifyDetails

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "30",
    backgroundColor: "#752a26",
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 10,
  },
  headertxt: {
    padding: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "white"
  },
  inputtxt: {
    height: 38,
    marginTop: 5,
    backgroundColor: "#F8F4F0",
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    paddingLeft: 10
  },
  v: {
    marginLeft: 20,
    marginBottom: 10,
    marginRight: 20
  },
  txt: {
    fontSize: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  save: {
    marginRight: 10
  },
  cancel: {
    marginLeft: 10
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnsave: {
    borderWidth: 1,
    width: 90,
    height: 40,
    textAlign: "center",
    paddingTop: 5,
    borderRadius: 8,
    fontSize: 20,
    marginBottom: 20,
    backgroundColor: "#006A4E",
    color: "white"

  },
  btncancel: {
    borderWidth: 1,
    width: 90,
    height: 40,
    textAlign: "center",
    paddingTop: 5,
    borderRadius: 8,
    fontSize: 20,
    marginBottom: 20,
    backgroundColor: "#752a26",
    color: "white"

  },
  single: {
    flexDirection: "row",
    marginHorizontal: 25,
  },
  left: {
    width: "60%"
  },
  right: {
    width: "40%"
  },
  num: {
    borderWidth: 1,
    backgroundColor: "#F8F4F0",
    borderColor: 'black',
    borderRadius: 6,
    paddingLeft: 10,
    marginVertical: 5,
    height: 35
  },
  singleTxt: {
    fontSize: 20,
    marginVertical: 5
  },

  btnRoot: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 80
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


})