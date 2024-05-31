import BaseRoute from "./navigation/stack-navigation/BaseRoute";
import UserContext from "./context/UserContext";
import { useContext, useEffect, useState } from "react";
import { DATABASE_ID, COLLECTION_ID, APPWRITE_FUNCTION_PROJECT_ID, APPWRITE_API_KEY } from "@env"


const App = () => {

  const {  setAccessToken } = useContext(UserContext)

  const getAppWriteToken = async () => {
    let res = await fetch(`https://cloud.appwrite.io/v1/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_FUNCTION_PROJECT_ID,
        'X-Appwrite-Key': APPWRITE_API_KEY
      }
    }
    );
    res = await res.json()
    setAccessToken(res.documents[0].Token)
    console.log(res.documents[0].Token)
  }

  getAppWriteToken();

  return (
    <BaseRoute />
  );
};


export default App;


