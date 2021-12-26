import React from 'react';
import Layout from './Layout';
import CategoryList from '../ViewComponents/CategoryList';
import ViewPopup from './ViewPopup';
import { ContentRender } from '../Utils/ContentRender';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCategoryList } from '../Actions/ListTabReducer';
import CategoryListCache from '../Utils/CategoryListCache';
import * as request from '../API/Github/Request';
import SettingsCache from '../Utils/SettingsCache';

export default function ListTab(props) {
    const dispatch = useDispatch();
    //
    const categoryList = useSelector(state => state.listTabData.categoryList);
    const [isDisplayPopup, setIsDisplayPopup] = React.useState("none");
    const [dataView, setDataView] = React.useState(null);
    const [isLoadding, setIsLoadding] = React.useState(false);

    async function fetchTreesList(callback = function (trees) { }) {
        let latestCommit = await request.getRef("heads/main");
        let trees = await request.getTree(latestCommit + '?recursive=true');
        callback(trees);
    }

    React.useEffect(() => {
        // Checking cache
        if (!CategoryListCache.isCached()) {
            setIsLoadding(true);
            fetchTreesList(function (trees) {
                // Re-update cache
                CategoryListCache.setOrUpdateCache(trees);
                dispatch(setCategoryList(CategoryListCache.getMainCategory()));
                setIsLoadding(false);
            });
        }

        let mainCategoryList = CategoryListCache.getMainCategory();
        dispatch(setCategoryList(mainCategoryList));
        return () => {
            setDataView(null);
        }
    }, [dispatch]);

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

    function handleReloadDataCache() {
        CategoryListCache.setOrUpdateCache(null);
        setIsLoadding(true);
        dispatch(setCategoryList([]));
        fetchTreesList(function (trees) {
            // Re-update cache
            setTimeout(function () {
                CategoryListCache.setOrUpdateCache(trees);
                dispatch(setCategoryList(CategoryListCache.getMainCategory()));
                setIsLoadding(false);
            }, 500);
        });
    }

    function loadding() {
        if (isLoadding) {
            return (
                <img className='pg_mm_list_loadding unselectable' width="50px"
                    src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                    alt="empty"
                />
            )
        }
    }

    return (
        <div className="pg_mm_amination">
            {loadding()}
            <Layout.MiddleContent >
                <span
                    onClick={handleReloadDataCache}
                    className='pg_mm_reload_button'>
                    Reload (Caching {SettingsCache.getCacheMinutes()} minutes)
                </span>
                <CategoryList>
                    {categoryList.map((categoryName, index) => <CategoryList.Block
                        handleItemClick={handleItemClick}
                        key={index}
                        name={categoryName}
                    />)}
                </CategoryList>
                <div className="pg_mm_view_popup_block">
                    <ViewPopup
                        onDelete={() => setIsDisplayPopup("none")}
                        onEdit={(filePath) => props.onEdit(filePath)}
                        onClose={handleClosePopups}
                        source={dataView}
                        display={isDisplayPopup}
                    />
                </div>
            </Layout.MiddleContent >
        </div>
    )
}
