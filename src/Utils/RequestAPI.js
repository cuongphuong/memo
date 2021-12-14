export const RequestAPI = (function () {
    let baseUrl = null;
    let timeout = 10000;
    let headers = {};

    function makeRequestConfig(inp) {
        if (!inp) return {};

        let configs = {
            headers: headers,
            method: inp.method
        }

        if (inp.signal) {
            configs = { ...configs, signal: inp.signal };
        }

        if (inp.data) {
            configs = { ...configs, body: inp.data };
        }
        return configs;
    }

    async function sendRequest(url, configs) {
        console.log(`[${configs.method}] Request to ${url}`);

        let json = await fetch(url, configs, timeout)
            .then(response => response.json())
            .catch(err => Promise.reject(err));
        return json;
    }

    function config(configs = { base_url: "", timeout: 10000, in_headers: {} }) {
        baseUrl = configs.base_url;
        timeout = configs.timeout;
        headers = configs.in_headers;

        console.log("Request config ", baseUrl, timeout);
    }

    async function request(inp) {
        // Make config request
        let url = baseUrl + inp.url.replaceAll("//", "/");
        let requestConfig = makeRequestConfig(inp);

        try {
            return await sendRequest(url, requestConfig);
        } catch (err) {
            console.log("Error network.");
            return null;
        }
    }

    return {
        add_config: config,
        exe: request
    };
})();