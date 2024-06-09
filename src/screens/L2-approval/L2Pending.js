import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { getL2Data } from '../../components/ApiRequest'
import UserContext from '../../../context/UserContext'
import L2ApprovalComponent from './L2ApprovalComponent';

const L2Pending = ({navigation}) => {

  const { loggedUser, accessToken, L2PendingDataFetched, setL2PendingDataFetched } = useContext(UserContext)
  const [L2Pendings, setL2Pendings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const fetchData = async () => {
    setLoading(true)
    console.log("Logged user dept id in L2 Pending: ", loggedUser.deptIds)
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "PENDING APPROVAL", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    setL2Pendings(result.data)
    setLoading(false)
    setL2PendingDataFetched(true)
  };

  useEffect(() => {

    if (!L2PendingDataFetched) {
      fetchData();
    }

  }, [L2PendingDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "PENDING APPROVAL", "Referrer_App_User_lookup", loggedUser.userId,  accessToken);
    setL2Pendings(result.data);
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
          data={L2Pendings}
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

export default L2Pending

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});