import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pending from './Pending';
import Approved from './Approved';
import Denied from './Denied';
import HeaderWithSearch from './HeaderWithSearch';
import { useEffect, useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

const Tab = createMaterialTopTabNavigator();


function ApprovalTab() {
    const [searchTxt, setSearchTxt] = useState('');
    //   useEffect(()=>{
    // console.log(search)
    //  }, [search])
    return (
        <>
            {/* <HeaderWithSearch search={search} setSearch={setSearch} /> */}
            <Tab.Navigator
                style={{ backgroundColor: "#FFF" }}
                screenOptions={{
                    tabBarStyle: { backgroundColor: '#F8F9FE', borderRadius: 16, justifyContent: "center", marginLeft: 16, marginRight: 16, height: 56, display: "flex", marginBottom: 2 },
                    tabBarIndicatorStyle: { height: 0 },
                    tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', textAlign: "center", fontFamily: "Inter;", fontStyle: "normal", fontWeight: 700 },
                }}
            >
                <Tab.Screen name="Pending" component={Pending}
                    options={{
                        tabBarActiveTintColor: '#FFBE65',
                        tabBarInactiveTintColor: 'gray',
                    }}
                />
                <Tab.Screen name="Approved" component={Approved}
                    options={
                        {
                            tabBarActiveTintColor: '#008000',
                            tabBarInactiveTintColor: 'gray',
                        }
                    }
                />
                <Tab.Screen name="Denied" component={Denied} options={{
                    title: "Rejected", tabBarActiveTintColor: '#B21E2B',
                    tabBarInactiveTintColor: 'gray',
                }} />
            </Tab.Navigator>
        </>

    );
}

const styles = StyleSheet.create({
    search: {
        marginHorizontal: 30,
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: "#FFF",

    },
    txt: {
        fontSize: 13,
        paddingVertical: 6,
        paddingStart: 10
    }

});


export default ApprovalTab