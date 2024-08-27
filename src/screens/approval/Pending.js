import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text } from 'react-native';
import React, { useContext, useEffect, useState, useCallback} from 'react';
import ApprovalComponent from './ApprovalComponent';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../components/ApiRequest';
import parseDate from "../../components/ParseDate"
import { useFocusEffect, } from '@react-navigation/native';

const Pending = ({ navigation }) => {
  const { L1ID, getAccessToken, pendingDataFetched, setPendingDataFetched } = useContext(UserContext);
  const [Pendings, setPendings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //const [dataFetched, setDataFetched] = useState(false); // State to track if data is already fetched

  const fetchData = async () => {
    setLoading(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "PENDING APPROVAL", getAccessToken());
    console.log("Pending data are #################", result.data)
    const all_pendings = result.data;
    if (result.data=== undefined){
      setPendings(null);
      setPendingDataFetched(false);
      setLoading(false);}
    // sorting the pendings data by date
   else{
    all_pendings.sort((a, b) => {
      // Parse the date strings into Date objects
      const dateA = new parseDate(a.Date_of_Visit);
      const dateB = new parseDate(b.Date_of_Visit);
      // Compare the Date objects
      return dateB - dateA;
  });
    setPendings(all_pendings);
    setPendingDataFetched(true);
    setLoading(false); 
   }}
  

  useEffect(() => {
    if (!pendingDataFetched) {
      fetchData();
    }
  }, [pendingDataFetched ]);
  

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "PENDING APPROVAL", getAccessToken());
    const all_pendings = result.data;
    // sorting the pendings data by date
    if (result.data=== undefined){
      setPendings(null);
      setRefreshing(false);
      setLoading(false);
    
  
    }
else{  
    all_pendings.sort((a, b) => {
      // Parse the date strings into Date objects
      const dateA = new parseDate(a.Date_of_Visit);
      const dateB = new parseDate(b.Date_of_Visit);
      // Compare the Date objects
      return dateB - dateA;
  });
    setPendings(all_pendings);
    setRefreshing(false);
}
  

  };


  useFocusEffect(useCallback(() => {
    onRefresh();
  }, [Pending]));


  return (
    <><View style={{ flex: 1, paddingTop: 10, backgroundColor: "#FFFF" }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B21E2B" />
        </View>
      ) : ( ( refreshing ?  (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B21E2B" />
      </View>):(
        <FlatList
          data={Pendings}
          renderItem={({ item }) => (
            <ApprovalComponent navigation={navigation} key={item.ID} user={item}  />// Approval component is the card in the approvals
          )}
          keyExtractor={(item) => item.ID.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )))}
    </View>
      {!refreshing && Pendings === null  && !loading && <View style={styles.noPendingTextView}><Text style={{flex:10}}>No Pending visitors</Text></View>}</>
  );
};

export default Pending;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPendingTextView: {
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
    flex:10,
    fontSize: 20, 
  },

});
