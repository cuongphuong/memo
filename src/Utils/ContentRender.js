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
    static async search(str) {
        if (StringUtils.isNullOrEmpty(str)) {
            console.log("Search keyword is empty");
            return;
        }

        let apiResult
        try {
            apiResult = await searchFromGitHub(str);
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
    static async makeContentObject(filePath) {
        // Is invalid path
        if (!filePath) {
            return;
        }

        let apiContentResult = await readContentByPath(filePath);
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

            return contentObject;
        }
        return null;
    }


    /**
     * 
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
}