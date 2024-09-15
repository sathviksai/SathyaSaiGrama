import {BASE_APP_URL, APP_OWNER_NAME, APP_LINK_NAME} from '@env';
import {Alert} from 'react-native';

export const getDataWithInt = async (reportName, criteria, value, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria}==${value}`;
    console.log('url in getDataWithInt: ', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria}==${value}`,
      },
    });
    const res = await response.json();
    console.log('Response in getDataWithInt: ', res);
    return res;
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

// export const getDataWithString = async (reportName, criteria, value, token) => {

//   try {
//     const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria}=="${value}"`;
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Zoho-oauthtoken ${token}`
//       },
//       params: {
//         criteria: `${criteria}=="${value}"`
//       }
//     });
//     return await response.json();
//   }
//   catch (err) {
//     if (err.message === 'Network request failed')
//       Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.', err);
//     else {
//       Alert.alert("Error: ", err)
//       console.log(err)
//     }
//   }
// }

export const getDataWithString = async (reportName, criteria, value, token) => {
  try {
    console.log('Base app url is : ', BASE_APP_URL);
    console.log('token in getDataWithString: ', token, value);
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria}=="${value}"`;
    console.log('url', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria}=="${value}"`,
      },
    });
    const res = await response.json();
    console.log('Response in getDataWithString: ', res);
    return res;
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const getDataWithIntAndString = async (
  reportName,
  criteria1,
  value1,
  criteria2,
  value2,
  token,
) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}==[${value1}]%26%26${criteria2}=="${value2}"`;
    console.log('url : ', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria1}==${value1}&&${criteria2}=="${value2}"`,
      },
    });
    const res = await response.json();
    return res;
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const getL2Data = async (
  reportName,
  criteria1,
  value1,
  criteria2,
  value2,
  criteria3,
  value3,
  criteria4,
  value4,
  token,
) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}==[${value1}]%26%26${criteria2}=="${value2}"%26%26${criteria3}=="${value3}"%26%26${criteria4}!=${value4}`;
    console.log('url : ', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria1}==${value1}&&${criteria2}=="${value2}"&&${criteria3}=="${value3}"&&${criteria4}!=${value4}`,
      },
    });
    const res = await response.json();
    console.log('Response in getL2Data: ', res);
    return res;
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const getDataWithTwoString = async (
  reportName,
  criteria1,
  value1,
  criteria2,
  value2,
  token,
) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}=="${value1}"%26%26${criteria2}==${value2}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria1}=="${value1}"&&${criteria2}==${value2}`,
      },
    });
    return await response.json();
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const getDataWithTwoInt = async (
  reportName,
  criteria1,
  value1,
  criteria2,
  value2,
  token,
) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}==${value1}%26%26${criteria2}==${value2}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria1}==${value1}&&${criteria2}==${value2}`,
      },
    });
    return await response.json();
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const getDataWithStringAndInt = async (
  reportName,
  criteria1,
  value1,
  criteria2,
  value2,
  token,
) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}=="${value1}"%26%26${criteria2}==${value2}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria1}=="${value1}"&&${criteria2}==${value2}`,
      },
    });
    return await response.json();
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const getDataWithoutStringAndWithInt = async (
  reportName,
  criteria1,
  value1,
  criteria2,
  value2,
  token,
) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}?criteria=${criteria1}!="${value1}"%26%26${criteria2}==${value2}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        criteria: `${criteria1}!="${value1}"&&${criteria2}==${value2}`,
      },
    });
    return await response.json();
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const postDataWithInt = async (reportName, user_data, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/${reportName}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      body: JSON.stringify(user_data),
    });
    return await response.json();
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};

export const patchDataWithInt = async (reportName, modified_data, token) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      body: JSON.stringify(modified_data),
    });
    return await response.json();
  } catch (err) {
    if (err.message === 'Network request failed')
      Alert.alert(
        'Network Error',
        'Failed to fetch data. Please check your network connection and try again.',
      );
    else {
      Alert.alert('Error: ', err);
      console.log(err);
    }
  }
};
