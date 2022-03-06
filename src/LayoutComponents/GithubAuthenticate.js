import React from 'react';
import { useEffect } from 'react';
import SettingsCache from '../Utils/SettingsCache';
import { StringUtils } from '../Utils/StringUtils';

export default function GithubAuthenticate() {
    const DEFAULT_AUTH_SERVICE = 'https://bdsdb.000webhostapp.com/';
    const [message, setMessage] = React.useState("Waiting for check infomation...")

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        /** Ủy quyền login */
        let code = queryParams.get('code');

        if (!StringUtils.isNullOrEmpty(code)) {
            let formData = new FormData();
            formData.append('code', code);

            fetch(DEFAULT_AUTH_SERVICE, {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: formData
            }).then(res => res.json())
                .then(async (data) => {
                    SettingsCache.setAccessKey(data.access_token);
                    setMessage("Get success token, wait for back to home page...");

                    // Get infomation
                    fetch("https://api.github.com/user", {
                        headers: {
                            Accept: "application/vnd.github.v3+json",
                            Authorization: `Token ${data.access_token}`
                        }
                    }).then(r => r.json())
                        .then(userInfomation => {
                            if (userInfomation) {
                                let userName = userInfomation.login;
                                let email = userInfomation.email;
                                let avatar_url = userInfomation.avatar_url;

                                SettingsCache.setUserName(userName);
                                SettingsCache.setEmail(email);
                                SettingsCache.setAvatarUrl(avatar_url);
                            }

                            setTimeout(() => {
                                window.location.href = "/memo";
                            }, 1000);
                        })
                }).catch(err => {
                    console.log(err);
                    setMessage("Ohh oh :(((");
                });
        } else {
            setMessage(queryParams.get('error_description'));
            setTimeout(() => {
                window.location.href = "/memo";
            }, 3000);
        }
        return () => {
        }
    }, [])

    return (
        <div>{message}</div>
    )
}
