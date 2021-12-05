import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import Viewer from '../ViewComponents/Viewer';
import { ContentRender } from '../Utils/ContentRender';
import List from './List';

export default function QuickSearchTab() {

    const [mdContent, setMdContent] = useState("No content result ...");
    const [resultList, setResultList] = useState([]);
    const [activeId, setActiveId] = useState("");
    const inputObj = useRef(null);

    let typingTimer;                // timer identifier
    let doneTypingInterval = 1000;  // time in ms (600ms)

    useEffect(() => {
        inputObj.current.focus();
    }, [])

    function handleSearchChange(evt) {
        let searchKeyWord = evt.target.value;
        setResultList([]);
        clearTimeout(typingTimer);
        if (searchKeyWord) {
            typingTimer = setTimeout(function () {
                doneTyping(evt.target.value)
            }, doneTypingInterval);
        }
    }

    async function doneTyping(keyword) {
        let apiResultContentList = await ContentRender.search(keyword);
        if (apiResultContentList && apiResultContentList.length > 0) {
            setResultList(apiResultContentList);
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
                    {resultList.map((item, index) => <List.Item activeId={activeId} handleChooseItem={handleChooseItem} key={index} source={item} />)}
                </List>
            </Layout.SiderBar>
            <Layout.Content>
                <Viewer source={mdContent} />
            </Layout.Content>
        </>
    )
}
