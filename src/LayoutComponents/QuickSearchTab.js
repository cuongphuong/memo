import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import Viewer from '../ViewComponents/Viewer';
import { ContentRender } from '../Utils/ContentRender';
import List from './List';

//remove the sign
function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export default function QuickSearchTab() {

    const [mdContent, setMdContent] = useState("No content result ...");
    // const [resultList, setResultList] = useState([]);
    const [resultList, setResultList] = useState({});
    const [activeId, setActiveId] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const prevSearchKey = useRef(null);
    const [countKeyword, setCountKeyword] = useState([]);

    // const inputObj = useRef(null);

    let typingTimer;                // timer identifier
    let doneTypingInterval = 600;  // time in ms (600ms)

    // useEffect(() => {
    //     inputObj.current.focus();
    // }, [])

    // function handleSearchChange(evt) {
    //     let searchKeyWord = evt.target.value;
    //     setResultList([]);
    //     clearTimeout(typingTimer);
    //     if (searchKeyWord) {
    //         typingTimer = setTimeout(function () {
    //             doneTyping(evt.target.value)
    //         }, doneTypingInterval);
    //     }
    // }
    useEffect(() => {
        let searchContent = localStorage.getItem("searchContent");
        if (searchContent) {
            let contents = JSON.parse(searchContent);
            setResultList(contents);
        }
    }, [searchKey])

    function handleSearchChange(evt) {
        let searchKeyWord = evt.target.value;
        setSearchKey(searchKeyWord);

        if (prevSearchKey.current) {
            clearTimeout(prevSearchKey.current)
        }

        prevSearchKey.current = setTimeout(() => {
            doneTyping(searchKeyWord);
        }, doneTypingInterval)
    }

    async function doneTyping(keyword) {
        let apiResultContentList = await ContentRender.search(keyword);

        if (apiResultContentList && apiResultContentList.length > 0) {
            const key = { [keyword]: [...apiResultContentList], ...resultList };
            setResultList(key);
            localStorage.setItem("searchContent", JSON.stringify(key));

            //countKeyword
            let count = [...countKeyword];
            count.push(keyword);
            setCountKeyword(count);
        }
    }

    function handleChooseItem(source) {
        setActiveId(source.id);
        setMdContent(source.content);
    }

    return (
        <>
            <Layout.SiderBar>
                {/* <input ref={inputObj} onChange={(evt) => { handleSearchChange(evt) }} type="text" id="pg_mm_search_input" placeholder="Type for search..." /> */}
                <input value={searchKey} onChange={(evt) => { handleSearchChange(evt) }} type="text" id="pg_mm_search_input" placeholder="Type for search..." />
                <hr />
                <List>
                    {resultList[searchKey]?.map((item, index) => <List.Item activeId={activeId} handleChooseItem={handleChooseItem} key={index} source={item} />)}
                </List>

            </Layout.SiderBar>
            <Layout.Content>
                <Viewer source={mdContent} />
            </Layout.Content>
        </>
    )
}
