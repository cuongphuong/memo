export const setCategoryList = (categoryList) => {
    return {
        type: "SET_CATEGORY_LIST",
        payload: categoryList
    }
}

export const setBlockCategoryObject = (categoryObject) => {
    return {
        type: "SET_BLOCK_CATEGORY_OBJECT",
        payload: categoryObject
    }
}