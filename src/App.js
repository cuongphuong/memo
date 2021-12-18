import React from 'react'
import Layout from './LayoutComponents/Layout';
import QuickSearchTab from './LayoutComponents/QuickSearchTab';
import ListTab from './LayoutComponents/ListTab';
import WriterTab from './LayoutComponents/WriterTab';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SettingsTab from './LayoutComponents/SettingsTab';
import { getSingleton as LocalCache } from "./Utils/CacheManager.js";
import StyleSettings from './ViewComponents/StyleSettings';

function App() {
    const menuList = ["Search", "List", "Write"];
    // state
    const [selectedMenu, setSelectedMenu] = React.useState(menuList[0]);
    const viewContentObj = React.useRef(null);
    const editPath = React.useRef(null);
    const setViewContentObj = (obj) => { viewContentObj.current = obj; }

    // Cache
    const CACHE_KEY = "pg_mm_settings";
    const cache = React.useRef(LocalCache(CACHE_KEY));

    React.useEffect(() => {
        // hub.move("main", "fd1/xx.md").then(data => console.log(data));
    }, []);

    function onSubmitSuccess(obj) {
        setViewContentObj(obj);
        // Back to search component
        setSelectedMenu(menuList[0]);
    }

    function onEditFile(filePath) {
        editPath.current = filePath;
        setSelectedMenu(menuList[2]);
    }

    const updateAction = {
        inputPath: editPath.current,
        clearPath: function () {
            editPath.current = null;
        }
    }

    function rederTabView() {
        let items = cache.current.getAll();
        if (cache.current.isExpired() || Object.keys(items).length === 0) {
            return <SettingsTab />;
        }

        switch (selectedMenu) {
            case "Search":
                return <QuickSearchTab defaultPost={viewContentObj.current} />;
            case "List":
                return <ListTab onEdit={onEditFile} />;
            case "Write":
                return <WriterTab updateAction={updateAction} actionSubmit={onSubmitSuccess} />
            case "Settings":
                return <SettingsTab />;
            default:
                return <QuickSearchTab />;
        }
    }

    return (
        <Layout>
            <Layout.Header>
                <Layout.Header.Item
                    key="Settings"
                    selected={selectedMenu}
                    onClick={(title) => setSelectedMenu(title)}
                    title="Settings"
                />

                {menuList.map(item => item !== "Setting" ? (
                    <Layout.Header.Item
                        key={item}
                        selected={selectedMenu}
                        onClick={(title) => setSelectedMenu(title)}
                        title={item}
                    />
                ) : "")}
            </Layout.Header>

            <Layout.FullContent>
                {rederTabView()}
            </Layout.FullContent>
            <NotificationContainer />
            <StyleSettings />
        </Layout>
    );
}

export default App;
