import React, { useContext, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Dimensions, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Dropdown } from 'react-native-element-dropdown';
import { countryCodes } from '../assets/data/countryCodes';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import moment from 'moment';
import filterIcon from "../assets/filter.png"
import UserContext from '../../context/UserContext';
import { ScrollView } from 'react-native';

const Filter = ({ setFilteredData, ToFilterData, comingFrom }) => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').height))[0];
  const [idx, setIdx] = useState(null);
  const [showFilterCount, setShowFilterCount] = useState(false);
  const [filterCount, setFilterCount] = useState(0)

  const { loggedUser } = useContext(UserContext);

  const filterValues = [
    ["Govt Officials", "Press", "Politician", "Corporate", " Parent", "Devotee", "Intern", "Guest", "Staff", "Student", "Other"],
    ["P1", "P2", "P3"],
    ["Home", "Office"],
    ["Male", "Female"],
    ["Single", "Group"],
    ["PENDING APPROVAL", "APPROVED", "DENIED"],
    ["Pre-Approval", "Spot"]
  ];

  const displayFilterCategory = ["Guest Category", "Priority", "Home or Office", "Gender", "Single or Group", "L2 Approval Status", "Registration Type"];
  const filterCategory = ["Guest_Category", "Priority", "Home_or_Office", "Gender", "Single_or_Group_Visit", "L2_Approval_Status", "Registration_Type"];


  const [name, setName] = useState(null)
  const [referrer, setReferrer] = useState(null)
  const [phone, setPhone] = useState(null)
  const [countryCode, setCountryCode] = useState("+91")
  const [date, setDate] = useState("Select Date");
  const [showDateModal, setShowDateModal] = useState(false);

  const openModal = () => {
    setFilterModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    // setFilters({})
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFilterModalVisible(false));
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const [filters, setFilters] = useState({});
  const isSelected = (category) => selectedCategory === category;
  const isValueSelected = (idx, value) => filters[filterCategory[idx]] === value;


  const setValues = (idx, value) => {
    setFilters(prevFilters => {
      const currentFilterValue = prevFilters[filterCategory[idx]];

      // If the selected value is already in filters, remove it (deselect)
      if (currentFilterValue === value) {
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[filterCategory[idx]]; // Remove the filter
        return updatedFilters;
      }

      // Otherwise, select the value
      return {
        ...prevFilters,
        [filterCategory[idx]]: value
      };
    });
  };



  const onApply = () => {
    if (filters && ToFilterData) {
      const res = ToFilterData.filter(item => {
        // Match each key from the filter object
        for (const key in filters) {
          // Special case: Name_field (nested object comparison)
          if (key === 'Name_field') {
            const fullName = `${item.Name_field.first_name} ${item.Name_field.last_name}`;
            if (!fullName.toLowerCase().includes(filters[key].toLowerCase())) {
              return false;
            }
          }
          //Special Case: Referrer
          else if (key === 'Referrer_App_User_lookup') {
            const referrerName = item.Referrer_App_User_lookup.Name_field;
            if (!referrerName.toLowerCase().includes(filters[key].toLowerCase())) {
              return false;
            }
          }
          // Special case: Phone_Number (simple string contains)
          else if (key === 'Phone_Number') {
            const phoneNumber = item.Phone_Number.substring(countryCode.length);
            if (item.Phone_Number.substring(0, countryCode.length) !== countryCode || !phoneNumber.includes(filters[key])) {
              return false;
            }
          }
          // Default case: Direct property match
          else if (item[key] !== filters[key]) {
            return false;
          }
        }
        return true;
      });

      // Check if any data is filtered, if not, set it to an empty array and show "No Visitor Founds"
      if (res.length === 0) {
        setFilteredData([]);  // This will trigger the "No Visitor Founds" message
      } else {
        setFilteredData(res);
      }
      setFilterCount(Object.keys(filters).length);
      setShowFilterCount(true);
    }

    closeModal();
  };

  const onClear = () => {
    setFilteredData(ToFilterData);
    setFilters({})
    setName(null)
    setPhone(null)
    setCountryCode("+91")
    setDate("Select Date")
    setFilterCount(0)
    setShowFilterCount(false);
    closeModal();
  }

  const onNameChange = (txt) => {
    setName(txt);
    filters["Name_field"] = txt;
    if (txt == "") {
      delete filters.Name_field
    }
  }

  const onReferrerChange = (txt) => {
    setReferrer(txt);
    filters["Referrer_App_User_lookup"] = txt;
    if (txt == "") {
      delete filters.Referrer_App_User_lookup
    }
  }

  const onPhoneChange = (txt) => {
    setPhone(txt);
    filters["Phone"] = txt;
    if (txt == "") {
      delete filters.Phone
    }
  }

  const today = new Date();

  const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    'YYYY/MM/DD',
  );

  const handleDateChange = (selectedDate) => {
    const formattedDate = moment(selectedDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    setDate(formattedDate);  // Set the formatted date to state
    setFilters(prevFilters => ({
      ...prevFilters,
      Date_of_Visit: formattedDate // Update the filters with the new date
    }));
    setShowDateModal(false);
  };

  const isValueSelectedForDot = (category) => {
    return filters[category] !== undefined;
  };

  return (
    <>
      <View style={styles.filterview}>
        <TouchableOpacity style={styles.filterbtn} onPress={openModal}>
          {
            ToFilterData != null && (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.filter}>Filter</Text>
                <Image
                  source={filterIcon} // Replace with your image path
                  style={styles.image}
                />
                {showFilterCount && filterCount > 0 && (
                  <View style={styles.bubble}>
                    <Text style={styles.bubbleText}>
                      {filterCount}
                    </Text>
                  </View>
                )}
              </View>
            )
          }
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={filterModalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Close Modal when clicking outside */}
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                  <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={styles.filtertxt}>Filters({Object.keys(filters).length})</Text>
                      <TouchableOpacity
                        onPress={() => {
                          closeModal()
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#B21E2B", marginEnd: 10 }}>Close</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.filtercontainer}>
                      <View style={styles.filterleft}>
                        <TouchableOpacity
                          style={[styles.category, isSelected('Visitor Name') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Visitor Name')
                            setIdx(null);
                          }}
                        >

                          <Text style={[styles.categoryText, isSelected('Visitor Name') && styles.selectedText]}>Visitor Name</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Name_field') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        {loggedUser.role === 'L2' && (
                          <TouchableOpacity
                            style={[styles.category, isSelected('Referrer') && styles.selectedTab]}
                            onPress={() => {
                              handleCategoryPress('Referrer')
                              setIdx(null);
                            }}
                          >
                            <Text style={[styles.categoryText, isSelected('Referrer') && styles.selectedText]}>Referrer</Text>

                            {/* Dot indicating a selected value for this category */}
                            {isValueSelectedForDot('Referrer') && (
                              <View style={styles.dot} />
                            )}
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={[styles.category, isSelected('Phone') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Phone')
                            setIdx(null);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Phone') && styles.selectedText]}>Phone</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Phone') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        {
                          comingFrom == "Approved" && (
                            <TouchableOpacity
                              style={[styles.category, isSelected('L2 Status') && styles.selectedTab]}
                              onPress={() => {
                                handleCategoryPress('L2 Status')
                                setIdx(5);
                              }}
                            >
                              <Text style={[styles.categoryText, isSelected('L2 Status') && styles.selectedText]}>L2 Approval Status</Text>

                              {/* Dot indicating a selected value for this category */}
                              {isValueSelectedForDot('L2_Approval_Status') && (
                                <View style={styles.dot} />
                              )}
                            </TouchableOpacity>
                          )
                        }

                        <TouchableOpacity
                          style={[styles.category, isSelected('Guest Category') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Guest Category');
                            setIdx(0);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Guest Category') && styles.selectedText]}>Guest Category</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Guest_Category') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.category, isSelected('Priority') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Priority');
                            setIdx(1);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Priority') && styles.selectedText]}>Priority</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Priority') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.category, isSelected('Home or Office') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Home or Office');
                            setIdx(2);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Home or Office') && styles.selectedText]}>Home or Office</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Home_or_Office') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.category, isSelected('Gender') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Gender')
                            setIdx(3);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Gender') && styles.selectedText]}>Gender</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Gender') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.category, isSelected('Single or Group') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Single or Group')
                            setIdx(4);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Single or Group') && styles.selectedText]}>Single or Group</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Single_or_Group_Visit') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.category, isSelected('Registration Type') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Registration_Type')
                            setIdx(6);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Registration Type') && styles.selectedText]}>Registration Type</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Registration_Type') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.category, isSelected('Date of Visit') && styles.selectedTab]}
                          onPress={() => {
                            handleCategoryPress('Date of Visit')
                            setIdx(null);
                          }}
                        >
                          <Text style={[styles.categoryText, isSelected('Date of Visit') && styles.selectedText]}>Date of Visit</Text>

                          {/* Dot indicating a selected value for this category */}
                          {isValueSelectedForDot('Date_of_Visit') && (
                            <View style={styles.dot} />
                          )}
                        </TouchableOpacity>
                      </View>
                      <View style={styles.filterright}>
                        <View >
                          {
                            selectedCategory === "Visitor Name" && <>
                              <Text style={styles.categoryTitle}>Visitor Name</Text>
                              <View style={styles.filterrightsecond}>
                                <TextInput placeholder={selectedCategory} style={styles.txtinput} onChangeText={(txt) => onNameChange(txt)} value={name} />
                              </View>
                            </>
                          }
                          {
                            selectedCategory === "Referrer" && <>
                              <Text style={styles.categoryTitle}>Referrer</Text>
                              <View style={styles.filterrightsecond}>
                                <TextInput placeholder={selectedCategory} style={styles.txtinput} onChangeText={(txt) => onReferrerChange(txt)} value={referrer} />
                              </View>
                            </>
                          }
                          {
                            selectedCategory === "Phone" && <>
                              <Text style={styles.categoryTitle}>Phone Number</Text>
                              <View style={styles.filterrightsecond}>
                                <Text style={{ fontWeight: "700", color: "black" }}>Country Code</Text>
                                <Dropdown
                                  style={styles.dropdown}
                                  data={countryCodes}
                                  labelField="label"
                                  valueField="value"
                                  placeholder="Select Country Code"
                                  value={countryCode}
                                  onChange={item => {
                                    setCountryCode(item.value);
                                  }}
                                />
                                <Text style={{ fontWeight: "700", color: "black" }}>Phone</Text>
                                <TextInput placeholder={selectedCategory} keyboardType='phone-pad' style={styles.txtinput} onChangeText={(txt) => onPhoneChange(txt)} value={phone} />
                              </View>
                            </>
                          }
                          {
                            selectedCategory === "Date of Visit" && <>
                              <Text style={styles.categoryTitle}>Date of visit</Text>
                              <TouchableOpacity onPress={() => setShowDateModal(true)}>
                                <TextInput
                                  style={[styles.inputtxt, { color: 'black' }]}
                                  value={date}
                                  editable={false}
                                />
                              </TouchableOpacity>
                              <Modal
                                animationType="slide"
                                transparent={true}
                                visible={showDateModal}
                                onRequestClose={() => setShowDateModal(false)}>
                                <TouchableWithoutFeedback onPress={() => setShowDateModal(false)}>
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
                            </>
                          }
                          {idx !== null && <Text style={styles.categoryTitle}>{displayFilterCategory[idx]}</Text>}
                        </View>
                        <View style={styles.filterrightsecond}>
                          {
                            idx !== null && (
                              filterValues[idx].map((value, i) => {
                                return (
                                  <TouchableOpacity
                                    key={i}
                                    onPress={() => setValues(idx, value)}
                                    style={[
                                      styles.filterOptions,
                                      isValueSelected(idx, value) && styles.selectedTabValue
                                    ]}
                                  >
                                    <Text style={isValueSelected(idx, value) && styles.selectedTextValue}>{value == "PENDING APPROVAL" ? "PENDING" : value}</Text>
                                  </TouchableOpacity>
                                );
                              })
                            )
                          }

                        </View>
                      </View>
                    </View>
                    <View style={styles.btns}>
                      <TouchableOpacity
                        onPress={onApply}
                        style={styles.submit}>
                        <Text style={styles.buttonText}>Apply</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={onClear}
                        style={styles.Cancel}>
                        <Text style={styles.buttonText1}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: '#B21E2B',
    borderWidth: 1,
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  image: {
    width: 19,
    height: 19,
    fontWeight: "bold",
    tintColor: '#B21E2B', // Changes the color of the image
    marginTop: 3,
    marginStart: 2
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFBE65',
    borderRadius: 4,
    marginLeft: 8,
  },
  bubble: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filtertxt: {
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'grey',
    marginBottom: 6
  },
  inputtxt: {
    height: 48,
    marginTop: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#B21E2B',
    borderRadius: 6,
    paddingLeft: 10,
    fontSize: 16,
  },
  selectedCode: {
    marginTop: 20,
    fontSize: 16,
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    width: '100%',
    padding: 20,
  },
  filterview: {
    height: 30,
    display: 'flex',
  },
  filterbtn: {
    alignSelf: 'flex-end',
    marginVertical: 2,
    marginEnd: 25,
  },
  filter: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    color: '#B21E2B',
  },
  filtercontainer: {
    flexDirection: 'row',
    gap: 30,
  },
  filterleft: {
    borderRightWidth: 0.1,
    backgroundColor: "#F5F5F5",
    marginLeft: 0
  },
  filterright: {
    flex: 1,
    paddingTop: 20
  },
  filterrightsecond: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
    width: '100%',
  },
  category: {
    padding: 15,
    flexDirection: 'row'
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
  },
  selectedText: {
    color: '#FFFF',
    fontWeight: 'bold',
  },
  selectedTab: {
    backgroundColor: "#B21E2B"
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B21E2B',
    marginBottom: 20
  },
  filterOptions: {
    backgroundColor: "#F5F5F5",
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  txtinput: {
    borderWidth: 1,
    width: "100%",
    paddingStart: 10,
    borderRadius: 10,
    borderColor: "#B21E2B"
  },
  selectedTabValue: {
    borderWidth: 2,
    borderColor: '#B21E2B'
  },
  selectedTextValue: {
    color: 'black',
    fontWeight: '700'
  },
  btns: {
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
});

export default Filter;
