import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import Viewer from '../ViewComponents/Viewer';
import { ContentRender } from '../Utils/ContentRender';
import List from '../ViewComponents/List';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setActiveId, setMdContent, setSearchResultList } from '../Actions/SearchReducer';
import SearchHistoryCache from '../Utils/SearchHistoryCache';

function QuickSearchTab() {
    // use for control sync process
    const refController = React.useRef(null);
    const style = useSelector(state => state.style);

    // Logic state
    const dispatch = useDispatch();
    const searchResultList = useSelector(state => state.searchData.searchResultList);
    const mdContent = useSelector(state => state.searchData.mdContent);
    const activeId = useSelector(state => state.searchData.activeId);

    // UI state
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchCacheList, setSearchCacheList] = useState([]);
    const inputObj = useRef(null);
    const typingTimer = useRef(null); // timer identifier 
    let doneTypingInterval = 600;  // time in ms (600ms)

    useEffect(() => {
        refController.current = new AbortController();
        inputObj.current.focus();

        // Load cache
        let cacheKeywordList = SearchHistoryCache.getTopKeyWord();
        setSearchCacheList(cacheKeywordList);

        return () => {
            console.log("Clean QuikTabSearch")
            refController.current.abort();
        }
    }, [])

    function handleSearchChange(evt) {
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
        }
        setIsProcessing(false);
    }

    function handleChooseItem(source) {
        dispatch(setActiveId(source.id));
        dispatch(setMdContent(source));
    }

    function renderSearchList() {
        return (
            <>
                {
                    searchResultList.length > 0 ?
                        <List>
                            {searchResultList.map((item, index) => <List.Item activeId={activeId}
                                handleChooseItem={handleChooseItem}
                                key={index}
                                source={item}
                            />)}
                        </List>
                        :
                        <img className='unselectable' width="100%"
                            src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/empty.png"
                            alt="empty"
                        />
                }

                {
                    isProcessing ?
                        <div className="pg_mm_search_loadding">
                            <img height="45px"
                                style={{ position: 'absolute', top: 110 }}
                                src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                                alt="loadding..."
                            />
                        </div>
                        :
                        ''
                }
            </>
        )
    }

    console.log("re-render QuikTabSearch.")
    return (
        <div className="pg_mm_amination">
            <Layout.SiderBar>
                <input
                    list="cacheList"
                    style={style.borderLine}
                    ref={inputObj}
                    onChange={(evt) => { handleSearchChange(evt) }}
                    type="text"
                    className="pg_mm_search_input"
                    placeholder="Type for search..."
                />
                <datalist id="cacheList">
                    {searchCacheList.map((item, index) => <option key={index} value={item} />)}
                </datalist>
                <div style={{ marginTop: '5px' }}></div>
                {renderSearchList()}
            </Layout.SiderBar>
            <Layout.RightContent>
                <Viewer source={mdContent} />
                <div className='pg_mm_logo unselectable'>
                    <img width="350px"
                        src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/logo.png"
                        alt="loadding..."
                    />
                </div>
            </Layout.RightContent>
        </div>
    )
}

export default React.memo(QuickSearchTab);