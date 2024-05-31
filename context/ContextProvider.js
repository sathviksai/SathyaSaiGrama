import React, { useState } from 'react'
import UserContext from './UserContext'

function ContextProvider({children}) {

   const [userEmail, setUserEmail] = useState()
   const [L1ID, setL1ID] = useState()
   let accessToken = ""

   const setAccessToken = (newToken) =>{
    accessToken = newToken
   }

   const getAccessToken = () => accessToken
   
  return (
    <UserContext.Provider value={{userEmail, setUserEmail, L1ID, setL1ID,setAccessToken,getAccessToken }}>
      {children}
    </UserContext.Provider>
  )
}

export default ContextProvider