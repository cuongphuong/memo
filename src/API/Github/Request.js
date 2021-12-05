import request from './ReuqestSender';
const REPOSITORY_SOURCE = "cuongphuong/memo_data";

export function searchFromGitHub(key) {
    var data = request({
        url: `/search/code?q=${key}+repo:${REPOSITORY_SOURCE}`,
        method: "GET"
    });
    return data;
};

export function readContentByPath(pathToFile) {
    var data = request({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${pathToFile}`,
        method: "GET"
    });
    return data;
};
