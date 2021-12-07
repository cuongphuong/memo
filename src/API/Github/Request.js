import request from './ReuqestSender';
import { GithubConst } from './GitHubConst';
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

export async function getAllCategoryList() {
    let data = await request({
        url: `/repos/${REPOSITORY_SOURCE}/git/trees/main`,
        method: "GET"
    });

    if (!data || !data.tree || data.tree.length === 0) {
        return [];
    }

    let categoryList = [];
    data.tree.forEach(item => {
        if (item.mode === GithubConst.ST_MODE.DIRECTOTY) {
            categoryList = [...categoryList, item.path];
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