import {StyleSheet, View, FlatList, RefreshControl, Text} from 'react-native';
import React, {useState} from 'react';
import FamilyMember from './FamilyMember';

const FlatMembers = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    const resFromFamilyMember = await getDataWithoutStringAndWithInt(
      'All_Residents',
      'Relationship_with_the_primary_contact',
      'Self',
      'Flats_lookup',
      getAccessToken(),
    );
    if (resFromFamilyMember && resFromFamilyMember.data) {
      familyMembersData = resFromFamilyMember.data;
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.flatMember}>
        <Text style={styles.flatMemberTitle}>Flat Members</Text>
      </View>
      <FlatList
        data={route.params.membersInfo}
        renderItem={({item}) => (
          <FamilyMember
            navigation={navigation}
            key={item.ID}
            member={item}
            memebersData={route.params.membersInfo}
          />
        )}
        keyExtractor={item => item.ID.toString()}
      />
    </View>
  );
};

export default FlatMembers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  flatMember: {
    width: 375,
    height: 56,
    paddingTop: 19.5,
    paddingRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  flatMemberTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '800',
    color: '#1F2024',
    textAlign: 'center',
    // lineHeight:"normal"
  },
});
