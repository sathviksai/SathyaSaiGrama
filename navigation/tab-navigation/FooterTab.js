import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Invite from '../../src/screens/Invite';
import { ActivityIndicator } from 'react-native';

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ApprovalTab from '../../src/screens/approval/ApprovalTab';
import Profile from '../../src/screens/Profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VisitorFills from '../../src/screens/VisitorFills';
import FillByYourSelf from '../../src/screens/FillByYourSelf';
import MyProfile from '../../src/screens/MyProfile'
import Notifications from '../../src/screens/Notifications';
import Settings from '../../src/screens/Settings';
import VerifyDetails from '../../src/screens/approval/VerifyDetails';
import EditVerifyDetails from '../../src/screens/approval/EditVerifydetails';
import UserContext from '../../context/UserContext';
import { AuthContext } from '../../src/auth/AuthProvider';
import { getDataWithString } from '../../src/components/ApiRequest';
import Edit from '../../src/screens/Edit';
import AddData from '../../src/screens/AddData';
import FamilyMemberVerifyDetails from '../../src/screens/FamilyMemberVerifyDetails';

const Tab = createBottomTabNavigator();
const InviteStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ApproveStack = createNativeStackNavigator();

function InviteStackScreen() {
    return (
        <InviteStack.Navigator screenOptions={{ headerShown: false }}>
            <InviteStack.Screen name="Invite" component={Invite} />
            <InviteStack.Screen
                name="VisitorFills"
                component={VisitorFills}
            />
            <InviteStack.Screen
                name="FillByYourSelf"
                component={FillByYourSelf}
            />
        </InviteStack.Navigator>
    );
}

function ProfileStackScreen() {
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={Profile} />
        <ProfileStack.Screen
          name="MyProfile"
          component={MyProfile} 
        />
        <ProfileStack.Screen
          name="Notifications"
          component={Notifications}
        />
        <ProfileStack.Screen
          name="Settings"
          component={Settings}
        />
        <ProfileStack.Screen
          name="Edit"
          component={Edit}
        />
        <ProfileStack.Screen
          name="AddData"
          component={AddData}
        />
        <ProfileStack.Screen
          name="FamilyMemberVerifyDetails"
          component={FamilyMemberVerifyDetails}
        />
      </ProfileStack.Navigator>
    );
  }



const ApprovalStack = () => {
    return (
        <ApproveStack.Navigator screenOptions={{ headerShown: false }}>
            <ApproveStack.Screen name="ApprovalTab" component={ApprovalTab} />
            <ApproveStack.Screen name="VerifyDetails" component={VerifyDetails} />
            <ApproveStack.Screen name="EditVerifydetails" component={EditVerifyDetails} />
        </ApproveStack.Navigator>
    )

}



function FooterTab({ navigation }) {


    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)


    const { userEmail, L1ID, setUserEmail, setL1ID, getAccessToken, accessToken } = useContext(UserContext)
    console.log("Again footer called")

    useEffect(() => {

        const setData = async () => {
            console.log("User email in footer:", user.email)
            try {
                console.log("Access token in footer:", getAccessToken())
                const res = await getDataWithString('All_App_Users', 'Email', user.email, accessToken);
                console.log('Response from getDataWithString:', res);

                if (res && res.data && res.data.length > 0) {
                    const userId = res.data[0].ID;
                    const mail = res.data[0].Email;
                    setL1ID(userId);
                    setUserEmail(mail);
                    console.log('L1ID set to:', userId);
                } else {
                    console.error('Unexpected response structure or empty data:', res);
                }
            } catch (error) {
                console.error('Error in setData:', error);
            }
        };

        setData();

    }, []);

    useEffect(()=>{
        setLoading(false)
        console.log("Use effect in footer: ", L1ID, userEmail)
    },[L1ID])


    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" color="#752A26" style={styles.loadingContainer} />
            ) : (
                <Tab.Navigator
                    screenOptions={{
                        tabBarShowLabel: false,
                        tabBarHideOnKeyboard: true,
                        tabBarStyle: {
                            backgroundColor: '#ece2e2',
                            height: 70,
                            borderTopWidth: 0,
                            elevation: 0,
                            paddingTop: 8,
                        },
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 25,
                            fontFamily: 'Inter',
                        },
                    }}>
                    <Tab.Screen
                        name="InviteStackScreen"
                        component={InviteStackScreen}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={
                                            !focused
                                                ? require('../../src/assets/invitation.png')

                                                : require('../../src/assets/invitationDark.png')
                                        }
                                        resizeMode="contain"
                                        style={{
                                            width: 30,
                                            height: 30,
                                            tintColor: focused ? '#752a26' : 'black',
                                            marginBottom: 5,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: focused ? '#752a26' : 'black',
                                            fontSize: 12,
                                            fontFamily: 'Inter',
                                        }}>
                                        INVITE
                                    </Text>
                                </View>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="ApprovalStack"
                        component={ApprovalStack}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={
                                            focused
                                                ? require('../../src/assets/approvedDark.png')
                                                : require('../../src/assets/approved.png')
                                        }
                                        resizeMode="contain"
                                        style={{
                                            width: 30,
                                            height: 30,
                                            tintColor: focused ? '#752a26' : 'black',
                                            marginBottom: 5,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: focused ? '#752a26' : 'black',
                                            fontSize: 12,
                                            fontFamily: 'Inter',
                                        }}>
                                        APPROVALS
                                    </Text>
                                </View>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="ProfileStackScreen"
                        component={ProfileStackScreen}
                        options={{
                            headerShown: false,
                            headerTitleAlign: 'center',
                            headerStyle: {
                                backgroundColor: '#ece2e2',
                            },
                            headerTintColor: '#752a26',
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={
                                            focused
                                                ? require('../../src/assets/userDark.png')
                                                : require('../../src/assets/user.png')
                                        }
                                        resizeMode="contain"
                                        style={{
                                            width: 30,
                                            height: 30,
                                            tintColor: focused ? '#752a26' : 'black',
                                            bottom: 5,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: focused ? '#752a26' : 'black',
                                            fontSize: focused ? 14 : 12,
                                            fontFamily: 'Inter',
                                        }}>
                                        PROFILE
                                    </Text>
                                </View>
                            ),
                        }}
                    />
                </Tab.Navigator>
            )}
        </>
    );
}
export default FooterTab;
const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});