import React, { useState } from 'react'
import UserContext from './UserContext'

function ContextProvider({ children }) {

  const [userEmail, setUserEmail] = useState()
  const [L1ID, setL1ID] = useState()
  const [pendingFlag, setPendingFlag] = useState(false)
  const [approveFlag, setApproveFlag] = useState(false)
  const [deniedFlag, setDeniedFlag] = useState(false)
  const [pendingDataFetched, setPendingDataFetched] = useState(false)
  const [approveDataFetched, setApproveDataFetched] = useState(false)
  const [deniedDataFetched, setDeniedDataFetched] = useState(false)
  const [L2PendingDataFetched, setL2PendingDataFetched] = useState(false)
  const [L2ApproveDataFetched, setL2ApproveDataFetched] = useState(false)
  const [L2DeniedDataFetched, setL2DeniedDataFetched] = useState(false)
  const [userType, setUserType] = useState(null)
  const [loggedUser, setLoggedUser] = useState(null)
  //let accessToken = ""
  const [accessToken, setAccessToken] = useState(""); // Use state for accessToken

  const getAccessToken = () => accessToken;

  // const setAccessToken = (newToken) => {
  //   accessToken = newToken
  // }

  // const getAccessToken = () => accessToken

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail, L1ID, setL1ID, accessToken, setAccessToken, getAccessToken, pendingFlag, setPendingFlag, approveFlag, setApproveFlag, deniedFlag, setDeniedFlag, pendingDataFetched, setPendingDataFetched, 
      approveDataFetched, setApproveDataFetched, 
      deniedDataFetched, setDeniedDataFetched,
      userType, setUserType,
      loggedUser, setLoggedUser,
      L2PendingDataFetched, setL2PendingDataFetched,
      L2ApproveDataFetched, setL2ApproveDataFetched,
      L2DeniedDataFetched, setL2DeniedDataFetched

     }}>
      {children}
    </UserContext.Provider>
  )
}

export default ContextProvider