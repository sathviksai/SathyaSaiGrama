import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ApprovalComponent from './ApprovalComponent';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../components/ApiRequest';

const Pending = ({ navigation }) => {
  const { L1ID, getAccessToken, pendingFlag, pendingDataFetched, setPendingDataFetched } = useContext(UserContext);
  const [Pendings, setPendings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //const [dataFetched, setDataFetched] = useState(false); // State to track if data is already fetched

  const fetchData = async () => {
    setLoading(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "PENDING APPROVAL", getAccessToken());
    setPendings(result.data);
    setLoading(false);
    setPendingDataFetched(true);
  };

  useEffect(() => {
    if (!pendingDataFetched) {
      fetchData();
    }
  }, [pendingDataFetched, pendingFlag]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "PENDING APPROVAL", getAccessToken());
    setPendings(result.data);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={Pendings}
          renderItem={({ item }) => (
            <ApprovalComponent navigation={navigation} key={item.ID} user={item}  />
          )}
          keyExtractor={(item) => item.ID.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default Pending;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
