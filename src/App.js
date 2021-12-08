import React, { useEffect, useState } from 'react'
import Layout from './LayoutComponents/Layout';
import QuickSearchTab from './LayoutComponents/QuickSearchTab';
import ListTab from './LayoutComponents/ListTab';
import WriterTab from './LayoutComponents/WriterTab';
import { NotificationContainer } from 'react-notifications';

import 'react-notifications/lib/notifications.css';

function App() {
    const menuList = ["Search", "List", "Write"];
    // state
    const [viewContentObj, setViewContentObj] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(menuList[0]);

    useEffect(() => {

    }, [])

    function onSubmitSuccess(obj) {
        setViewContentObj(obj);
        setSelectedMenu(menuList[0]);
    }

    function rederTabView() {
        switch (selectedMenu) {
            case "Search":
                return <QuickSearchTab props={{ viewContentObj, setViewContentObj }} />
            case "List":
                return <ListTab />
            case "Write":
                return <WriterTab onSubmitSuccess={onSubmitSuccess} />
            default:
                return <QuickSearchTab />
        }
    }

    return (
        <Layout>
            <Layout.Header>
                {menuList.map(item => <Layout.Header.Item
                    key={item}
                    selected={selectedMenu}
                    onClick={(title) => setSelectedMenu(title)}
                    title={item}
                />)}
            </Layout.Header>

            <Layout.FullContent>
                {rederTabView()}
            </Layout.FullContent>
            <NotificationContainer />
        </Layout>
    );
}

export default App;
