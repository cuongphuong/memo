import { searchFromGitHub, readContentByPath } from "../API/Github/Request";
import { StringUtils } from "./StringUtils";
import { Base64 } from "js-base64";
import { NotificationManager } from 'react-notifications';
export class ContentRender {
    // Delimiter between config and content
    static DEFAULT_DELIMITER = "---";

    /**
     * Get content list from keyword search
     * @param {String} str Keyword for search
     * @returns List of content search
     */
    static async search(str, signal) {
        if (StringUtils.isNullOrEmpty(str)) {
            console.log("Search keyword is empty");
            return;
        }

        let apiResult
        try {
            apiResult = await searchFromGitHub(str, signal);
            let totalCount = apiResult.total_count;

            if (!totalCount) {
                console.log(`No file mapping result key [${str}]`);
                NotificationManager.info(`No file mapping result key [${str}]`);
                return;
            }
        } catch (error) {
            NotificationManager.console.warning("Not response data from API.");
            console.error("Not response data from API.");
            return;
        }

        let items = apiResult.items;
        let pathFileList = new Set();
        let postObjectList = [];

        await Promise.all(items.map(async (item) => {
            if (pathFileList.has(item.path)) {
                return;
            }

            pathFileList.add(item.path);
            let contentObject = await ContentRender.makeContentObject(item.path);
            if (contentObject !== null) {
                postObjectList = [...postObjectList, contentObject];
            }
        }));

        return postObjectList;
    }

    /**
     * Call to github content for get content file from file path
     * @param {String} filePath Path to file on Github
     * @returns Content object from JSON content
     */
    static async makeContentObject(filePath, signal) {
        // Is invalid path
        if (!filePath) {
            return;
        }

        filePath = filePath.trim();
        let apiContentResult = await readContentByPath(filePath, signal);
        let contentObject = {};
        if (apiContentResult && !StringUtils.isNullOrEmpty(apiContentResult.content)) {
            let base64Content = apiContentResult.content;
            let decodeContent = Base64.decode(base64Content);

            // Get index of str delimiter config and content
            let index = decodeContent.indexOf(ContentRender.DEFAULT_DELIMITER, 1);
            if (index === -1) {
                console.log(`Content file ${filePath} is invalid.`)
                return null;
            }
            let cfgAreaStr = decodeContent.substring(0, index + ContentRender.DEFAULT_DELIMITER.length);
            let contentAreaStr = decodeContent.substring(index + ContentRender.DEFAULT_DELIMITER.length);

            let configs = ContentRender.makeConfigFromResult(cfgAreaStr);
            let content = StringUtils.trim(contentAreaStr);
            contentObject = { ...configs, content };
            contentObject = { ...contentObject, filePath: filePath };

            return contentObject;
        } else {
            console.log("Can't load data for " + filePath);
        }
        return null;
    }


    /**
     * Make config object from content file result from API
     * @param {Strng} str Config area from API result to objectt
     * @returns Object configs
     */
    static makeConfigFromResult(str) {
        const regex = /^[a-zA-Z]+:(.*)$/gm;
        let m;

        let configs = {};
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            let mathItems = m[0].split(":");
            let configKey = StringUtils.trim(mathItems[0]);
            let configValue = StringUtils.trim(mathItems[1]);

            configs = { ...configs, [configKey]: configValue };
        }
        return configs;
    }

    /**
     * Get on category level 1 on Github repository
     * @param {String} path path to resource
     * @returns Array All categorys on level 1
     */
    static async getAllCategoryList(path, signal) {
        let result = await readContentByPath(path, signal);
        if (!result || !Array.isArray(result) || result.length === 0) {
            return [];
        }

        let categoryList = [];
        result.forEach(item => {
            if (item.type === "dir" && !StringUtils.isNullOrEmpty(item.name)) {
                categoryList = [...categoryList, item.name];
            }
        });

        return categoryList;
    }

    /**
     * Get file, dir from path resource in Git repository
     * @param {String} path Path to resource for get data
     * @returns Object File and Dir from resource
     */
    static async getAllItemFromPath(path) {
        let result = await readContentByPath(path);

        if (!result || !Array.isArray(result) || result.length === 0) {
            return [];
        }

        let resultObject = {
            itemList: []
        };

        result.forEach(item => {
            if (item.type === "dir" && !StringUtils.isNullOrEmpty(item.name)) {
                resultObject = { ...resultObject, [item.name]: { hasContnent: false } }
            }

            if (item.type === "file" && !StringUtils.isNullOrEmpty(item.name)) {
                resultObject = {
                    ...resultObject, itemList: [...resultObject.itemList, {
                        name: item.name,
                        path: item.path
                    }]
                }
            }
        });
        return resultObject;
    }
}