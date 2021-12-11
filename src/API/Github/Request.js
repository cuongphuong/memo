import { StringUtils } from '../../Utils/StringUtils';
import request from './ReuqestSender';
const REPOSITORY_SOURCE = "cuongphuong/memo_data";

export function searchFromGitHub(key) {
    let data = request({
        url: `/search/code?q=${key}+repo:${REPOSITORY_SOURCE}`,
        method: "GET"
    });
    return data;
};

export function readContentByPath(pathToFile) {
    let data = request({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${pathToFile}`,
        method: "GET"
    });
    return data;
};

export async function getAllCategoryList(path) {
    let data = await request({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${path}`,
        method: "GET"
    });

    if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
    }

    let categoryList = [];
    data.forEach(item => {
        if (item.type === "dir" && !StringUtils.isNullOrEmpty(item.name)) {
            categoryList = [...categoryList, item.name];
        }
    });

    return categoryList;
}

export function savePost(data, filePath) {


    return request({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${filePath}`,
        method: "PUT",
        data: JSON.stringify(data)
    });
}