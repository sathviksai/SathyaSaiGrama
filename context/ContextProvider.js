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
      loggedUser, setLoggedUser
     }}>
      {children}
    </UserContext.Provider>
  )
}

export default ContextProvider