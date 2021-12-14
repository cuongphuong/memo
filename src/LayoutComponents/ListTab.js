import React from 'react';
import Layout from './Layout';
import CategoryList from '../ViewComponents/CategoryList';
import ViewPopup from './ViewPopup';
import { ContentRender } from '../Utils/ContentRender';

export default function ListTab() {
    // use for control sync process
    const refController = React.useRef(null);
    //
    const [categoryList, setCategoryList] = React.useState([]);
    const [isDisplayPopup, setIsDisplayPopup] = React.useState("none");
    const [dataView, setDataView] = React.useState(null);

    React.useEffect(() => {
        refController.current = new AbortController();
        let signal = refController.current.signal;
        // fetch API
        ContentRender.getAllCategoryList("").then(data => {
            if (signal.aborted) {
                return;
            }
            setCategoryList(data);
        }).catch(error => {
            console.log(error);
        });

        return () => {
            setDataView(null);
            refController.current.abort();
        }
    }, []);

    function handleItemClick(path) {
        setIsDisplayPopup("block");
        ContentRender.makeContentObject(path).then(data => {
            setDataView(data);
        });
    }

    function handleClosePopups() {
        setTimeout(function () {
            setIsDisplayPopup("none");
        }, 300)
        setDataView(null);
    }

    return (
        <div className="pg_mm_amination">
            <Layout.MiddleContent >
                <CategoryList>
                    {categoryList.map((categoryName, index) => <CategoryList.Block
                        handleItemClick={handleItemClick}
                        key={index}
                        name={categoryName}
                    />)}
                </CategoryList>
                <div className="pg_mm_view_popup_block">
                    <ViewPopup onClose={handleClosePopups} source={dataView} display={isDisplayPopup} />
                </div>
            </Layout.MiddleContent >
        </div>
    )
}
