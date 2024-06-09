import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME } from "@env"
import UserContext from '../../../context/UserContext';
import { encode } from 'base64-arraybuffer';


export const updateRecord = async (reportName, id, modified_data, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}/${id}`
    console.log(url)
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`
      },
      body: JSON.stringify(modified_data)
    });
    return await response.json();
  }
  catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.');
    else {
      Alert.alert("Error: ", err)
      console.log(err)
    }
  }
}



const ViewDetails = ({ navigation, route }) => {

  const { user } = route.params;

  const [photo, setPhoto] = useState();
  const { accessToken, setL2DeniedDataFetched, setL2ApproveDataFetched, setL2PendingDataFetched } = useContext(UserContext)
  const token = accessToken
  const [loading, setLoading] = useState(true);
  const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Photo/download`

  const getImage = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const buffer = await response.arrayBuffer();
      const base64Image = encode(buffer); // Use the encode function from base64-arraybuffer
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;

      return dataUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const dataUrl = await getImage();
      setPhoto(dataUrl);
      setLoading(false);
    };
    fetchImage();
  }, []);

  const onApprove = async () => {

    const status = user.L2_Approval_Status;

    const updateField = {
      L2_Approval_Status: "APPROVED"
    }

    const updateData = {
      //criteria: `ID==${user.ID}`,
      data: updateField
    }

    const response = await updateRecord('Approval_to_Visitor_Report', user.ID, updateData, accessToken);

    if (response.data) {
      if (status === "PENDING APPROVAL") {
        setL2PendingDataFetched(false)
        setL2ApproveDataFetched(false)
      }
      else if (status === "DENIED") {
        setL2DeniedDataFetched(false)
        setL2ApproveDataFetched(false)
      }
      Alert.alert("Visitor Approved")
      navigation.navigate('L2Approved')
    }
    else {
      Alert.alert("Error: ", response.code)
    }

  }

  const onReject = async () => {

    let status = user.L2_Approval_Status;

    const updateField = {
      L2_Approval_Status: "DENIED"
    }

    const updateData = {
      //criteria: `ID==${user.ID}`,
      data: updateField
    }

    const response = await updateRecord('Approval_to_Visitor_Report', user.ID, updateData, accessToken);
    console.log("Data is deleted: ", response)

    if (response.data) {
      if (status === "PENDING APPROVAL") {
        setL2PendingDataFetched(false)
        setL2DeniedDataFetched(false)
      }
      else if (status === "APPROVED") {
        console.log("visitor is denied")
        setL2DeniedDataFetched(false)
        setL2ApproveDataFetched(false)
      }
      Alert.alert("Visitor Rejected")
      navigation.navigate('L2Denied')
    }
    else {
      Alert.alert("Error: ", response.code)
    }

  }



  console.log("User in View details of L2 : ", user)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EEEEEE" }}>
      {/* <View style={styles.header}>
        <View style={styles.headerContainer}>
          <Text style={styles.headertxt}>Visitor details</Text>
        </View>
      </View> */}
      <ScrollView style={styles.scrollview}>
        {
          user?.L2_Approval_Status === "PENDING APPROVAL" ? (
            <View style={[styles.container, { marginTop: 20 }]}>
              <View style={[styles.left, { width: "50%" }]}>
                <TouchableOpacity style={styles.btnAccept} onPress={onApprove}>
                  <Text style={styles.btntxt}>Approve</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.right}>
                <TouchableOpacity style={styles.btnReject} onPress={onReject}>
                  <Text style={styles.btntxt}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : user?.L2_Approval_Status === "APPROVED" ? (
            <View style={{ width: "100%", padding: 10, marginLeft: "30%" }}>
              <TouchableOpacity style={[styles.btnReject]} onPress={onReject}>
                <Text style={[styles.btntxt]}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : user?.L2_Approval_Status === "DENIED" ? (
            <View style={{ width: "100%", padding: 10, marginLeft: "15%" }}>
              <TouchableOpacity style={styles.btnAccept} onPress={onApprove}>
                <Text style={styles.btntxt}>Approve</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Name</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Name_field.zc_display_value}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Phone</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Phone_Number}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Single or Group Visit</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Single_or_Group_Visit}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Date of Visit</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Date_of_Visit}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Referrer</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Referrer_App_User_lookup.zc_display_value}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Guest Category</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Guest_Category}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Priority</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Priority}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Remarks</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Remarks}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Gender</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Gender}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Photo</Text>
          </View>
          <View style={styles.right}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              photo && <Image source={{ uri: photo }} style={{ width: "98%", height: 200 }} />
            )}
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Referrer</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Referrer_App_User_lookup.Name_field} - </Text>
            <Text style={styles.value}>{user.Referrer_App_User_lookup.Email}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Department</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Department.Department}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Men</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Men}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Women</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Women}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Boys</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Boys}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Boys</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Girls}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Vehicle Information</Text>
          </View>
          <View style={styles.right}>
            {user?.Vehicle_Information?.length > 0 ? (
              user.Vehicle_Information.map((vehicle, index) => (
                <Text key={index}>{vehicle.zc_display_value}</Text>
              ))
            ) : (
              null
            )}
          </View>
        </View>
        <View style={[styles.container, { marginTop: 20, marginBottom: 40 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Is the guest being invited to your Home or Office</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Home_or_Office}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ViewDetails

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "8%",
    backgroundColor: "#752a26",
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headertxt: {
    padding: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "white"
  },
  container: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 0
  },
  left: {
    width: "40%",
  },
  right: {
    width: "60%"
  },
  label: {
    textAlign: "right",
    marginEnd: 20,
    fontSize: 15
  },
  value: {
    marginStart: 10,
    fontSize: 15,
    fontWeight: "800",
    color: "black",
  },
  scrollview: {
    backgroundColor: "#FAFAFA",
    marginVertical: 10,
    marginHorizontal: 10,
    paddingTop: 20,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  btnAccept: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: "20%",
    backgroundColor: "green"
  },
  btnReject: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "red"
  },
  btntxt: {
    fontWeight: "bold",
    fontSize: 20,
    //color: "#752A26"
    color: "#FFF"
  }
})