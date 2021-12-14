class CacheManager {
    constructor(key, expire = 1200) {
        this.key = key;
        this.expire = expire;
        this.items = this.getAll();
    }

    add(key, value) {
        if (key && !this.has(key)) {
            this.items = { ...this.items, [key]: value }
            console.log('[CacheManager] add: ', key, this.items);
        }
        this.store();
    }

    del(key) {
        if (key) {
            delete this.items[key];
        }
        this.store();
    }

    has(key) {
        return cache.hasOwnProperty(key);
    }

    store() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
        localStorage.setItem(this.key + ':ts', Date.now());
    }

    getAll() {
        let stored = localStorage.getItem(this.key);
        return (this.isExpired() || !stored) ?
            {} :
            JSON.parse(stored);
    }

    isExpired() {
        let whenCached = localStorage.getItem(this.key + ':ts')
        let age = (Date.now() - whenCached) / 1000
        console.log('[CacheManager] is Expired', age > this.expire);
        if (age > this.expire) {
            this.clear();
            return true;
        } else {
            return false;
        }
    }

    clear() {
        localStorage.removeItem(this.key)
        localStorage.removeItem(this.key + ':ts')
    }
}

/**
 * Caches objects as singletons. Alternative, can ignore this.items and just load
 * always from localStorage.
 * @type {Object}
 */

let cache = {};
/**
 * [getSingleton description]
 * @method getSingleton
 * @param  {string}     key           Key for localStorage
 * @param  {Number}     [expire=1200] Expiration time in seconds
 * @param  {String}     [sep=',']     separator in case. Default: ,
 * @return {CacheManager}             A singleton of CacheCollection
 */
function getSingleton(key, expire = 1200) {
    if (!cache.hasOwnProperty(key)) {
        cache[key] = new CacheManager(key, expire);
    }
    return cache[key];
}
export { getSingleton, CacheManager };