import React from 'react'

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

    function handleClick() {
        handleChooseItem(source);
    }

    function isActive() {
        if (activeId === source.id) {
            return true;
        }
        return false;
    }

    return (
        <div className={isActive() ? "pg_mm_list_item pg_mm_list_item_active" : "pg_mm_list_item"} onClick={handleClick}>
            <h3 className="pg_mm_trunc">{source.title}</h3>
            <p className="pg_mm_trunc">{source.content}</p>
            <div className="pg_mm_list_item_info">
                <span className="pg_mm_trunc">{`id:${source.id}`}</span>
                <span className="pg_mm_trunc"><span>{source.category}</span></span>
            </div>
        </div>
    )
}

List.Item = ListItem;
export default List;