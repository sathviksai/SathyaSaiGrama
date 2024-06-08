import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const L2ApprovalComponent = ({ navigation, user }) => {

    const openPending = () => {
        navigation.navigate("ViewDetails", { user: user })
    }


    let backColor;

    if (user.L2_Approval_Status === "APPROVED") {
        backColor = "#0080000D"
    } else if (user.L2_Approval_Status === "PENDING APPROVAL") {
        backColor = "#FFBE650D"
    } else if (user.L2_Approval_Status === "DENIED") {
        backColor = "#FF00000D"
    }

    return (
         <TouchableOpacity style={[styles.container, { backgroundColor: backColor, }]} onPress={openPending}>
                <View style={styles.name}><Text style={styles.nametxt}>{user.Name_field.first_name} {user.Name_field.last_name}</Text></View>
                <View style={styles.hold}>
                    <Text style={styles.txt1}>Date of visit : {user.Date_of_Visit}</Text>
                    <Text style={styles.txt2}>No. of people: {user.Number_of_People}</Text>
                </View>
                <View style={styles.hold}>
                    <Text style={styles.txt1}>L1 Approver: {user.Referrer_App_User_lookup.Name_field}</Text>
                </View>
            </TouchableOpacity>
    )
}

export default L2ApprovalComponent

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        flexShrink: 0,
        height: 90,
        borderWidth: 0.6,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 10,
        borderColor: 'black'
    },
    hold: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    txt1: {
        marginLeft: 20,
        marginTop: 5
    },
    txt2: {
        marginRight: 20,
        marginTop: 5
    },
    nametxt: {
        color: "#B21E2B",
        fontFamily: "Inter",
        fontSize: 15,
        fontStyle: "normal",
        fontWeight: "700",
    },
    name: {
        marginTop: 10,
        marginLeft: 18,
    },
    txt: {
        marginLeft: 20,
        marginTop: 5
    },
    statusview: {
        flex: 1,
        marginLeft: 20,
        marginTop: 6,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    status: {
        flexDirection: "row",
        paddingRight: 20
    }
})