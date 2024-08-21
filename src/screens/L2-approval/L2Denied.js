import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { getL2Data } from '../../components/ApiRequest'
import UserContext from '../../../context/UserContext'
import L2ApprovalComponent from './L2ApprovalComponent';
import parseDate from '../../components/ParseDate';
import { useFocusEffect, } from '@react-navigation/native';

const L2Denied = ({navigation}) => {

  const { loggedUser, accessToken, L2DeniedDataFetched, setL2DeniedDataFetched } = useContext(UserContext)
  const [L2Denieds, setL2Denieds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const fetchData = async () => {
    setLoading(true)
    console.log("Logged user dept id in L2 Pending: ", loggedUser.deptIds)
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "DENIED", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2denieds = result.data;
    all_L2denieds.sort((a, b) => {
      // Parse the date strings into Date objects
      const dateA = new parseDate(a.Date_of_Visit);
      const dateB = new parseDate(b.Date_of_Visit);
      // Compare the Date objects
      return dateB - dateA;
    });
    setL2Denieds(all_L2denieds)
    setLoading(false)
    setL2DeniedDataFetched(true)
  };

  useEffect(() => {

    if (!L2DeniedDataFetched) {
      fetchData();
    }

  }, [L2DeniedDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "DENIED",  "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2denieds = result.data;
    all_L2denieds.sort((a, b) => {
      // Parse the date strings into Date objects
      const dateA = new parseDate(a.Date_of_Visit);
      const dateB = new parseDate(b.Date_of_Visit);
      // Compare the Date objects
      return dateB - dateA;
    });
    setL2Denieds(all_L2denieds)
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => {
    onRefresh();
  }, [L2Denied]));
  return (
<View style={{ flex: 1, paddingTop: 10 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={L2Denieds}
          renderItem={({ item }) => (
            <L2ApprovalComponent navigation={navigation} key={item.ID} user={item}  />
          )}
          keyExtractor={(item) => item.ID.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  )
}

export default L2Denied

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});