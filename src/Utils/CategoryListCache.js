import { getSingleton as LocalCache } from "./CacheManager";
import SettingsCache from "./SettingsCache";
import { StringUtils } from "./StringUtils";

const CATEGORY_CACHE_KEY = "pg_mm_category_cache";
let categoryCache = LocalCache(CATEGORY_CACHE_KEY, SettingsCache.getCacheTime());
console.log("Category Cache Time: ", SettingsCache.getCacheTime());

const CategoryListCache = (function () {

    /**
     * Check category is cached
     * @returns true if has item in cache
     */
    function isCached() {
        let trees = categoryCache.get("tree");
        return trees && trees.length > 0;
    }

    /**
     * Store trees from Github API into cache
     * @param {Arrays} trees Using fetch tree Github API
     */
    function setOrUpdateCache(trees) {
        categoryCache.add("tree", trees);
    }

    /**
     * Make main category list (root) from trees list
     * @returns {Arrays} mainCategoryList 
     */
    function getMainCategory() {
        let trees = categoryCache.get("tree");
        if (!trees) return [];

        let mainCategoryList = trees.filter(p => isMainCategory(p));
        return mainCategoryList.map(p => p.path);
    }

    /**
   * Make category list from input path in trees list
   * @returns {Arrays} categoryList 
   */
    function getElementByPath(path) {
        let trees = categoryCache.get("tree");
        if (!trees) return [];

        let categoryList = trees.filter(p => isExistedInPath(p, path));
        return makeOutputList(categoryList);
    }

    // Private method
    function isMainCategory(element) {
        return !element.path.includes("/") && element.type === "tree";
    }

    function isExistedInPath(element, path) {
        let elementPath = element.path;

        if (!elementPath.startsWith(path)) {
            return false;
        }

        elementPath = elementPath.replace(path, "");
        if (elementPath.startsWith("/")) {
            elementPath = elementPath.substring(1, elementPath.length);
        }

        if (StringUtils.isNullOrEmpty(elementPath) || elementPath.includes("/")) {
            return false;
        }
        return true;
    }

    function makeOutputList(list) {
        let categoryList = [];

        list.forEach(element => {
            let pathList = element.path.split("/");

            let item = {
                name: pathList[pathList.length - 1], // last item
                path: element.path,
                type: element.type === "tree" ? "dir" : "file"
            }
            categoryList = [...categoryList, item];
        });

        return categoryList;
    }

    function updateDataIntoPath(path, newDataList) {
        let correctPath = path + "/";
        let trees = categoryCache.get("tree");
        if (!trees) trees = [];

        let newTree = trees.filter(p => !p.path.startsWith(correctPath));
        newDataList.forEach(element => {
            newTree.push({
                mode: "",
                path: element.path,
                sha: "",
                type: element.type === "dir" ? "tree" : "blob",
                url: ""
            });
        });

        setOrUpdateCache(newTree);
    }

    return {
        isCached: isCached,
        setOrUpdateCache: setOrUpdateCache,
        getMainCategory: getMainCategory,
        getElementByPath: getElementByPath,
        updateDataIntoPath: updateDataIntoPath
    };
})();

export default CategoryListCache;