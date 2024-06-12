import React, {useState, useContext} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {postDataWithInt} from '../components/ApiRequest';
import {useForm, Controller} from 'react-hook-form';
import UserContext from '../../context/UserContext';

const Feedback = ({navigation}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const {getAccessToken} = useContext(UserContext);

  //   const posting = async() => {
  //       try {
  //         const url = "https://creator.zoho.com/api/v2.1/annapoornaapp/ashram-visitor-management/form/Feedback"
  //        const response = await fetch(url, {
  //          method: 'POST',
  //          headers: {
  //            Authorization: "Zoho-oauthtoken 1000.e4f05b51a68382d7a0d41bcb53c15069.b7bacb9904ac6f185d2c8e304dff84cb"
  //          },
  //          body: JSON.stringify(formData)
  //        });
  //        return await response.json();
  //      }
  //      catch (err) {
  //        if (err.message === 'Network request failed')
  //          Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.');
  //        else {
  //          Alert.alert("Error: ", err)
  //          console.log(err)
  //        }
  //      }
  //   };
  const handleSubmitFeedback = async formRes => {
    // const res=await posting();
    const formData = {
      data: {
        Pick_a_subject_and_provide_your_feedback: formRes.subject,
        Your_feedback: formRes.feedback,
      },
    };
    console.log(getAccessToken());
    console.log(formData);
    const res = await postDataWithInt('Feedback', formData, getAccessToken());
    console.log(res);
    if (res && res.message === 'Data Added Successfully') {
      Alert.alert('Feedback Submitted');
      navigation.navigate('Profile');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.field}>
          <Text style={styles.label}>
            Pick a subject and provide your feedback
          </Text>
          <Controller
            name="subject"
            control={control}
            rules={{required: 'Subject is required'}}
            render={({field: {onChange, value}}) => (
              <Dropdown
                style={styles.inputBox}
                data={[
                  {label: 'Technical issue', value: 'Technical issue'},
                  {label: 'Data issue', value: 'Data issue'},
                  {label: 'Suggestion', value: 'Suggestion'},
                  {label: 'Compliment', value: 'Compliment'},
                ]}
                maxHeight={300}
                placeholder="Select an option"
                labelField="label"
                valueField="value"
                value={value}
                onChange={item => {
                  onChange(item.value);
                  setSelectedValue(item.value);
                }}
              />
            )}
          />
          {errors.subject && (
            <Text style={styles.textError}>{errors.subject.message}</Text>
          )}
        </View>
        <Text style={styles.label}>Your feedback</Text>
        <Controller
          name="feedback"
          control={control}
          defaultValue=""
          rules={{required: 'Feedback is required'}}
          render={({field: {onChange, value}}) => (
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={text => {
                onChange(text);
                setFeedback(text);
              }}
            />
          )}
        />
        {errors.feedback && (
          <Text style={styles.textError}>{errors.feedback.message}</Text>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSubmit(handleSubmitFeedback)}
            style={styles.submit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.Cancel}>
            <Text style={styles.buttonText1}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  textError: {
    color: 'red',
    fontSize: 12,
  },
  footer: {
    flex: 1,
    width: 340,
    height: 45,
    paddingVertical: 20,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  submit: {
    height: 50,
    width: 110,
    backgroundColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Cancel: {
    height: 50,
    width: 110,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  buttonText1: {
    color: '#B21E2B',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    flexDirection: 'column',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    alignSelf: 'stretch',
    color: '#2F3036',
    fontFamily: 'Inter',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  inputBox: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: 12,
  },
  textInput: {
    height: 200,
    borderColor: '#C5C6CC',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlignVertical: 'top',
    width: '90%',
    marginBottom: 16,
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
});

export default Feedback;
