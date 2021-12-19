let initState = {
    // ListTab.js
    categoryList: [],
    // CategoryList.Block.js
    blockCategoryObj: {}
}

const ListTabReducer = (state = initState, action) => {
    switch (action.type) {
        case 'SET_CATEGORY_LIST': {
            let newCategoryList = [...action.payload];
            return { ...state, categoryList: newCategoryList };
        }
        case 'SET_BLOCK_CATEGORY_OBJECT': {
            let newBlockCategoryObj = { ...action.payload };
            return { ...state, blockCategoryObj: newBlockCategoryObj };
        }
        default:
            return state;
    }
};
export default ListTabReducer;