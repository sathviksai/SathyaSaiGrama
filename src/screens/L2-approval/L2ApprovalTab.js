import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HeaderWithSearch from './HeaderWithSearch';
import { useState } from 'react';
import L2Pending from './L2Pending';
import L2Approved from './L2Approved';
import L2Denied from './L2Denied';

const Tab = createMaterialTopTabNavigator();


function L2ApprovalTab() {
    const [search, setSearch] = useState('');
    return (
        <>
            {/* <HeaderWithSearch search={search} setSearch={setSearch} /> */}
            <Tab.Navigator
             style={{ backgroundColor: "#FFF" }}
             screenOptions={{
                 tabBarStyle: { backgroundColor: '#F8F9FE', borderRadius: 16, justifyContent: "center", marginLeft: 16, marginRight: 16, height: 56, display: "flex", marginBottom: 2 },
                 tabBarIndicatorStyle: { height: 0 },
                 tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', textAlign: "center", fontFamily: "Inter;", fontStyle: "normal", fontWeight: 700 },
                 tabBarActiveTintColor: '#B21E2B',
                tabBarInactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="L2Pending" component={L2Pending} options={{title:"Pending"}}/>
                <Tab.Screen name="L2Approved" component={L2Approved} options={{title:"Approved"}}/>
                <Tab.Screen name="L2Denied" component={L2Denied} options={{title:"Rejected"}}/>
            </Tab.Navigator>
        </>

    );
}

export default L2ApprovalTab