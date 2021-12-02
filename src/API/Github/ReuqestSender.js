export default function service(sendData) {
    //
    const BASE_CONFIG = {
        TOKEN_KEY: "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",
        BASE_URL: "https://api.github.com",
        REPO: "repo:cuongphuong/memo_data"
    }

    async function send(config) {
        //
        let url = `${BASE_CONFIG.BASE_URL}/${sendData.url}+${BASE_CONFIG.REPO}`;
        // make correct url
        url = url.replaceAll("//", "/");
        // send request
        const json = await fetch(url, config)
            .then(response => response.json());
        return json;
    }

    async function request() {
        //
        let headers = {
            Authorization: `Token ${BASE_CONFIG.TOKEN_KEY}`,
            Accept: "application/vnd.github.v3+json",
        };

        let configs = {
            headers: headers,
            method: sendData.method,
        }

        if (sendData.data !== null) {
            configs = { ...configs, data: JSON.stringify(sendData.data) };
        }

        let result = await send(configs);
        return result;
    }

    return request();
}