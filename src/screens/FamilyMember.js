import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const FamilyMember = ({navigation, member, memebersData}) => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.head}>
          <Text style={styles.title}>{member.App_User_lookup.Name_field}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Edit', {
                formType: 'MemberBasicInfo',
                membersData: memebersData,
                memberdata: member,
              })
            }
            style={styles.edit}>
            <Image
              source={require('../assets/Edit.png')}
              style={{width: 17, height: 14.432, marginEnd: 5, flexShrink: 0}}
            />
            <Text style={[styles.title, styles.editText]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.input}>
          <Text style={styles.label}>Relation: </Text>
          <Text style={styles.value}>
            {member.Relationship_with_the_primary_contact}
          </Text>
        </View>
        <View style={styles.input}>
          <Text style={styles.label}>Ph: </Text>
          <Text style={styles.value}>
            {member.App_User_lookup.Phone_Number}
          </Text>
        </View>
        <View style={styles.input}>
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{member.App_User_lookup.Email}</Text>
        </View>
        <View style={styles.input}>
          <Text style={styles.label}>Gender: </Text>
          <Text style={styles.value}>{member.App_User_lookup.Gender}</Text>
        </View>
      </View>
    </View>
  );
};

export default FamilyMember;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  main: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: '3%',
    borderRadius: 8,
    flexShrink: 0,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 2, height: 2},
        shadowColor: '#FFF',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.07,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  editText: {
    color: '#B21E2B',
  },
  input: {
    flexDirection: 'row',
    margin: 5,
    marginStart: '5%',
  },
  label: {
    marginEnd: 10,
    color: '#1F2024',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  value: {
    color: '#1F2024',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.25,
  },
});
