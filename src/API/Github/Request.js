import { RequestAPI as request } from '../../Utils/RequestAPI';
const REPOSITORY_SOURCE = "cuongphuong/memo_data";

// Request config
request.add_config({
    base_url: "https://api.github.com",
    timeout: 10000,
    in_headers: {
        Authorization: "Token *",
        Accept: "application/vnd.github.v3+json",
    }
});


// Export API

/**
 * Search file match keyword result from Github repository
 * @param {String} key Keyword for search code
 * @returns Object Search file and infomation file
 */
export function searchFromGitHub(key) {
    let result = request.exe({
        url: `/search/code?q=${key}+repo:${REPOSITORY_SOURCE}`,
        method: "GET"
    });
    return result;
};

export function readContentByPath(pathToFile) {
    let result = request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${pathToFile}`,
        method: "GET"
    });
    return result;
};

/**
 * Save a file into Git repository
 * @param {Object} data Content of file, encode Base64 
 * @param {String} filePath Path to file location
 * @returns 
 */
export function save(data, filePath) {
    return request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${filePath}`,
        method: "PUT",
        data: JSON.stringify(data)
    });
}