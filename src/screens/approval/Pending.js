
import { StyleSheet, Text, View } from 'react-native'
import React, {useContext, useEffect, useState} from 'react'
import ApprovalComponent from './ApprovalComponent'
import UserContext from '../../../context/UserContext'
import { getDataWithInt } from '../../components/ApiRequest'

const Pending = ({navigation}) => {
  const {L1ID, getAccessToken, userEmail} = useContext(UserContext);
  const [Pendings, setPendings] = useState([])

  useEffect(()=>{

    const callFetchData = async () => {
      const result = await getDataWithInt('Approved_Visitors', 'Referrer_App_User_lookup', L1ID,  getAccessToken());
      setPendings(result);
    }
    callFetchData()
  }, [])

  useEffect(()=>{
    console.log("pendings are : ", Pendings)
    console.log("User email is : ", userEmail)
  },[Pendings])

  
  return (
    <View>
      <ApprovalComponent navigation={navigation}/>
    </View>
  )
}

export default Pending

const styles = StyleSheet.create({})