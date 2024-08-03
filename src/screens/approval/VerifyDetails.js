import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME} from '@env';

import UserContext from '../../../context/UserContext';
import {encode} from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import {captureRef} from 'react-native-view-shot';
import 'react-native-get-random-values';
import { BackgroundImage } from 'react-native-elements/dist/config';


export const updateRecord = async (reportName, modified_data, token, id) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}/${id}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      body: JSON.stringify(modified_data),
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

const VerifyDetails = ({ navigation, route}) => {

  const { user } = route.params;

  const [photo, setPhoto] = useState();
  const { getAccessToken, setDeniedDataFetched, setApproveDataFetched, setPendingDataFetched, setEditData, loggedUser, accessToken } = useContext(UserContext)
  const token = accessToken
  setEditData(user);
  const [loading, setLoading] = useState(true);
  const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Photo/download`
  const viewRef = useRef();
  const [code, setCode] = useState('');
  const codeGenrator = () => {
      const newCode =  Math.floor(100000 + Math.random() * (999999 - 100001 + 1)).toString();
      setCode(newCode);
  };

  console.log("Screen Height:", height);

  
  const PasscodeUrl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Passcode`
  
      const payload =  {
        data: {
            Passcode: code
        }
      }
    
      const PasscodeData = async () => {
        console.log("in PasscodeData function")
      try{
        const passcodeResponse = await fetch(PasscodeUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json',
          }
      });
      const responseData = await passcodeResponse.json();
  
      console.log( "here is the passcode response" + responseData.code)
    
      if(responseData.code === 3002){
        console.log('Post of code was un-sucessfull')
        codeGenrator();
        PasscodeData();
      } else if(responseData.code === 3000){
        console.log('code posted successfully to Zoho.');
        ScreenshotQR();
        
      }
    //   while (responseData.code === 3002){ 
       
       
  
    //     if(!responseData.code === 3002){
    //       ScreenshotQR();
    
    
    //   }
    
    
    
    // }
  
    console.log("Passcode data:" + passcodeResponse);
  }
      catch(error){ 
      console.log(error)
      return false;
    }
    //   while(response.code === 3002){ 
    //     console.log('Post of code was un-sucessfull')
    //      const data = await response.json();
    //      codeGenrator();
    
    // if(!response.code === 3002){
    //   ScreenshotQR();
      
    // }
  
    
     return codeExsits;
  }
    







  const getImage = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
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

  const getQrCodeImage = async () => {
    try {
      const response = await fetch(qrCodeurl, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const buffer = await response.arrayBuffer();
      const base64Image = encode(buffer); // Use the encode function from base64-arraybuffer
      const qrCodeDataUrl = `data:image/jpeg;base64,${base64Image}`;

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const dataUrl = await getImage();
      const qrCodeDataUrl = await getQrCodeImage();
      setPhoto(dataUrl);
      setQrCodephoto(qrCodeDataUrl);
      setLoading(false);
    };
    
    fetchImage();
  }, []);

  const onApprove = async () => {
    let status = user.Referrer_Approval;

    let updateField;

    if (loggedUser.role === 'L2') {
      updateField = {
        Referrer_Approval: "APPROVED",
        L2_Approval_Status: "APPROVED"
      }
      PasscodeData();

     
      
    } else {
      updateField = {
        Referrer_Approval: 'APPROVED',
      };
    }

    const updateData = {
      data: updateField,
    };

    const response = await updateRecord(
      'Approval_to_Visitor_Report',
      updateData,
      accessToken,
      user.ID,
    );

    if (response.code === 3000) {
      if (status === 'PENDING APPROVAL') {
        setPendingDataFetched(false);
        setApproveDataFetched(false);
      } else if (status === 'DENIED') {
        setDeniedDataFetched(false);
        setApproveDataFetched(false);
      }
      Alert.alert("Visitor Approved")
      navigation.navigate('Approved')
    }
    else {
      Alert.alert("Error: ", response.code)
    }
  };

  const onReject = async () => {
    let status = user.Referrer_Approval;

    if (loggedUser.role === "L2") {
      updateField = {
        Referrer_Approval: "DENIED",
        L2_Approval_Status: "DENIED"
      }
         
    } else {
      updateField = {
        Referrer_Approval: "DENIED"
      }
    }

    const updateData = {
      data: updateField,
    };

    const response = await updateRecord(
      'Approval_to_Visitor_Report',
      updateData,
      accessToken,
      user.ID,
    );
    console.log('response in reject', response);

    if (response.code === 3000) {
      if (status === 'PENDING APPROVAL') {
        setPendingDataFetched(false);
        setDeniedDataFetched(false);
      } else if (status === 'APPROVED') {
        setDeniedDataFetched(false);
        setApproveDataFetched(false);
      }
      Alert.alert('Visitor Rejected');
      navigation.navigate('Denied');
    } else {
      Alert.alert('Error: ', response.code);
    }
  };

  const onShare = async () => {
    
    try {
      const { Generated_QR_Code } = user;

      // // Define the path to download the image
      // const path = `${RNFS.DocumentDirectoryPath}/image.jpg`;

      // // Download the image to local storage
      // await RNFS.downloadFile({
      //   from: QrCodephoto,
      //   toFile: path,
      // }).promise;

      // Share the image

      
      await Share.open({
        url:  `file://${path}`,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // console.log("Screen Height:", height);

  // let heightStyles;
  // if(height > 900){
  //     heightStyles = normalScreen;
  // } else if(height>750){  heightStyles = mediumScreen;}
  // else{ heightStyles = smallScreen;}

const ScreenshotQR = async () => {
try{
console.log('capturing view.......')
const uri = await captureRef(viewRef, {
format:'png',
quality:0.8,

});

      console.log('view captured Uri:', uri);

      // if (!uri){throw new Error('failed to capture, uri is undefined or null');
      // }

      let base64Data = '';
      if (uri.startsWith('data:image/png;base64,')) {
        base64Data = uri.split('data:image/png;base64,')[1];
      } else if (uri.startsWith('file://')) {
        base64Data = await RNFS.readFile(uri, 'base64');
      } else {
        throw new Error(`Unexpected URI format: ${uri}`);
      }

      console.log('extracted base 64 data:', base64Data.length);

      if (!base64Data) {
        throw new Error('failed to extract base64 Data from URI');
      }

      const postData = new FormData();
      postData.append('file', {
        uri: `data:image/png;base64, ${base64Data}`,
        name: 'qrcode.png',
        type: 'image/png',
      });

const payload =  {
data: {
    Generated_Passcode: code
}
}

const url1 = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}`
console.log(url1);
const response1 = await fetch(url1,{
method:'PATCH',
body: JSON.stringify(payload),
headers:{
Authorization: `Zoho-oauthtoken ${accessToken}`,
'Content-Type': 'application/json',



},
}, console.log('posting to zoho....'));
if (response1.ok) {
console.log('code posted successfully to Zoho.');
console.log("response",response1);
} else {
console.log('Failed to post code to Zoho:', response1.status, response1.statusText, response1.ok);

};




const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Generated_QR_Code/upload`
console.log(url);
const response = await fetch(url,{
method:'POST',
body: postData,
headers:{
Authorization: `Zoho-oauthtoken ${accessToken}`,
'Content-Type': 'multipart/form-data',


},
}, console.log('posting to zoho....'));

      if (response.ok) {
        console.log('Image uploaded successfully to Zoho.');
      } else {
        console.log(
          'Failed to upload image to Zoho:',
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error('Error capturing and uploading QR code:', error);
    }
  };













useEffect(()=>{
    codeGenrator();
}, []);
























  console.log('User in verify details : ', user);
  return (
    <><SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", zIndex:1 }}>
      {/* <View style={styles.header}>
      <View style={styles.headerContainer}>
        <Text style={styles.headertxt}>Visitor details</Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditVerifydetails", { user: user })} style={{ width: 40, height: 40, padding: 10, marginEnd: 20 }}>
          <Image
            source={edit}
            style={{ width: 40, height: 40, }}
          />
        </TouchableOpacity>
      </View>
    </View> */}
      <ScrollView style={styles.scrollview}>
        {user?.Referrer_Approval === "PENDING APPROVAL" ? (
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
        ) : user?.Referrer_Approval === 'APPROVED' ? (
          <View style={{width: '100%', padding: 10, marginLeft: '30%'}}>
            <TouchableOpacity style={[styles.btnReject]} onPress={onReject}>
              <Text style={[styles.btntxt]}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : user?.Referrer_Approval === 'DENIED' ? (
          <View style={{width: '100%', padding: 10, marginLeft: '15%'}}>
            <TouchableOpacity style={styles.btnAccept} onPress={onApprove}>
              <Text style={styles.btntxt}>Approve</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[styles.container, { marginTop: 20 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>Name</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Name_field.zc_display_value}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Phone</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Phone_Number}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Single or Group Visit</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Single_or_Group_Visit}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Date of Visit</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Date_of_Visit}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Guest Category</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Guest_Category}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Priority</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Priority}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Remarks</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Remarks}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Gender</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Gender}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Photo</Text>
          </View>
          <View style={styles.right}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              photo && (
                <Image
                  source={{uri: photo}}
                  style={{width: '98%', height: 200}}
                />
              )
            )}
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Referrer</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>
              {user.Referrer_App_User_lookup.Name_field} -{' '}
            </Text>
            <Text style={styles.value}>
              {user.Referrer_App_User_lookup.Email}
            </Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Department</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Department.Department}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Men</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Men}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Women</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Women}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Boys</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Boys}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Number of Boys</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Number_of_Girls}</Text>
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>Vehicle Information</Text>
          </View>

          <View style={styles.right}>
            {user?.Vehicle_Information?.length > 0
              ? user.Vehicle_Information.map((vehicle, index) => (
                  <Text key={index}>{vehicle.zc_display_value}</Text>
                ))
              : null}
          </View>
        </View>
        <View style={[styles.container, {marginTop: 20, marginBottom: 20}]}>
          <View style={styles.left}>
            <Text style={styles.label}>
              Is the guest being invited to your Home or Office
            </Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{user.Home_or_Office}</Text>
          </View>
        </View>
        {user.Referrer_Approval === "APPROVED" && user.L2_Approval_Status == "APPROVED" && user.Referrer_App_User_lookup.ID == loggedUser.userId ? (
          <View style={[styles.container, { marginTop: 20, marginBottom: 20 }]}>
            <View style={styles.left}>
              <Text style={styles.label}>Generated QR Code</Text>
            </View>
            <View style={[styles.right, { justifyContent: "center", alignItems: "center", marginBottom: 20 }]}>
              <Image source={{ uri: user.Generated_QR_Code }} style={{ height: 200, width: 200 }} />
              <TouchableOpacity
                style={[
                  styles.HomeButton,
                  { backgroundColor: 'green' },
                ]}
                onPress={() => {
                  onShare();
                } }>
                <Text style={[styles.wewe, styles.wewe1]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

        ) : null}

      </ScrollView>
    </SafeAreaView><View style={[heightStyles.hidden]}>
        <View ref={viewRef} style={[heightStyles.container]}><View style={{ flex: 1 }}>
          <View style={[heightStyles.qrCodeContainer]}>
          <Text style={[heightStyles.title]}>{user.Referrer_App_User_lookup.Name_field}</Text>
            <Text style={[heightStyles. title2]}>has invited you</Text>
            <Text style={[heightStyles.text]}>Show this QR code or OTP to the guard at the gate</Text>
            {code ? (
              <QRCode value={code} size={160} />
            ) : (<Text>Genrating Qr code....</Text>)}
            <Text style={[heightStyles.middleText]}>---OR---</Text>
            <View style={[heightStyles.codeBackdrop]}>
              <Text style={[heightStyles.code]}>{code}</Text>
              <View style={[heightStyles.BottomtextContainer]}>
                <Text style={[heightStyles.dateOfArrivalText]}>{user.Date_of_Visit}</Text>
                <Text style={[heightStyles.Bottomtext]}>Sri Sathya Sai Grama -</Text>
                <Text style={[heightStyles.Bottomtext]}>Muddenahalli Rd,</Text>
                <Text style={[heightStyles.Bottomtext]}> Karnataka 562103,</Text>
                <View style={{ flex: 1 }}>

                </View>
              </View>
            </View>
            <View style={{ flex: 0.7 }}><ImageBackground style={[heightStyles.BottomImage]} source={require('../../../src/assets/ashramQrScreen.jpg')}>
              <LinearGradient colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']} style={[heightStyles.gradient, heightStyles.topGradient]} /><LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={[heightStyles.gradient, heightStyles.bottomGradient]} /></ImageBackground>

              <ImageBackground style={[heightStyles.BottomLogoImage]} source={require('../../../src/assets/SSG_OWOF.png')}></ImageBackground>


            </View>
          </View>

         
        </View>
        </View>
      </View></>
  )
}

export default VerifyDetails

const mediumScreen = StyleSheet.create({
  hidden:{
 opacity:0,
 position:'absolute',
 zIndex:0,

  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  topGradient: {
    top: 0,
    height: '180%',
  },

  bottomGradient: {
    bottom: 0,
    height: '9%',
    backgroundColor: '#F9ECDF',
  },

  BottomImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 385,
    height: 130, // height as a percentage of screen height
    position: 'absolute',
    bottom: -79,
  },

  BottomLogoImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 145,
    height: 95, // height as a percentage of screen height
    position: 'absolute',
    bottom: -76,
  },

  pageContainer: {
    backgroundColor: 'white',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9ECDF',
    width: 385,
    height: 612,
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    margin: 0,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  title2: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  code: {
    fontSize: 35,
    textAlign: 'center',
    color: 'brown',
  },

  codeBackdrop: {
    marginTop: 12,
    backgroundColor: 'pink',
    borderRadius: 20,
    flexGrow: 0,
    width: 170,
    height: 50,
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6E260E',
    marginBottom: 10,
  },

  middleText: {
    fontSize: 17,
    color: '#6E260E',
    marginTop: 10,
  },

  BottomtextContainer: {
    marginTop: 15,
  },

  Bottomtext: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6E260E',
  },

  dateOfArrivalText: {
    color: '#6E260E',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
  },

  qrCodeContainer: {
    flex: 0.92,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Buttons: {
    marginTop: 100,
  },
});

const smallScreen = StyleSheet.create({
  hidden:{
      opacity:0,
      position:'absolute',
      zIndex:0,
   
   
       },

  topGradient: {
    top: 0,
    height: '180%',
  },

  bottomGradient: {
    bottom: 0,
    height: '9%',
    backgroundColor: '#F9ECDF',
  },

  BottomImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 440,
    height: 90, // height as a percentage of screen height
    position: 'absolute',
    bottom: -35,
  },

  BottomLogoImage: {},

  gradient: {
    ...StyleSheet.absoluteFillObject,
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  pageContainer: {
    backgroundColor: 'white',
  },

  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9ECDF',
    width: 430,
    height: 570,
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    margin: 0,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  title2: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 5,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  code: {
    fontSize: 35,
    textAlign: 'center',
    color: 'brown',
  },

  codeBackdrop: {
    marginTop: 12,
    backgroundColor: 'pink',
    borderRadius: 20,
    flexGrow: 0,
    width: 170,
    height: 50,
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6E260E',
    marginBottom: 10,
  },

  middleText: {
    fontSize: 17,
    color: '#6E260E',
    marginTop: 10,
  },

  BottomtextContainer: {
    marginTop: 15,
  },

  Bottomtext: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6E260E',
  },

  dateOfArrivalText: {
    color: '#6E260E',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
  },

  qrCodeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Buttons: {
    marginTop: 100,
  },
});

const normalScreen = StyleSheet.create({

  hidden:{
      opacity:0,
      position:'absolute',
      zIndex:0,
 
   
       },




  gradient: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  topGradient: {
    top: 0,
    height: '180%',
  },

  bottomGradient: {
    bottom: 0,
    height: '10%',
    backgroundColor: '#F9ECDF',
  },

  pageContainer: {
    backgroundColor: 'white',
  },

  BottomLogoImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 170,
    height: 120, // height as a percentage of screen height
    position: 'absolute',
    bottom: -40,
    alignItems: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9ECDF',
    width: 450,
    height: 780,
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    margin: 0,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  title2: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  code: {
    fontSize: 35,
    textAlign: 'center',
    color: 'brown',
  },

  codeBackdrop: {
    marginTop: 12,
    backgroundColor: 'pink',
    borderRadius: 20,
    flexGrow: 0,
    width: 170,
    height: 50,
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6E260E',
    marginBottom: 10,
  },

  middleText: {
    fontSize: 17,
    color: '#6E260E',
    marginTop: 10,
  },

  BottomtextContainer: {
    marginTop: 19,
  },

  Bottomtext: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6E260E',
  },

  dateOfArrivalText: {
    color: '#6E260E',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
  },

  qrCodeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Buttons: {
    marginTop: 100,
  },

  BottomImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 500,
    height: 200, // height as a percentage of screen height
    position: 'absolute',
    bottom: -78,
  },
});

const styles = StyleSheet.create({
  
  header: {
    width: '100%',
    height: '8%',
    backgroundColor: '#752a26',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headertxt: {
    padding: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 0,
  },
  left: {
    width: '40%',
  },
  right: {
    width: '60%',
  },
  label: {
    textAlign: 'right',
    marginEnd: 20,
    fontSize: 15,
  },
  value: {
    marginStart: 10,
    fontSize: 15,
    fontWeight: '800',
    color: 'black',
  },
  scrollview: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 2, height: 2},
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  btnAccept: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: '20%',
    backgroundColor: 'green',
  },
  btnReject: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'red',
  },
  btntxt: {
    fontWeight: 'bold',
    fontSize: 20,
    //color: "#752A26"
    color: '#FFF',
  },
  HomeButton: {
    height: 30,
    width: 80,
    backgroundColor: '#752A26',
    paddingTop: 8,
    borderRadius: 12,
    marginTop: 20,
    marginLeft: 4,
    marginRight: 4,
  },
  wewe: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
  },
  wewe1: {
    color: '#fff',
  },
  wewe2: {
    color: '#B21E2B',
  },
});
