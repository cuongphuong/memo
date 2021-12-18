import * as request from "../API/Github/Request";
import { StringUtils } from "./StringUtils";

/**
 * Get all infomation from path resource
 * @param {String} path Path to resource
 * @returns Object
 */
export function readContent(path) {
    return request.readContentByPath(path);
}

/**
 * Save a file into Git repository
 * @param {Object} data Content of file, encode Base64
 * @param {String} filePath Path to file location
 * @returns
 */
export function create(data = {
    message: 'Add file',
    content: 'KEVtcHR5KQ==', // (Empty)
}, filePath) {
    return request.save(data, filePath);
}

/**
 * Update content of file in Github
 * @param {Object} data Content of file, encode Base64
 * @param {String} filePath Path to file location
 * @returns
 */
export async function update(data = {
    message: 'Add file',
    content: 'KEVtcHR5KQ==', // (Empty)
}, filePath) {

    // Get last SHA version on Github
    let dataAPI = await request.readContentByPath(filePath);
    if (dataAPI === null) return;
    let lastSha = dataAPI.sha;
    data.sha = lastSha;
    return request.updateContent(data, filePath);
}

/**
 * Delete a file 
 * @param {String} filePath path to file will delete
 */
export function deleteFile(filePath) {
    return move("main", filePath);
}

/**
 * Move || remove a file to a new location
 * @param {String} branch master 
 * @param {String} path 
 * @param {String} newPath not existed then remove path
 * @returns true if move successfully
 */
export async function move(branch = "main", path, newPath) {
    // Get last SHA of main branch
    let latestCommit = await request.getRef("heads/main");
    // Get tree by last SHA
    let tree = await request.getTree(latestCommit + '?recursive=true');
    // Update tree
    tree.forEach(function (ref) {
        if ((!newPath || StringUtils.isNullOrEmpty(newPath)) && ref.path === path) {
            ref.isDeleted = true;
        } else {
            if (ref.path === path) ref.path = newPath;
        }

        if (ref.type === "tree") {
            ref.isDeleted = true;
        }
    });

    tree = tree.filter(p => !p.isDeleted);
    // Post update tree to API
    let rootTree = await request.postTree(tree);
    // Create a commit
    let commit_msg = (!newPath || StringUtils.isNullOrEmpty(newPath))
        ? "Remove " + path
        : "Move " + path + " to " + newPath;
    let commit = await request.commit(latestCommit, rootTree, commit_msg);
    // Update HEAD to new commit
    let result = await request.updateHead(branch, commit);
    return result != null;
}