import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const ApprovalComponent = ({ navigation, user }) => {

    const openPending = () => {
        navigation.navigate("VerifyDetails", { user: user })
    }
    const containerHeight = user.Referrer_Approval === "APPROVED" ? 120 : 100;
    return (
        <TouchableOpacity style={[styles.container, { height: containerHeight }]} onPress={openPending}>
            <View style={styles.hold}>
                <View style={styles.inner}><Text style={styles.txt1}>Visitor Name</Text></View>
                <View style={styles.inner}><Text style={styles.txt1}>{user.Name_field.first_name} {user.Name_field.last_name}</Text></View>
            </View>
            <View style={styles.hold}>
                <View style={styles.inner}><Text style={styles.txt}>Date of visit</Text></View>
                <View style={styles.inner}><Text style={styles.txt}>{user.Date_of_Visit}</Text></View>
            </View>
            <View style={styles.hold}>
                <View style={styles.inner}><Text style={styles.txt}>No. of visitor</Text></View>
                <View style={styles.inner}><Text style={styles.txt}>{user.Number_of_People}</Text></View>
            </View>
            {
                user?.Referrer_Approval === "APPROVED" ? (
                    <View style={styles.hold}>
                        <View style={styles.inner}><Text style={styles.txt}>L2 Approval status</Text></View>
                        <View style={styles.inner}><Text style={styles.txt}>{user.L2_Approval_Status}</Text></View>
                    </View>
                ) : null
            }

        </TouchableOpacity>
    )
}

export default ApprovalComponent

const styles = StyleSheet.create({
    container: {
        width: "95%",
        height: 100,
        backgroundColor: "#C6C3C1",
        paddingTop: "5%",
        alignItems: "center",
        marginBottom: 10,
        marginLeft: 8
    },
    hold: {
        flexDirection: "row"
    },
    inner: {
        width: "50%",
        paddingLeft: "5%"
    },
    txt1: {
        fontWeight: "bold",
        marginBottom: 5
    },
    txt: {

    }
})