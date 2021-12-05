import React, { useEffect, useState } from 'react'
import Layout from './LayoutComponents/Layout';
import QuickSearchTab from './LayoutComponents/QuickSearchTab';
import ListTab from './LayoutComponents/ListTab';
import WriterTab from './LayoutComponents/WriterTab';

function App() {

    useEffect(() => {

    }, [])

    const [tabIndex, setTabIndex] = useState("Search");

    function rederTabView() {
        switch (tabIndex) {
            case "Search":
                return <QuickSearchTab />
            case "List":
                return <ListTab />
            case "Write":
                return <WriterTab />
            default:
                return <QuickSearchTab />
        }
    }

    return (
        <Layout>
            <Layout.Header>
                <Layout.Header.Item onPress={(title) => setTabIndex(title)} title="Search" />
                <Layout.Header.Item onPress={(title) => setTabIndex(title)} title="List" />
                <Layout.Header.Item onPress={(title) => setTabIndex(title)} title="Write" />
            </Layout.Header>

            {rederTabView()}
        </Layout>
    );
}

export default App;
