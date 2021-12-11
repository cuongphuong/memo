export default function service(sendData) {
    const BASE_CONFIG = {
        TOKEN_KEY: "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",
        BASE_URL: "https://api.github.com",
    }

    async function send(config) {
        let url = `${BASE_CONFIG.BASE_URL}/${sendData.url}`;
        // make correct url
        url = url.replaceAll("//", "/");
        // send request
        try {
            const json = await fetch(url, config)
                .then(response => response.json());
            return json;
        } catch (err) {
            console.log("Error network.");
            return null;
        }
    }

    async function request() {
        let headers = {
            Authorization: `Token ${BASE_CONFIG.TOKEN_KEY}`,
            Accept: "application/vnd.github.v3+json",
        };

        let configs = {
            headers: headers,
            method: sendData.method,
        }

        if (sendData.data !== null) {
            configs = { ...configs, body: sendData.data };
        }

        let result = await send(configs);
        return result;
    }

    return request();
}