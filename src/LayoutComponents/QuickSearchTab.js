import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import Viewer from '../ViewComponents/Viewer';
import { ContentRender } from '../Utils/ContentRender';
import List from './List';

function QuickSearchTab(props) {

    const [mdContent, setMdContent] = useState("No content result ...");
    const [searchResultList, setSearchResultList] = useState([]);
    const [activeId, setActiveId] = useState("");
    const inputObj = useRef(null);
    const typingTimer = useRef(null); // timer identifier 
    let doneTypingInterval = 600;  // time in ms (600ms)

    useEffect(() => {

        // Set default view data if existed
        if (props.defaultPost) {
            setSearchResultList((searchResultList) => [...searchResultList, props.defaultPost]);
            setMdContent(props.defaultPost);
        }

        inputObj.current.focus();
        return () => {

        }
    }, [props])


    function handleSearchChange(evt) {
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(function () {
            setSearchResultList([]);
            doneTyping(evt.target.value)
        }, doneTypingInterval);
    }

    async function doneTyping(keyword) {
        let apiResultContentList = await ContentRender.search(keyword);
        if (apiResultContentList && apiResultContentList.length > 0) {
            setSearchResultList(apiResultContentList);
        }
    }

    function handleChooseItem(source) {
        setActiveId(source.id);
        setMdContent(source);
    }


    console.log("Re-render QuickTabSearch");
    return (
        <div className="pg_mm_amination">
            <Layout.SiderBar>
                <input
                    ref={inputObj}
                    onChange={(evt) => { handleSearchChange(evt) }}
                    type="text"
                    className="pg_mm_search_input"
                    placeholder="Type for search..."
                />
                <div style={{ marginTop: '5px' }}></div>
                <List>
                    {searchResultList.map((item, index) => <List.Item activeId={activeId} handleChooseItem={handleChooseItem} key={index} source={item} />)}
                </List>
            </Layout.SiderBar>
            <Layout.RightContent>
                <Viewer source={mdContent} />
            </Layout.RightContent>
        </div>
    )
}

export default React.memo(QuickSearchTab);