import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  AppRegistry,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import UserContext from '../../context/UserContext';
import {BASE_APP_URL, APP_OWNER_NAME, APP_LINK_NAME, YOURLS_KEY} from '@env';
import axios from 'axios';

const shortUrl = async (url) => {
  console.log('short');
  try {
    const response = await axios.get(
      'https://visit.ssslsg.org/yourls-api.php',
      {
        params: {
          signature: YOURLS_KEY,
          action: 'shorturl',
          url: url,
          format: 'json',
        },
      },
    );
    if (response.data.status === 'success') {
      return response.data.shorturl;
    } else {
      console.log('Error:', response.data.message);
    }
  } catch (error) {
    console.error('Error making request:', error);
  }
};

const HighlightedText = ({text, highlights}) => {
  const regex = new RegExp(`(${highlights.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text style={styles.headertext}>
      {parts.map((part, index) =>
        highlights.some(
          highlight => part.toLowerCase() === highlight.toLowerCase(),
        ) ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
};

const VisitorFills = () => {

  const {getAccessToken, L1ID} = useContext(UserContext);
  console.log(L1ID);

  const generatedData = async () => {
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_Link_Ids`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
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

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateUniqueLinkID = async () => {
    let link_id = 0;
    const Generated_Link_ID = await generatedData();
    console.log("Generated link id is : ", Generated_Link_ID)

    while (true) {
      const glink_id = randomNumber(100000000001, 999999999998);
      const link_id_count = Generated_Link_ID.data.filter(
        record => record.Link_ID === glink_id,
      ).length;

      if (link_id_count === 0) {
        link_id = glink_id;
        break;
      }
    }
    console.log(link_id);
    return link_id;
  };

  const postss = async () => {
    const UniqueNumber = await generateUniqueLinkID();
    console.log(UniqueNumber);
    console.log(L1ID);
    const formData = {
      data: {
        Link_ID: UniqueNumber,
        Referrer_App_User_lookup: L1ID,
      },
    };

    try {
      const response = await fetch(
        `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Generated_Link_ID`,
        {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
          },
          body: JSON.stringify(formData),
        },
      );

      return await response.json();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };
  let veryshortUrl = '';
  const generateURL = async () => {
    const res = await postss();
    console.log(res);
    const id = res.data.ID;

    if (id) {
      const shareURL = `https://creatorapp.zohopublic.com/${APP_OWNER_NAME}/${APP_LINK_NAME}/form-perma/Visitor_Information/t253nXrNhjgOHEpBs8EmZMTmpfP1UQejdGPB07QXDWt9NV2SjENZJmXwHJUuPbwFmXpT2Wsm72zAnyXwtZdy8Y4YgBdGyb6mOKee?L1_lookup=${L1ID}&LinkIDLookup=${id}&Home_Office=${selectedOption}`;

      veryshortUrl = await shortUrl(shareURL);
    }
  };

  const [loading, setLoading] = useState(false);

  const onShare = async () => {
    try {
      if (selectedOption !== null) {
        setLoading(true);
        const res = await generateURL();
        const result = await Share.share({
          message: `Please Fill the form using this Link : ${veryshortUrl}`,
        });
        setLoading(false);
      } else {
        Alert.alert('Select anyone option');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Something is wrong : ",error.message);
    }
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const handleCheckboxChange = option => {
    setSelectedOption(selectedOption === option ? null : option);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HighlightedText
          text="Are You inviting For Home or Office"
          highlights={['Home', 'Office']}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            selectedOption === 'Home' && styles.selectedCheckbox,
          ]}
          onPress={() => handleCheckboxChange('Home')}>
          <CheckBox
            isChecked={selectedOption === 'Home'}
            onClick={() => handleCheckboxChange('Home')}
            checkBoxColor="#752A26"
          />
          <Text
            style={[
              styles.checkboxText,
              selectedOption === 'Home'
                ? styles.selectedCheckboxText
                : styles.unselectedCheckboxText,
            ]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.checkbox,
            selectedOption === 'Office' && styles.selectedCheckbox,
          ]}
          onPress={() => handleCheckboxChange('Office')}>
          <CheckBox
            isChecked={selectedOption === 'Office'}
            onClick={() => handleCheckboxChange('Office')}
            checkBoxColor="#752A26"
          />
          <Text
            style={[
              styles.checkboxText,
              selectedOption === 'Office'
                ? styles.selectedCheckboxText
                : styles.unselectedCheckboxText,
            ]}>
            Office
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.share}>
        {loading && (
          <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" color="#752A26" />
            <Text style={styles.indicatorText}>
              Generating URL Please Wait...
            </Text>
          </View>
        )}
        {!loading && (
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Text style={styles.shareButtonText}>Share URL</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c19f83',
  },
  header: {
    paddingTop: 30,
    alignItems: 'center',
  },
  headertext: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  highlight: {
    color: '#752A26',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#c6c3c1',
  },
  selectedCheckbox: {
    borderColor: '#752A26',
    backgroundColor: '#F5E1E1',
  },
  checkboxText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  selectedCheckboxText: {
    color: '#752A26',
  },
  unselectedCheckboxText: {
    color: '#c6c3c1',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 20,
    borderRadius: 20,
    backgroundColor: '#752A26',
  },
  shareButtonText: {
    color: '#F5E1E1',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
    alignItems: 'center',
  },
});

export default VisitorFills;
