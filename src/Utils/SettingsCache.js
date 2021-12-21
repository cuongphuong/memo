import { getSingleton as LocalCache } from "./CacheManager";

const CACHE_KEY = "pg_mm_settings";
const settingsCache = LocalCache(CACHE_KEY);

const SettingsCache = (function () {

    function getCacheTime() {
        return settingsCache.get("cacheTime");
    }

    return {
        getCacheTime: getCacheTime
    };
})();

export default SettingsCache;