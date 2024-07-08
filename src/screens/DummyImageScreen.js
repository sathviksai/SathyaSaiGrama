import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Modal,
    Image,
    Share,
    Alert,
    TouchableWithoutFeedback,
    Button,
    Platform,
    PermissionsAndroid,
    ImageBackground,
    Dimensions,
  } from 'react-native';
import { BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME } from "@env"
import { blue } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import 'react-native-get-random-values';
import React, { useState, useEffect, useRef, useContext } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { v4 as uuidv4 } from 'uuid';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import UserContext from '../../context/UserContext';
import 'react-native-get-random-values';
import { BackgroundImage } from 'react-native-elements/dist/config';
import LinearGradient from 'react-native-linear-gradient';


const {height} = Dimensions.get('window')

const DummyImageScreen  = (dateOfVisit) => {

    
    console.log("Screen Height:", height);
    
    let heightStyles;
    if(height > 900){
        heightStyles = styles;
    } else if(height>800){  heightStyles = mediumScreen;}
    else{ heightStyles = smallScreen;}
    const { getAccessToken, userEmail, L1ID, deviceToken, loggedUser, accessToken } = useContext(UserContext);
    const viewRef = useRef();
    const [code, setCode] = useState('');
    const codeGenrator = () => {
        const newCode =  Math.floor(100000 + Math.random() * (999999 - 100001 + 1)).toString();
        setCode(newCode);
    };



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


if (!base64Data){
    throw new Error('failed to extract base64 Data from URI');
} 

const postData = new FormData ();
postData.append( 'file',{

    uri: `data:image/png;base64, ${base64Data}`,
    name: 'qrcode.png',
    type: 'image/png',

});

const payload =  {
    data: {
        Generated_Passcode: code
    }
}

const url1 = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/3318254000029679027`
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
  



const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/3318254000029679027/Generated_QR_Code/upload`
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
    console.log('Failed to upload image to Zoho:', response.status, response.statusText);
  }
} catch (error) {
  console.error('Error capturing and uploading QR code:', error);
}
};







// const path = `${RNFS.DocumentDirectoryPath}/QRCode.png`;
// console.log('Saving image to path:', path);form
// await RNFS.writeFile(path, base64Data, 'base64');
// console.log('image saved');


// await Share.open({
// URL: `file://${path}`,
// type: 'image/png',

// });
// console.log('image shared');







    useEffect(()=>{
        codeGenrator();
    }, []);
    
//  useEffect(()=>{
// if(DummyImageScreen){
//     ScreenshotQR()
// }
//  }, [DummyImageScreen]);
    return (<View style={[heightStyles.hidden]}>
        <View  ref={viewRef} style={[heightStyles.container]}><View  style={{flex:1}} >
        <View style={[heightStyles.qrCodeContainer]}>
        <Text style={[heightStyles.title]}>L1 approver has invited you</Text>
        <Text style={[heightStyles.text]}>Show this QR code or OTP to the guard at the gate</Text>
    {code ? (
<QRCode value={code}  size={160} /> 
    ) : (<Text>Genrating Qr code....</Text>)}
<Text style={[heightStyles.middleText]}>---OR---</Text>
<View style={[heightStyles.codeBackdrop]}>
<Text style={[heightStyles.code]}>{code}</Text> 
<View style={[heightStyles.BottomtextContainer]}>
<Text style={[heightStyles.dateOfArrivalText]}>15-July-2024</Text>
<Text style={[heightStyles.Bottomtext]}>Sri Sathya Sai Grama -</Text>
<Text style={[heightStyles.Bottomtext]}>Muddenahalli Rd,</Text>
<Text style={[heightStyles.Bottomtext]}> Karnataka 562103,</Text>
<View style={{flex:1}}>

</View>
</View>
</View>
<View style={{flex:0.7}}><ImageBackground style={[heightStyles.BottomImage]} source={require('../../src/assets/ashramQrScreen.jpg')}>
    <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.0)']} style={heightStyles.gradient} /></ImageBackground></View>
</View>
    
    {/* <View style={[styles.Buttons]}>
    <Button title="Generate new Qr code"  onPress={codeGenrator}/>
    <Button title="Upload Qr code"  onPress={ScreenshotQR}></Button>
    
    </View> */}
</View>
</View>
</View>);
};



const mediumScreen = StyleSheet.create({
    gradient:{
        ...StyleSheet.absoluteFillObject,
    },

    hidden:{
   opacity:0,
   position:'absolute'


    },





    BottomImage:{

    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf:'center',
    width: 385,
    height: 110, // height as a percentage of screen height
    position: 'absolute',
    bottom: -34,
    
    },
    
    pageContainer:{
        backgroundColor:'white'
    },
    
     container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F9ECDF',
    
    
      
    
    },
    
    title:{
        fontSize:30,
        textAlign: 'center',
        margin:10,
        color:'#6E260E',
        fontWeight:'bold'
    },
    
    code:{
        fontSize:35,
        textAlign:'center',
        color:'brown',
       
    },
    
    codeBackdrop:{
        marginTop:12,
        backgroundColor:'pink',
        borderRadius:20,
        flexGrow:0,
        width:170,
        height:50
        
    
    },
    
    
    text:{
        fontSize:14,
        textAlign:'center',
        color:'#6E260E',
        marginBottom:10
       
    },
    
    middleText:{
    fontSize:17,
    color:'#6E260E',
    marginTop:10
    
    
    },
    
    BottomtextContainer:{
    marginTop:15
    
    
    },
    
    
    Bottomtext:{
        fontSize:10,
        textAlign:'center',
        color:'#6E260E',
        
        },
    
    
    dateOfArrivalText:{
        color:'#6E260E',
        fontWeight:'bold',
       alignSelf:'center',
       fontSize:20,
       
    
    },
    
    qrCodeContainer:{
    flex:1,
        alignItems:'center',
        justifyContent:'center',
        
    },
    
    Buttons:{
        marginTop:100
    },
})


const smallScreen = StyleSheet.create({
    hidden:{
        opacity:100,
        position:'absolute',
   
     
     
         },
    
    BottomImage:{

    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf:'center',
    width: 440,
    height: 110, // height as a percentage of screen height
    position: 'absolute',
    bottom: -34,
    
    
    },

    gradient:{
        ...StyleSheet.absoluteFillObject,
    },
    
    pageContainer:{
        backgroundColor:'white'
    },
    
     container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F9ECDF',
    
    
      
    
    },
    
    title:{
        fontSize:30,
        textAlign: 'center',
        margin:10,
        color:'#6E260E',
        fontWeight:'bold'
    },
    
    code:{
        fontSize:35,
        textAlign:'center',
        color:'brown',
       
    },
    
    codeBackdrop:{
        marginTop:12,
        backgroundColor:'pink',
        borderRadius:20,
        flexGrow:0,
        width:170,
        height:50
        
    
    },
    
    
    text:{
        fontSize:14,
        textAlign:'center',
        color:'#6E260E',
        marginBottom:10
       
    },
    
    middleText:{
    fontSize:17,
    color:'#6E260E',
    marginTop:10
    
    
    },
    
    BottomtextContainer:{
    marginTop:15
    
    
    },
    
    
    Bottomtext:{
        fontSize:10,
        textAlign:'center',
        color:'#6E260E',
        
        },
    
    
    dateOfArrivalText:{
        color:'#6E260E',
        fontWeight:'bold',
       alignSelf:'center',
       fontSize:20,
       
    
    },
    
    qrCodeContainer:{
    flex:1,
        alignItems:'center',
        justifyContent:'center',
        
    },
    
    Buttons:{
        marginTop:100
    },
})



























const styles = StyleSheet.create({

    hidden:{
        opacity:0,
        position:'absolute',
    top: -9999,
    left: -9999,
     
     
         },




    gradient:{
        ...StyleSheet.absoluteFillObject,
    },

pageContainer:{
    backgroundColor:'white'
},

 container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#F9ECDF',


  

},

title:{
    fontSize:30,
    textAlign: 'center',
    margin:10,
    color:'#6E260E',
    fontWeight:'bold'
},

code:{
    fontSize:35,
    textAlign:'center',
    color:'brown',
   
},

codeBackdrop:{
    marginTop:12,
    backgroundColor:'pink',
    borderRadius:20,
    flexGrow:0,
    width:170,
    height:50
    

},


text:{
    fontSize:14,
    textAlign:'center',
    color:'#6E260E',
    marginBottom:10
   
},

middleText:{
fontSize:17,
color:'#6E260E',
marginTop:10


},

BottomtextContainer:{
marginTop:19


},


Bottomtext:{
    fontSize:18,
    textAlign:'center',
    color:'#6E260E',
    
    },


dateOfArrivalText:{
    color:'#6E260E',
    fontWeight:'bold',
   alignSelf:'center',
   fontSize:20,
   

},

qrCodeContainer:{
flex:1,
    alignItems:'center',
    justifyContent:'center',
    
},

Buttons:{
    marginTop:100
},

BottomImage:{

    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf:'center',
    width: 500,
    height: 200, // height as a percentage of screen height
    position: 'absolute',
    bottom: -70,
    



}

});




// const mainStyles = StyleSheet.create({

//     pageContainer:{
//         backgroundColor:'white'
//     },
    
//      container: {
//         flex:1,
//         justifyContent:'center',
//         alignItems:'center',
//         backgroundColor:'#F9ECDF',
    
    
      
    
//     },
    
//     title:{
//         fontSize:30,
//         textAlign: 'center',
//         margin:10,
//         color:'#6E260E',
//         fontWeight:'bold'
//     },
    
//     code:{
//         fontSize:35,
//         textAlign:'center',
//         color:'brown',
       
//     },
    
//     codeBackdrop:{
//         marginTop:12,
//         backgroundColor:'pink',
//         borderRadius:20,
//         flexGrow:0,
//         width:170,
//         height:50
        
    
//     },
    
    
//     text:{
//         fontSize:14,
//         textAlign:'center',
//         color:'#6E260E',
//         marginBottom:10
       
//     },
    
//     middleText:{
//     fontSize:17,
//     color:'#6E260E',
//     marginTop:10
    
    
//     },
    
//     BottomtextContainer:{
//     marginTop:15
    
    
//     },
    
    
//     Bottomtext:{
//         fontSize:10,
//         textAlign:'center',
//         color:'#6E260E',
        
//         },
    
    
//     dateOfArrivalText:{
//         color:'#6E260E',
//         fontWeight:'bold',
//        alignSelf:'center',
//        fontSize:20,
       
    
//     },
    
//     qrCodeContainer:{
//     flex:1,
//         alignItems:'center',
//         justifyContent:'center',
        
//     },
    
//     Buttons:{
//         marginTop:100
//     },
    
//     BottomImage:{
    
//         flex: 1,
//         position: 'relative',
//         justifyContent: 'flex-end',
//         alignSelf:'center',
//         width: 500,
//         height: 200, // height as a percentage of screen height
//         position: 'absolute',
//         bottom: -198,
        
    
    
    
//     }
    
//     });


export default DummyImageScreen; 
