import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pending from './Pending';
import Approved from './Approved';
import Denied from './Denied';
import HeaderWithSearch from './HeaderWithSearch';
import { useState } from 'react';

const Tab = createMaterialTopTabNavigator();


function ApprovalTab() {
    const [search, setSearch] = useState('');
    return (
        <>
            {/* <HeaderWithSearch search={search} setSearch={setSearch} /> */}
            <Tab.Navigator
                style={{ backgroundColor: "#FFF" }}
                screenOptions={{
                    tabBarStyle: { backgroundColor: '#F8F9FE', borderRadius: 16, justifyContent: "center", marginLeft: 16, marginRight: 16, height: 56, display: "flex", marginBottom: 20 },
                    tabBarIndicatorStyle: { height: 0 },
                    tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', textAlign: "center", fontFamily: "Inter;", fontStyle: "normal", fontWeight: 700 },
                    //tabBarItemStyle: { width: 100 },
                    //tabBarScrollEnabled: true,
                }}
            >
                <Tab.Screen name="Pending" component={Pending} 
                options={
                    {
                        tabBarActiveTintColor: '#FFBE65',
                        tabBarInactiveTintColor: 'gray',
                    }
                }
                />
                <Tab.Screen name="Approved" component={Approved} 
                                options={
                                    {
                                        tabBarActiveTintColor: '#008000',
                                        tabBarInactiveTintColor: 'gray',
                                    }
                                }
                />
                <Tab.Screen name="Denied" component={Denied} options={{ title: "Rejected", tabBarActiveTintColor: '#B21E2B',
                                        tabBarInactiveTintColor: 'gray', }}  />
            </Tab.Navigator>
        </>

    );
}

export default ApprovalTab