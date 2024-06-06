import { BASE_APP_URL, APP_OWNER_NAME, APP_LINK_NAME } from "@env";
import { Alert } from "react-native";


export const getDataWithInt = async (reportName, criteria, value, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria}==${value}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`
      },
      params: {
        criteria: `${criteria}==${value}`
      }
    });
    return await response.json();
  }
  catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.');
    else {
      Alert.alert("Error: ", err)
      console.log(err)
    }
  }
}


export const getDataWithString = async (reportName, criteria, value, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria}=="${value}"`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`
      },
      params: {
        criteria: `${criteria}=="${value}"`
      }
    });
    return await response.json();
  }
  catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.', err);
    else {
      Alert.alert("Error: ", err)
      console.log(err)
    }
  }
}

export const getDataWithIntAndString = async (reportName, criteria1, value1, criteria2, value2, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}==${value1}%26%26${criteria2}=="${value2}"`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`
      },
      params: {
        criteria: `${criteria1}==${value1}&&${criteria2}=="${value2}"`
      }
    });
    return await response.json();
  }
  catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.');
    else {
      Alert.alert("Error: ", err)
      console.log(err)
    }
  }
}


export const getDataWithTwoString = async (reportName, criteria1, value1, criteria2, value2, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}=="${value1}"%26%26${criteria2}==${value2}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`
      },
      params: {
        criteria: `${criteria1}=="${value1}"&&${criteria2}==${value2}`
      }
    });
    return await response.json();
  }
  catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.');
    else {
      Alert.alert("Error: ", err)
      console.log(err)
    }
  }
}
