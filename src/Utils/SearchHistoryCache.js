import { getSingleton as LocalCache } from "./CacheManager";

const SEARCH_CACHE_KEY = "pg_mm_search";
const searchCache = LocalCache(SEARCH_CACHE_KEY, null);

const SearchHistoryCache = (function () {
    function getTopKeyWord() {
        let allItem = searchCache.getAll();
        let keysSorted = Object.keys(allItem).sort(function (a, b) {
            return allItem[b] - allItem[a]
        });
        return keysSorted;
    }

    function insertKey(key) {
        let allItem = searchCache.getAll();
        if (Object.keys(allItem).length >= 10) {
            removeMinItem(allItem);
        }

        if (searchCache.has(key)) {
            let value = searchCache.get(key);
            searchCache.add(key, ++value);
        } else {
            searchCache.add(key, 1);
        }
    }

    function removeMinItem(allItem) {
        let keysSorted = Object.keys(allItem).sort(function (a, b) {
            return allItem[a] - allItem[b]
        });
        console.log(keysSorted[0]);
        searchCache.del(keysSorted[0]);
    }

    return {
        getTopKeyWord: getTopKeyWord,
        insertKey: insertKey
    };
})();

export default SearchHistoryCache;