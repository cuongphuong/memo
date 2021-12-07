import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import Viewer from '../ViewComponents/Viewer';
import { ContentRender } from '../Utils/ContentRender';
import List from './List';

export default function QuickSearchTab({ defaultViewObj }) {

    const [mdContent, setMdContent] = useState("No content result ...");
    const [searchResultList, setSearchResultList] = useState([]);
    const [activeId, setActiveId] = useState("");
    const inputObj = useRef(null);
    const typingTimer = useRef(null); // timer identifier 
    let doneTypingInterval = 600;  // time in ms (600ms)

    useEffect(() => {
        let { viewContentObj, setviewContentObj } = defaultViewObj;
        console.log(viewContentObj);
        if (viewContentObj) {
            setMdContent(defaultViewObj.content);

            setSearchResultList(searchResultList => ([...searchResultList, viewContentObj]));
            inputObj.current.value = "id:" + viewContentObj.id;
            setviewContentObj(null);
        }

        inputObj.current.focus();
    }, [defaultViewObj])

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
        setMdContent(source.content);
    }

    return (
        <>
            <Layout.SiderBar>
                <input ref={inputObj} onChange={(evt) => { handleSearchChange(evt) }} type="text" id="pg_mm_search_input" placeholder="Type for search..." />
                <hr />
                <List>
                    {searchResultList.map((item, index) => <List.Item activeId={activeId} handleChooseItem={handleChooseItem} key={index} source={item} />)}
                </List>
            </Layout.SiderBar>
            <Layout.Content>
                <Viewer source={mdContent} />
            </Layout.Content>
        </>
    )
}
