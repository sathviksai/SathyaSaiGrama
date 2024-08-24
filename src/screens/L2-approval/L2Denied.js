import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text } from 'react-native';
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
    if (result.data=== undefined){
      setL2Denieds(null);
      setL2DeniedDataFetched(false);
      setLoading(false);}
      else{
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
  }
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
    if (result.data=== undefined){
      setL2Denieds(null);
      setRefreshing(false);
      setLoading(false);
    
  
    } else{
    all_L2denieds.sort((a, b) => {
      // Parse the date strings into Date objects
      const dateA = new parseDate(a.Date_of_Visit);
      const dateB = new parseDate(b.Date_of_Visit);
      // Compare the Date objects
      return dateB - dateA;
    });
    setL2Denieds(all_L2denieds)
    setRefreshing(false);
  }
 
};

  useFocusEffect(useCallback(() => {
    onRefresh();
  }, [L2Denied]));
  return (
<><View style={{ flex: 1, paddingTop: 10 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : ( ( refreshing ?  (<View style={styles.refreshingTextView}><Text style={styles.refreshingText} >Refreshing data.....</Text></View>):(
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
      )))}
    </View>
     { !refreshing && L2Denieds === null  && !loading && <View style={styles.noL2DeniedTextView}><Text style={{flex:10}}>No L2 Denied visitors</Text></View>}</>
  )
}

export default L2Denied

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noL2DeniedTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshingTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshingText: {
    flex:10,
    fontSize: 20, 
  },
});