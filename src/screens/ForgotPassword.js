import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {auth} from '../auth/firebaseConfig';
import {sendPasswordResetEmail} from 'firebase/auth';

const ForgotPassword = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const handleForgotPassword = async ({email}) => {
    try {
      // Attempt to send password reset email
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Success',
        'A password reset email has been sent (if the email exists).',
      ); // Updated message
    } catch (error) {
      // Handle password reset errors
      console.error('Password Reset Error:', error);
      if (error.message === 'Network request failed')
        Alert.alert(
          'Network Error',
          'Failed to fetch data. Please check your network connection and try again.',
        );
      if (error.code === 'auth/user-not-found') {
        Alert.alert(
          'Info',
          'The email address was not found. Please check your email or create a new account.',
        );
      } else {
        // Handle other errors
        Alert.alert('Error', 'Password reset failed. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.forgot}>Enter Email Address</Text>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="Email for Password Reset"
              style={styles.inputBox}
              value={value}
              onChangeText={onChange}
            />
          )}
          rules={{required: true, pattern: /^\S+@\S+$/i}}
        />
        {errors.email?.type === 'required' && (
          <Text style={styles.textError}>Email is required</Text>
        )}
        {errors.email?.type === 'pattern' && (
          <Text style={styles.textError}>Enter a valid email</Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(handleForgotPassword)}
          style={styles.register}>
          <Text style={styles.registerTitle}>Send</Text>
        </TouchableOpacity>
        <View style={styles.redirect}>
          <Text
            style={{
              color: '#71727A',

              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 16,
              marginRight: 5,
            }}>
            Back to
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: '#B21E2B',

                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 16,
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.redirect, {marginTop: '5%'}]}>
          <Text
            style={{
              color: '#71727A',

              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 16,
              marginRight: 5,
            }}>
            Do not have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                color: '#B21E2B',

                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 16,
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  redirect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '25%',
  },
  inputBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    margin: 20,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#B21E2B',
    justifyContent: 'center',
  },
  register: {
    width: 220,
    height: 48,
    backgroundColor: '#B21E2B',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
    marginTop: '12%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  register1: {
    backgroundColor: '#B21E2B',
    margin: 35,
  },
  register2: {
    backgroundColor: '#ffbe65',
    marginLeft: 35,
    marginBottom: 30,
  },
  registerTitle: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    color: 'white',
  },
  textError: {
    color: 'red',
    fontSize: 12,
  },
  forgot: {
    color: '#2F3036',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    marginRight: '60%',
  },
  instructions: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
});
