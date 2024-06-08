import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Invite from '../../src/screens/Invite';
import { ActivityIndicator, Alert } from 'react-native';

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
import { getDataWithString, getDataWithInt } from '../../src/components/ApiRequest';
import Edit from '../../src/screens/Edit';
import AddData from '../../src/screens/AddData';
import FamilyMemberVerifyDetails from '../../src/screens/FamilyMemberVerifyDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import L2ApprovalTab from '../../src/screens/L2-approval/L2ApprovalTab';
import ViewDetails from '../../src/screens/L2-approval/ViewDetails';

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

const L2ApprovalStack = () => {

    const { loggedUser, accessToken, setUserType, userType, userEmail } = useContext(UserContext)
    const { setUser }= useContext(AuthContext)

    console.log("Logged user in L2Approval stack in FooterTab", loggedUser)

    const fetchDataFromOffice = async ( ) => {

        const res = await getDataWithInt("All_Offices", "Approver_app_user_lookup", loggedUser.userId, accessToken);
        if (res && res.data) {
            const deptIds = res.data.map(dept => dept.ID);
            await AsyncStorage.removeItem("existedUser");
            setUserType("L2")
            await AsyncStorage.setItem("existedUser", JSON.stringify({ userId: loggedUser.userId, role: "L2", email: userEmail, deptIds: deptIds  }))
        }
        else {
            await AsyncStorage.removeItem("existedUser");
            setUserType("L1")
            await AsyncStorage.setItem("existedUser", JSON.stringify({ userId: loggedUser.userId, role: "L1", email: userEmail, deptIds:  deptIds }))
        }

        let exist = await AsyncStorage.getItem("existedUser");
        exist = JSON.parse(exist)
        if (exist && userType && (userType != exist.role)) {
            Alert.alert("Your account has been deleted!")
            setUser(null);
            await AsyncStorage.removeItem("existedUser");
            setTimeout(() => {
                RNRestart.Restart();
            }, 1000)
        }
        console.log("Re-cheking is completed in L1 request")
    }



    useEffect(() => {
            fetchDataFromOffice()
    }, [])

    return (
        <ApproveStack.Navigator screenOptions={{ headerShown: false }}>
            <ApproveStack.Screen name="L2ApprovalTab" component={L2ApprovalTab} />
            <ApproveStack.Screen name="ViewDetails" component={ViewDetails} />
        </ApproveStack.Navigator>
    )

}



function FooterTab({ navigation }) {

    const { loggedUser } = useContext(UserContext)

    return (
        <>
            {!loggedUser ? (
                <ActivityIndicator size="large" color="red" style={styles.loadingContainer} />
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
                                        My Approvals
                                    </Text>
                                </View>
                            ),
                        }}
                    />
                    {
                        loggedUser.role === "L2" ? (
                            <Tab.Screen
                                name="L2ApprovalStack"
                                component={L2ApprovalStack}
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
                                                L1 Requests
                                            </Text>
                                        </View>
                                    ),
                                }}
                            />
                        ) : null
                    }
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
            )
            }
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