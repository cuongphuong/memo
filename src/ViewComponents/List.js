import React from 'react'
// import { useSelector } from 'react-redux';
const removeMd = require('remove-markdown');

function List({ children }) {
    return (
        <div className="pg_mm_list">
            {children}
        </div>
    )
}

function ListItem({ source = {
    title: "n/a",
    content: "n/a",
    id: "n/a",
    category: "n/a"
}, handleChooseItem, activeId }) {
    // const style = useSelector(state => state.style);

    function handleClick() {
        handleChooseItem(source);
    }

    function isActive() {
        if (activeId === source.id) {
            return true;
        }
        return false;
    }

    // function truncPathListItem(strPath) {
    //     // let tmpPathList = strPath.split("/");
    //     // tmpPathList = tmpPathList.filter(p => !StringUtils.isNullOrEmpty(p));
    //     // return tmpPathList.pop();
    //     return strPath;
    // }

    return (
        <div
            // style={isActive() ? style.borderLineHover : {}}
            style={{ padding: 10, margin: 5 }}
            className={isActive() ? "pg_mm_list_item pg_mm_list_item_active" : "pg_mm_list_item"}
            onClick={handleClick}
        >
            <h3 style={{ color: "hsl(210,8%,25%)", fontSize: 17 }} className="pg_mm_trunc">{source.title}</h3>
            <p className="pg_mm_trunc" style={{ fontSize: 16, lineHeight: 1.5 }}>{removeMd(source.content).replace(/(?:\r\n|\r|\n)/g, ' ')}</p>
            {/* <div className="pg_mm_list_item_info">
                <span
                    style={style.category}
                    className="pg_mm_trunc">{truncPathListItem(source.category)}
                </span>
            </div> */}
        </div>
    )
}

List.Item = ListItem;
export default List;