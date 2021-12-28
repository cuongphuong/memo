import { getSingleton as LocalCache } from "./CacheManager";

const CACHE_KEY = "pg_mm_content_writer";
const writerCache = LocalCache(CACHE_KEY);

const ContentWriterCache = (function () {

    function setTitle(title) {
        writerCache.add("title", title);
    }

    function getTitle() {
        let title = writerCache.get("title");
        if (!title) return "";
        return title;
    }

    function setContent(content) {
        writerCache.add("content", content);
    }

    function getContent() {
        let content = writerCache.get("content");
        if (!content) return "";
        return content;
    }

    function releaseCache() {
        writerCache.add("title", "");
        writerCache.add("content", "");
        writerCache.add("path", "");
        writerCache.add("isUpdate", false);
    }

    function setPath(path) {
        writerCache.add("path", path);
    }

    function getPath() {
        let path = writerCache.get("path");
        if (!path) return "";
        return path;
    }

    function getCategory() {
        let path = writerCache.get("path");
        if (!path) return "";

        if (!path.includes("/")) return "";

        return path.replace(/\/[^/]+.md/gm, "");
    }

    function setIsUpdate(isUpdate) {
        writerCache.add("isUpdate", isUpdate);
    }

    function isUpdate() {
        let isUpdate = writerCache.get("isUpdate");
        if (!isUpdate) return false;
        return isUpdate;
    }

    return {
        setTitle: setTitle,
        getTitle: getTitle,
        setContent: setContent,
        getContent: getContent,
        releaseCache: releaseCache,
        setPath: setPath,
        getPath: getPath,
        getCategory: getCategory,
        setIsUpdate: setIsUpdate,
        isUpdate: isUpdate
    };
})();

export default ContentWriterCache;