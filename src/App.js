import React from 'react'
import Layout from './LayoutComponents/Layout';
import QuickSearchTab from './LayoutComponents/QuickSearchTab';
import ListTab from './LayoutComponents/ListTab';
import WriterTab from './LayoutComponents/WriterTab';
import { NotificationContainer } from 'react-notifications';

import 'react-notifications/lib/notifications.css';

function App() {
    const menuList = ["Search", "List", "Write"];
    // state
    const [selectedMenu, setSelectedMenu] = React.useState(menuList[0]);
    const viewContentObj = React.useRef(null);
    const setViewContentObj = (obj) => { viewContentObj.current = obj; }

    React.useEffect(() => {

    }, []);

    function onSubmitSuccess(obj) {
        setViewContentObj(obj);
        // Back to search component
        setSelectedMenu(menuList[0]);
    }

    function rederTabView() {
        switch (selectedMenu) {
            case "Search":
                return <QuickSearchTab defaultPost={viewContentObj.current} />
            case "List":
                return <ListTab />
            case "Write":
                return <WriterTab actionSubmit={onSubmitSuccess} />
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
