import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React from 'react'

const FamilyMemberVerifyDetails = ({navigation,route}) => {
  const familymember = route.params?.memberDetails
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.head}>
          <Text style={styles.title}>Basic Information</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Edit',{formType: "MemberBasicInfo",memberdata:familymember})} style={styles.edit}>
            <Image source={require('../assets/Edit.png')} style={{width:30, height: 30}}/>
            <Text style={{color: 'blue', fontWeight: 'bold',alignSelf:"center"}}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{familymember.App_User_lookup.Name_field}</Text>
        </View>
        <View>
          <Text style={styles.label}>Relation</Text>
          <Text style={styles.value}>{familymember.Relationship_with_the_primary_contact}</Text>
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{familymember.App_User_lookup.Email}</Text>
        </View>
        <View>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{familymember.App_User_lookup.Phone_Number}</Text>
        </View>
        <View>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{familymember.App_User_lookup.Gender}</Text>
        </View>
      </View>
    </View>
  )
}

export default FamilyMemberVerifyDetails

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C19F83',
    flex: 1,
  },
  main: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
    margin:"3%",
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 2, height: 2},
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom:"3%"
  },
  label: {
    fontSize: 18,
  },
  value: {
    color: 'black',
    fontSize: 20,
    marginBottom: 15,
  },
  edit:{
    flexDirection:"row",
    alignItems:"baseline"
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})