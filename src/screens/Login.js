import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '../auth/firebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { getDataWithInt, getDataWithString } from '../components/ApiRequest';
import UserContext from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {


    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm()
    const { getAccessToken, userType, setUserType, accessToken, setUserEmail, setL1ID, loggedUser, setLoggedUser } = useContext(UserContext)
    const [currentUser, setCurrentUser] = useState(null)
    const [departmentIds, setDepartmentIds] = useState([])


    const fetchDataFromOffice = async (id) => {
        console.log("access token and id in fetchDataFromOffice in login: ", accessToken, id);
        const res = await getDataWithInt("All_Offices", "Approver_app_user_lookup", id, accessToken);
        if (res && res.data) {
            console.log("department data found in Login:", res.data)
            const deptIds = res.data.map(dept => dept.ID);
            setDepartmentIds(deptIds)
            setUserType("L2")
        }
        else {
            setUserType("L1")
        }
        console.log("response in fetchDataFromOffice in login: ".res)
    }




    useEffect(() => {

        const storeData = async () => {
            if (currentUser) {
                console.log("Inside the useEffect of login")
                await AsyncStorage.setItem("existedUser", JSON.stringify({ userId: currentUser.id, role: userType, email: currentUser.email, deptIds: departmentIds }));
                console.log("login data saved into local storage")
                let existedUser = await AsyncStorage.getItem("existedUser");
                existedUser = JSON.parse(existedUser)
                console.log("Existed user in Base route useEffect:", existedUser)
                setLoggedUser(existedUser);
                navigation.navigate("FooterTab");
            }
        };

        if (userType && departmentIds) {
            console.log("Before store data called in useEffect in Login")
            storeData()
            console.log("After store data called in useEffect in Login")
        }

    }, [currentUser]);




    const handleLoginForm = async (userCred) => {

        setLoading(true);
        const res = await getDataWithString('All_App_Users', 'Email', userCred.email, accessToken);
        console.log("Whether user exis or not in login: ", res)
        if (res && res.data) {
            try {
                fetchDataFromOffice(res.data[0].ID)
                const userCredential = await signInWithEmailAndPassword(auth, userCred.email, userCred.password);
                const user = userCredential.user;
                setLoading(false);
                if (user.emailVerified) {
                    setL1ID(res.data[0].ID)
                    setUserEmail(userCred.email)
                    setCurrentUser({ id: res.data[0].ID, email: userCred.email })
                } else {
                    // Email is not verified, display message and send verification email (if needed)
                    await sendEmailVerification(auth.currentUser);
                    navigation.navigate('VerificationNotice', { id: res.data[0].ID })
                }

            } catch (error) {
                setLoading(false);
                if (error.message === 'Network request failed')
                    Alert.alert('Network Error', 'Failed to fetch data. Please check your network connection and try again.');
                else if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('That email address is already in use!');
                } else if (error.code === 'auth/invalid-email') {
                    Alert.alert('That email address is invalid!');
                } else {
                    Alert.alert('Error in creating account:', error.message);
                }
                console.log('Error in auth: ', error);
            }

        } else {
            setLoading(false)
            Alert.alert("Data not exists")
        }

    }

    return (
        <KeyboardAvoidingView behavior='padding'
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
            style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#752A26" />
            ) : (
                <View style={styles.main}>
                    <Text style={styles.login}>Login</Text>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Email"
                                style={styles.inputBox}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        rules={{ required: true, pattern: /^\S+@\S+$/i }}
                    />
                    {errors.email?.type === 'required' && <Text style={styles.textError}>Email is required</Text>}
                    {errors.email?.type === 'pattern' && <Text style={styles.textError}>Enter valid email</Text>}

                    <Controller
                        name='password'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Password"
                                style={styles.inputBox}
                                value={value}
                                secureTextEntry
                                onChangeText={onChange}
                            />
                        )}
                        rules={{ required: true, minLength: 8, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ }}
                    />
                    {errors.password?.type === 'required' && <Text style={styles.textError}>Password is required</Text>}
                    {errors.password?.type === 'minLength' && <Text style={styles.textError}>Password must be 8 characters long</Text>}
                    {errors.password?.type === 'pattern' && <Text style={styles.textError}>Password must contain at least a uppercase,lowercase, number and a special character</Text>}

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotPassword}>forgot your password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSubmit(handleLoginForm)} style={styles.register}>
                        <Text style={styles.registerTitle}>Login</Text>
                    </TouchableOpacity>
                    <View style={styles.redirect}>
                        <Text style={{ fontWeight: "bold", marginEnd: 8 }}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Register')
                        }}>
                            <Text style={{ color: "blue", fontWeight: "bold" }}>SignUp</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

export default Login

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#C19F83',
        flex: 1
    },
    main: {
        padding: 16,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 2, height: 2 },
                shadowColor: '#333',
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            }
        })
    },
    redirect: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10
    },
    inputBox: {
        borderWidth: 1,
        borderColor: 'grey',
        paddingHorizontal: 12,
        borderRadius: 10,
        width: '90%',
        marginTop: 20,
    },
    register: {
        width: '90%',
        backgroundColor: '#752A26',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 40,
    },
    registerTitle: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    login: {
        fontSize: 30,
        color: '#752A26',
        fontWeight: '600',
        marginBottom: 30,
    },
    textError: {
        color: 'red',
        fontSize: 12
    },
    forgotPassword: {
        color: '#2F3133',
        width: "90%",
        fontSize: 15,
        marginTop: 10,
    }
});