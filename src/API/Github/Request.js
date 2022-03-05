import { RequestAPI as request } from '../../Utils/RequestAPI';
import { StringUtils } from '../../Utils/StringUtils';
import SettingsCache from '../../Utils/SettingsCache';

const REPOSITORY_SOURCE = SettingsCache.getUrlRepository().replaceAll("https://github.com/", "");
const TIME_OUT = SettingsCache.getRequestTimeout();
const TOKEN_KEY = SettingsCache.getAccessKey();
const USE_NAME = SettingsCache.getUserName();
const E_MAIL = SettingsCache.getEmail();

let config = {
    base_url: "https://api.github.com",
    timeout: TIME_OUT,
    in_headers: {
        Accept: "application/vnd.github.v3+json",
    }
};

if (TOKEN_KEY && !StringUtils.isNullOrEmpty(TOKEN_KEY)) {
    config = {
        ...config,
        in_headers: {
            ...config.in_headers,
            Authorization: "Token " + TOKEN_KEY
        }
    }
}

// Request config
request.add_config(config);

const author = {
    name: USE_NAME,
    email: E_MAIL
}

// Export API
/**
 * Search file match keyword result from Github repository
 * @param {String} key Keyword for search code
 * @returns Object Search file and infomation file
 */
export async function searchFromGitHub(key, signal) {
    let result = await request.exe({
        url: `/search/code?q=${key}+repo:${REPOSITORY_SOURCE}`,
        method: "GET",
        signal: signal
    }).catch(err => {
        console.log(err);
        return [];
    });

    return result;
};

/**
 * Get all infomation from path resource
 * @param {String} path Path to resource
 * @returns Object
 */
export async function readContentByPath(path, signal) {
    let result = await request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${path}`,
        method: "GET",
        signal: signal
    }).catch(err => {
        throw err;
    });

    return result;
};

/**
 *  Get user information from Github
 * @param username
 * @returns tree 
 */
export async function getUser(username) {
    var url = username ? '/users/' + username : '/user';
    let result = await request.exe({
        url: url,
        method: "GET",
    }).catch(err => {
        return null;
    });

    return result;
};

/**
 * Save a file into Git repository
 * @param {Object} data Content of file, encode Base64 
 * @param {String} filePath Path to file location
 * @returns 
 */
export function save(data = {
    message: 'Add file',
    content: 'KEVtcHR5KQ==', // (Empty)
}, filePath) {
    return request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${filePath}`,
        method: "PUT",
        data: JSON.stringify(data)
    });
}

/**
 * Update content of file in Github
 * @param {Object} data Content of file, encode Base64 
 * @param {String} filePath Path to file location
 * @returns 
 */
export function updateContent(data = {
    message: 'Update content', // (Empty)
    content: 'KEVtcHR5KQ==',
    sha: ''
}, filePath) {
    return request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/contents/${filePath}`,
        method: "PUT",
        data: JSON.stringify(data)
    });
}

/**
 * Get a particular reference
 * @param {*} ref heads/branch
 * @returns sha
 */
export async function getRef(ref = "heads/main") {
    // repos/cuongphuong/memo_data/git/refs/heads/main
    let result = await request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/git/refs/${ref}`,
        method: "GET"
    });

    return result.object.sha;
};

/**
 * Retrieve the tree a commit points to
 * @param {String} sha  ex: 76ba6ba67867c6069cbb9c377a0a2c909145c778?recursive=true
 * @returns tree 
 */
export async function getTree(sha = "") {
    // repos/cuongphuong/memo_data/git/trees/76ba6ba67867c6069cbb9c377a0a2c909145c778
    let result = await request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/git/trees/${sha}`,
        method: "GET"
    });

    return result.tree;
};

/**
 *  Post a new tree object having a file path pointer replaced with a new blob SHA getting a tree SHA back
 * @param {Array} tree  Tree
 * @returns tree 
 */
export async function postTree(tree, base_tree) {
    if (!tree) return;

    let payload = { tree: tree };

    if (base_tree) payload = { ...payload, base_tree: base_tree }

    let result = await request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/git/trees`,
        method: "POST",
        data: JSON.stringify(payload)
    });
    return result.sha;
};

/**
 * Create a new commit object with the current commit SHA as the parent and the new tree SHA, getting a commit SHA back
 * 
 */
export async function commit(parent, tree, message) {
    let userData = getUser(author.name);
    if (!userData) return;
    let data = {
        message: message,
        author: author,
        parents: [
            parent
        ],
        tree: tree
    }

    let result = await request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/git/commits`,
        method: 'POST',
        data: JSON.stringify(data)
    }).catch(err => {
        return null;
    });
    return result.sha;
}

export async function updateHead(head, commit) {
    let result = await request.exe({
        url: `/repos/${REPOSITORY_SOURCE}/git/refs/heads/` + head,
        method: 'PATCH',
        data: JSON.stringify({
            sha: commit
        })
    }).catch(err => {
        return null;
    });
    return result;
}
