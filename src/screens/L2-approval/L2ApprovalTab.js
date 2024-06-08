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
            <HeaderWithSearch search={search} setSearch={setSearch} />
            <Tab.Navigator>
                <Tab.Screen name="L2Pending" component={L2Pending} options={{title:"Pending"}}/>
                <Tab.Screen name="L2Approved" component={L2Approved} options={{title:"Approved"}}/>
                <Tab.Screen name="L2Denied" component={L2Denied} options={{title:"Rejected"}}/>
            </Tab.Navigator>
        </>

    );
}

export default L2ApprovalTab