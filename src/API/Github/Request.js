import request from './ReuqestSender';

export function searchFromGitHub(key) {
    var data = request({
        // url: `/search/code?q=${key}+repo:cuongphuong/memo_data`,
        url: `/search/code?q=${key}`,
        method: "GET"
    });
    return data;
};
