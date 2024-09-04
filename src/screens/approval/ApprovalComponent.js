import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import React, { useContext } from 'react'
import UserContext from '../../../context/UserContext'

const ApprovalComponent = ({ navigation, user }) => {

    const { loggedUser } = useContext(UserContext)

    const openPending = () => {
        navigation.navigate("VerifyDetails", { user: user })
    }

    const containerHeight = user.Referrer_Approval === "APPROVED" ? 100 : 70;
    let statusColor;
    let backColor;
    let statusTxtColor

    let status;
    if (user.L2_Approval_Status === "APPROVED") {
        statusColor = "#008000"
        statusTxtColor = "#FFF"
        status = "L2 Approval Status: APPROVED"
    } else if (user.L2_Approval_Status === "PENDING APPROVAL") {
        statusColor = "#FADC3D"
        statusTxtColor = "#B21E2B"
        status = "L2 Approval Status: PENDING"
    } else if (user.L2_Approval_Status === "DENIED") {
        statusColor = "#FF0000"
        statusTxtColor = "#FFF"
        status = "L2 Approval Status: DENIED"
    }

    
    if (user.Referrer_Approval === "APPROVED") {
        backColor = "#0080000D"
    } else if (user.Referrer_Approval === "PENDING APPROVAL") {
        backColor = "#FFBE650D"
    } else if (user.Referrer_Approval === "DENIED") {
        backColor = "#FF00000D"
    }

    return (
            <TouchableOpacity style={[styles.container, { height: containerHeight, backgroundColor: backColor, }]} onPress={openPending}>
                <View style={styles.name}><Text style={styles.nametxt}>{user.Name_field.first_name} {user.Name_field.last_name}</Text></View>
                <View style={styles.hold}>
                    <Text style={styles.txt1}>Date of visit : {user.Date_of_Visit}</Text>
                    <Text style={styles.txt2}>No. of people: {user.Number_of_People}</Text>
                </View>
                {
                    user?.Referrer_Approval === "APPROVED" ? (
                        <View style={styles.status}>
                            <View style={[styles.statusview, { backgroundColor: statusColor }]}>
                                <Text style={{ color: statusTxtColor }}>{status}</Text>
                            </View >
                        </View>
                    ) : null
                }
            </TouchableOpacity>

    )
}

export default ApprovalComponent

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        flexShrink: 0,
        borderWidth: 0.6,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 10,
        borderColor: 'black',
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
        marginRight: 27,
        marginTop: 5
    },
    nametxt: {
        color: "#1F2024",
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
        width: "80%",
        height: "65%",
        marginLeft: 35,
        marginTop: 6,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    status: {
        flex: 1,
        flexDirection: "row",
        paddingRight: 20,
        justifyContent: "space-between"
    }
})