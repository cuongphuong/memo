import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import ViewPopup from './ViewPopup';
import { ContentRender } from '../Utils/ContentRender';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import List from '../ViewComponents/List';
import { setActiveId, setMdContent, setSearchResultList } from '../Actions/SearchReducer';
import SearchHistoryCache from '../Utils/SearchHistoryCache';
import { StringUtils } from '../Utils/StringUtils';
import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import "./QuickSearchTab.css";


function QuickSearchTab(props) {
    // use for control sync process
    const refController = React.useRef(null);
    // const style = useSelector(state => state.style);

    // Logic state
    const dispatch = useDispatch();
    const searchResultList = useSelector(state => state.searchData.searchResultList);
    // const mdContent = useSelector(state => state.searchData.mdContent);
    const activeId = useSelector(state => state.searchData.activeId);

    // UI state
    const [isProcessing, setIsProcessing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [searchCacheList, setSearchCacheList] = useState([]);
    const [isDisplayPopup, setIsDisplayPopup] = React.useState("none");
    const [dataView, setDataView] = React.useState(null);
    const inputObj = useRef(null);
    const typingTimer = useRef(null); // timer identifier 
    let doneTypingInterval = 600;  // time in ms (600ms)

    let { id } = useParams();

    const handleChooseItem = useCallback((source) => {
        dispatch(setActiveId(source.id));
        dispatch(setMdContent(source));
        handleItemClick(source.filePath)
    }, [dispatch])

    useEffect(() => {
        async function searchByPramater() {

            /** Check url search */
            if (StringUtils.isNullOrEmpty(id)) {
                inputObj.current.focus();
                return;
            }

            setIsProcessing(true);
            let path = id;
            path = path.replaceAll("+", "/");
            if (!path.endsWith(".md")) {
                path = path + ".md";
            }

            let contentObject = null;
            try {
                refController.current = new AbortController();
                let signal = refController.current.signal;
                contentObject = await ContentRender.makeContentObject(path, signal);
            } catch (err) {
                console.log(err);
                setIsProcessing(false);
            }

            if (!contentObject) {
                return;
            }

            setIsProcessing(false);
            handleChooseItem(contentObject)

            let tmpList = [];
            dispatch(setSearchResultList([...tmpList, contentObject]));
            dispatch(setActiveId(contentObject.id));
            dispatch(setMdContent(contentObject));
        }

        refController.current = new AbortController();
        // Load cache
        let cacheKeywordList = SearchHistoryCache.getTopKeyWord();
        setSearchCacheList(cacheKeywordList);

        searchByPramater();

        return () => {
            setIsDisplayPopup("none");
            window.history.replaceState("", "", "/memo");
            refController.current.abort();
        }

    }, [dispatch, id, handleChooseItem])

    function handleSearchChange(evt) {
        setInputValue(evt.target.value)
        clearTimeout(typingTimer.current);
        //
        refController.current = new AbortController();
        let signal = refController.current.signal;
        typingTimer.current = setTimeout(function () {
            if (signal.aborted) {
                return;
            }
            dispatch(setSearchResultList([]));
            doneTyping(evt.target.value)
        }, doneTypingInterval);
    }

    async function doneTyping(keyword) {
        refController.current = new AbortController();
        let signal = refController.current.signal;
        // fetch API
        setIsProcessing(true);
        let apiResultContentList = await ContentRender.search(keyword, signal);
        if (apiResultContentList && apiResultContentList.length > 0) {
            SearchHistoryCache.insertKey(keyword);
            dispatch(setSearchResultList(apiResultContentList));

            // if (apiResultContentList.length > 0) {
            //     handleChooseItem(apiResultContentList[0]);
            // }
        }
        setIsProcessing(false);
    }

    // function onEdit(filePath) {
    //     props.onEdit(filePath);
    // }

    // function onDelete(isSuccess) {
    //     if (!isSuccess) {
    //         alert("403 :((");
    //         return;
    //     }

    //     let newSearchList = searchResultList.filter(p => p.id !== mdContent.id);
    //     dispatch(setMdContent(null));
    //     dispatch(setSearchResultList(newSearchList));
    // }

    function renderSearchList() {
        return (
            <>
                {
                    isProcessing ?
                        <div className="pg_mm_search_loadding" style={{ textAlign: "center" }}>
                            <img height="100px"
                                src="/memo/icon/blue_loading.gif"
                                alt="loadding..."
                            />
                        </div>
                        :
                        searchResultList.length > 0 ?
                            <List>
                                {searchResultList.map((item, index) => <List.Item activeId={activeId}
                                    handleChooseItem={handleChooseItem}
                                    key={index}
                                    source={item}
                                />)}
                            </List>
                            :
                            // <img className='unselectable' width="100%" style={{ opacity: 0.9 }}
                            //     src="/memo/icon/empty.png"
                            //     alt="empty"
                            // />
                          ''
                }
            </>
        )
    }

    function handleItemClick(path) {
        setIsDisplayPopup("block");
        ContentRender.makeContentObject(path).then(data => {
            setDataView(data);
        });
    }

    function handleClosePopups() {
        setTimeout(function () {
            setIsDisplayPopup("none");
        }, 100)
        setDataView(null);
    }

    return (
        <div className="pg_mm_amination" style={{ backgroundColor: "#fff" }}>
            <Layout.MiddleContent >

                <div style={{ maxWidth: 900, margin: "0 auto", padding: "10px 5px", backgroundColor: "rgba(246, 246, 246, 1)", minHeight: "calc(100vh - 80px)" }}>
                    {/* <input
                        list="cacheList"
                        style={{ ...style.borderLine, marginBottom: 5 }}
                        ref={inputObj}
                        onChange={(evt) => { handleSearchChange(evt) }}
                        type="text"
                        className="pg_mm_search_input"
                        placeholder="Type for search..."
                    /> */}

                    <div className='input-wrapper'>
                        <input
                            ref={inputObj}
                            onChange={(evt) => { handleSearchChange(evt) }}
                            placeholder="Search something..."
                            value={inputValue}
                            spellCheck={false}
                        />
                        <span className='input-highlight'>
                            {inputValue.replace(/ /g, "\u00a0")}
                        </span>
                    </div>



                    {/* <img onClick={() => inputObj.current.value = ""}
                    style={{ marginTop: 15, marginLeft: 10 }}
                    src='/memo/icon/clear.png'
                    width={25}
                    alt='copy'
                    className='pg_mm_fixed_clearinput'/> */}
                    <datalist id="cacheList">
                        {searchCacheList.map((item, index) => <option key={index} value={item} />)}
                    </datalist>
                    <div style={{ marginTop: '5px' }}></div>


                    {/* // Display search result */}
                    {renderSearchList()}
                </div>

                {/* Popup view */}
                <div className="pg_mm_view_popup_block">
                    <ViewPopup
                        onDelete={(isSuccess) => isSuccess ? setIsDisplayPopup("none") : props.onFailed("Settings")}
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

export default React.memo(QuickSearchTab);