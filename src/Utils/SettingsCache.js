import { getSingleton as LocalCache } from "./CacheManager";

const CACHE_KEY = "pg_mm_settings";
const settingsCache = LocalCache(CACHE_KEY);

const SettingsCache = (function () {

    function getCacheTime() {
        if (settingsCache.has("cacheTime"))
            return settingsCache.get("cacheTime");
        else
            return 1200000;
    }

    function setCacheTimeMinute(cacheTime) {
        settingsCache.add("cacheTime", (cacheTime * 60000));
    }

    function getUrlRepository() {
        if (settingsCache.has("urlRepository"))
            return settingsCache.get("urlRepository");
        else
            return "https://github.com/cuongphuong/memo_data";
    }

    function setUrlRepository(urlRepository) {
        settingsCache.add("urlRepository", urlRepository);
    }

    function getRequestTimeout() {
        if (settingsCache.has("requestTimeout"))
            return settingsCache.get("requestTimeout");
        else
            return 5000;
    }

    function setRequestTimeout(requestTimeout) {
        settingsCache.add("requestTimeout", requestTimeout);
    }

    function getAccessKey() {
        if (settingsCache.has("accessKey"))
            return settingsCache.get("accessKey");
        else
            return null;
    }

    function setAccessKey(accessKey) {
        settingsCache.add("accessKey", accessKey);
    }

    function getUserName() {
        if (settingsCache.has("userName"))
            return settingsCache.get("userName");
        else
            return null;
    }

    function setUserName(userName) {
        settingsCache.add("userName", userName);
    }

    function getEmail() {
        if (settingsCache.has("email"))
            return settingsCache.get("email");
        else
            return null;
    }

    function setEmail(email) {
        settingsCache.add("email", email);
    }

    function getCacheMinutes() {
        let millis = getCacheTime();
        if (!millis) return 0;
        return (millis / 60000).toFixed();
    }

    function setTheme(theme) {
        settingsCache.add("theme", theme);
    }

    function getTheme() {
        if (settingsCache.has("theme"))
            return settingsCache.get("theme");
        else
            return "tomato";
    }

    function getAvatarUrl() {
        if (settingsCache.has("avatar"))
            return settingsCache.get("avatar");
        else
            return null;
    }

    function setAvatarUrl(url) {
        settingsCache.add("avatar", url);
    }

    function releaseCache() {
        settingsCache.clear();
    }

    return {
        getCacheTime: getCacheTime,
        setCacheTimeMinute: setCacheTimeMinute,
        getUrlRepository: getUrlRepository,
        getRequestTimeout: getRequestTimeout,
        setUrlRepository: setUrlRepository,
        setRequestTimeout: setRequestTimeout,
        getAccessKey: getAccessKey,
        setAccessKey: setAccessKey,
        getUserName: getUserName,
        setUserName: setUserName,
        getEmail: getEmail,
        setEmail: setEmail,
        getCacheMinutes: getCacheMinutes,
        setTheme: setTheme,
        getTheme: getTheme,
        setAvatarUrl: setAvatarUrl,
        getAvatarUrl: getAvatarUrl,
        releaseCache: releaseCache
    };
})();

export default SettingsCache;