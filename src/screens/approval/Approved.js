import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useFocusEffect, } from '@react-navigation/native';
import ApprovalComponent from './ApprovalComponent';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../components/ApiRequest';
import parseDate from "../../components/ParseDate"
import Filter from '../../components/Filter';

const Approved = ({ navigation }) => {
  const { L1ID, getAccessToken, approveDataFetched, setApproveDataFetched } = useContext(UserContext);
  const [approveds, setApproveds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [dataFetched, setDataFetched] = useState(false);
  const [approvedsData, setApprovedsData] = useState([]);

  const fetchData = async () => {

    setLoading(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "APPROVED", getAccessToken());
    // sorting the Approveds data by date
    const all_approveds = result.data;
    if (result.data === undefined) {
      setApproveds(null);
      setApprovedsData(null);
      setApproveDataFetched(false);
      setLoading(false);
    } else {
      all_approveds.sort((a, b) => {
        // Parse the date strings into Date objects
        const dateA = new parseDate(a.Date_of_Visit);
        const dateB = new parseDate(b.Date_of_Visit);
        // Compare the Date objects
        return dateB - dateA;
      });
      setApproveds(all_approveds);
      setApprovedsData(all_approveds)
      setLoading(false);
      setApproveDataFetched(true);
    }
  };

  useEffect(() => {
    if (!approveDataFetched) {
      fetchData();
    }
  }, [approveDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "APPROVED", getAccessToken());
    const all_approveds = result.data;
    if (result.data === undefined) {
      setApproveds(null);
      setApprovedsData(null)
      setRefreshing(false);
      setLoading(false);
    }
    else {
      all_approveds.sort((a, b) => {
        // Parse the date strings into Date objects
        const dateA = new parseDate(a.Date_of_Visit);
        const dateB = new parseDate(b.Date_of_Visit);
        // Compare the Date objects
        return dateB - dateA;
      });
      setApproveds(all_approveds);
      setApprovedsData(all_approveds)
      setRefreshing(false);
    }
  };

  // useFocusEffect(useCallback(() => {
  //   onRefresh();
  // }, [Approved]));


  return (
    <><View style={{ flex: 1, paddingTop: 10, backgroundColor: "#FFFF" }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B21E2B" />
        </View>
      ) : ((refreshing ? (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B21E2B" />
      </View>) : (
        <>
          <Filter setFilteredData={setApprovedsData} ToFilterData={approveds}  comingFrom={"Approved"}/>
          <FlatList
            data={approvedsData}
            renderItem={({ item }) => (
              <ApprovalComponent navigation={navigation} key={item.ID} user={item} />
            )}
            keyExtractor={(item) => item.ID.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )))}
    </View>
    {
        approvedsData?.length<1 && approveds?.length>0  && !loading && <View style={styles.noApprovedTextView}><Text style={{ flex: 10 }}>No Visitors found</Text></View>
      }
      {!refreshing && approveds === null && !loading && <View style={styles.noApprovedTextView}><Text style={{ flex: 10 }}>No Approved visitors</Text></View>}</>
  );
};

export default Approved;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noApprovedTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFF",
  },
  refreshingTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshingText: {
    flex: 10,
    fontSize: 20,
  },
});
