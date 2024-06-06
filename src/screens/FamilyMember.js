import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const FamilyMember = ({ navigation, member }) => {
    console.log(member.App_User_lookup)

    const openFamilyMemberVerifyDetails = () =>{
  navigation.navigate("FamilyMemberVerifyDetails", {memberDetails: member})
    }
  return (
    <TouchableOpacity style={styles.container} onPress={openFamilyMemberVerifyDetails}>
        <View style={styles.hold}>  
            <View style={styles.inner}><Text style={styles.txt1}>Name: </Text></View>
            <View style={styles.inner}><Text style={styles.txt1}>{member.App_User_lookup.Name_field}</Text></View>
        </View>
        <View style={styles.hold}>
            <View style={styles.inner}><Text style={styles.txt}>Relation: </Text></View>
            <View style={styles.inner}><Text style={styles.txt}>{member.Relationship_with_the_primary_contact}</Text></View>
        </View>
        <View style={styles.hold}>
            <View style={styles.inner}><Text style={styles.txt}>Accommodation Approval: </Text></View>
            <View style={styles.inner}><Text style={styles.txt}>{member.Accommodation_Approval}</Text></View>
        </View>
    </TouchableOpacity>
  )
}

export default FamilyMember

const styles = StyleSheet.create({
    container:{
        width: "95%",
        height: 120,
        backgroundColor:"#C6C3C1",
        paddingTop: "5%",
        alignItems: "center",
        borderRadius:10,
        marginBottom: 10,
        marginLeft: 8
    },
    hold:{
        flexDirection:"row",
        marginBottom: 10,
    },
    inner:{
        width: "50%",
        paddingLeft: "5%"
    },
    txt1:{
        fontWeight: "bold",
        marginBottom: 5
    },
    txt:{
        
    }
})