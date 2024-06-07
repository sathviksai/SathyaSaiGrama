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
            <HeaderWithSearch search={search} setSearch={setSearch} />
            <Tab.Navigator>
                <Tab.Screen name="Pending" component={Pending} />
                <Tab.Screen name="Approved" component={Approved} />
                <Tab.Screen name="Denied" component={Denied} />
            </Tab.Navigator>
        </>

    );
}

export default ApprovalTab