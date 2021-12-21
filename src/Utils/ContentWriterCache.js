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
    }

    function setPath(path) {
        writerCache.add("path", path);
    }

    function getPath() {
        let path = writerCache.get("path");
        if (!path) return "";
        return path;
    }

    return {
        setTitle: setTitle,
        getTitle: getTitle,
        setContent: setContent,
        getContent: getContent,
        releaseCache: releaseCache,
        setPath: setPath,
        getPath: getPath
    };
})();

export default ContentWriterCache;