let initState = {
    mdContent: "", // Content for show on view
    searchResultList: [], // Search result API
    activeId: null, // ActiveId
    searchKeyWord: ""
}

const SearchReducer = (state = initState, action) => {
    switch (action.type) {
        case "SearchReducer/setActiveId": {
            return { ...state, activeId: action.payload };
        }
        case "SearchReducer/setMdContent": {
            return { ...state, mdContent: action.payload };
        }
        case "SearchReducer/setSearchResultList": {
            let searchResultList = [...action.payload];
            return { ...state, searchResultList: searchResultList };
        }
        default:
            return state;
    }
};
export default SearchReducer;