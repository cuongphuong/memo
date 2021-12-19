export const setActiveId = (activeId) => {
    return {
        type: "SearchReducer/setActiveId",
        payload: activeId
    }
}

export const setMdContent = (mdContent) => {
    return {
        type: "SearchReducer/setMdContent",
        payload: mdContent
    }
}

export const setSearchResultList = (searchResultList) => {
    return {
        type: "SearchReducer/setSearchResultList",
        payload: searchResultList
    }
}