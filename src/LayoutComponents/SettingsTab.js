import React from 'react';
import Layout from './Layout';
import { getSingleton as LocalCache } from '../Utils/CacheManager';
import { NotificationManager } from 'react-notifications';
import './SettingsTab.css';

export default function SettingsTab() {
    const urlRepositoryInput = React.useRef(null);
    const cacheTimeDayInput = React.useRef(null);
    const requestTimeoutInput = React.useRef(null);
    const accessKeyInput = React.useRef(null);
    const userNameInput = React.useRef(null);
    const emailInput = React.useRef(null);

    const CACHE_KEY = "pg_mm_settings";
    const cache = React.useRef(LocalCache(CACHE_KEY));

    React.useEffect(() => {
        if (cache.current.has("urlRepository"))
            urlRepositoryInput.current.value = cache.current.get("urlRepository");
        if (cache.current.has("cacheTime"))
            cacheTimeDayInput.current.value = cache.current.get("cacheTime");
        if (cache.current.has("requestTimeout"))
            requestTimeoutInput.current.value = cache.current.get("requestTimeout");
        if (cache.current.has("accessKey"))
            accessKeyInput.current.value = cache.current.get("accessKey");
        if (cache.current.has("userName"))
            userNameInput.current.value = cache.current.get("userName");
        if (cache.current.has("email"))
            emailInput.current.value = cache.current.get("email");
        return () => { }
    }, [])


    function handleSave() {
        if (!window.confirm("Do you want to save?") === true) {
            return;
        }
        cache.current.add("urlRepository", urlRepositoryInput.current.value);
        cache.current.add("cacheTime", cacheTimeDayInput.current.value);
        cache.current.add("requestTimeout", requestTimeoutInput.current.value);
        cache.current.add("accessKey", accessKeyInput.current.value);
        cache.current.add("userName", userNameInput.current.value);
        cache.current.add("email", emailInput.current.value);

        NotificationManager.info("Success, reload after 2s.");

        setTimeout(function () {
            window.location.reload();
        }, 2000);
    }

    return (
        <div className="pg_mm_amination">
            <Layout.MiddleContent >
                <h3 className='pg_mm_settings_area'>Data settings</h3>
                <input ref={urlRepositoryInput} className='pg_mm_settings_input' placeholder='URL to repository...'></input>
                <span className='pg_mm_example'>https://github.com/cuongphuong/memo_data</span>
                <br />
                <input ref={cacheTimeDayInput} className='pg_mm_settings_input' placeholder='Cache time (ms)...'></input>
                <span className='pg_mm_example'>50000</span>
                <br />
                <input ref={requestTimeoutInput} className='pg_mm_settings_input' placeholder='Request timeout (ms)...'></input>
                <span className='pg_mm_example'>5000</span>

                <h3 className='pg_mm_settings_area'>Github account setting</h3>
                <input ref={accessKeyInput} className='pg_mm_settings_input' placeholder='Access key (if private repository)...'></input>
                <span className='pg_mm_example'>ghp_ILEBZ7OZbzmnMd33z8MwStkSvp6zQq1MDYHQ</span>
                <br />
                <input ref={userNameInput} className='pg_mm_settings_input' placeholder='Username github...'></input>
                <span className='pg_mm_example'>cungphuong</span>
                <br />
                <input ref={emailInput} className='pg_mm_settings_input' placeholder='Email...'></input>
                <span className='pg_mm_example'>xxx@gmail.com</span>
                <br />
                <button onClick={handleSave} className='pg_mm_settings_submit'>Save</button>
            </Layout.MiddleContent>
        </div>
    )
}
