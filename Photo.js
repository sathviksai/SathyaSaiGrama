import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { encode } from 'base64-arraybuffer';
//import getImage from './getImage'; // Adjust the import path as necessary


const BASE_APP_URL = "https://creator.zoho.com/api/v2.1";
const APP_LINK_NAME = "ashram-visitor-management";
const APP_OWNER_NAME = "annapoornaapp";
const token = "1000.f6458358a232b8b374190ce64b634c65.551bde1cd3b256e4e480810730bb4610";

const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Pending_Visitor_Approval_Report/3318254000028765183/Photo/download`;

const getImage = async () => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64Image = encode(buffer); // Use the encode function from base64-arraybuffer
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return dataUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
  }
};


const Photo = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      const dataUrl = await getImage();
      setImageUrl(dataUrl);
      setLoading(false);
    };

    fetchImage();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Photo;
