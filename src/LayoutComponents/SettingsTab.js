import React from 'react';
import Layout from './Layout';
import { NotificationManager } from 'react-notifications';
import './SettingsTab.css';
import { useSelector } from 'react-redux';
import SettingsCache from '../Utils/SettingsCache';

export default function SettingsTab() {
    const urlRepositoryInput = React.useRef(null);
    const cacheTimeDayInput = React.useRef(null);
    const requestTimeoutInput = React.useRef(null);
    const accessKeyInput = React.useRef(null);
    const userNameInput = React.useRef(null);
    const emailInput = React.useRef(null);

    const style = useSelector(state => state.style);

    React.useEffect(() => {
        urlRepositoryInput.current.value = SettingsCache.getUrlRepository();
        cacheTimeDayInput.current.value = SettingsCache.getCacheMinutes();
        requestTimeoutInput.current.value = SettingsCache.getRequestTimeout();
        accessKeyInput.current.value = SettingsCache.getAccessKey();
        userNameInput.current.value = SettingsCache.getUserName();
        emailInput.current.value = SettingsCache.getEmail();
        return () => { }
    }, [])


    function handleSave() {
        if (!window.confirm("Do you want to save?") === true) {
            return;
        }

        SettingsCache.setUrlRepository(urlRepositoryInput.current.value);
        SettingsCache.setCacheTimeMinute(cacheTimeDayInput.current.value);
        SettingsCache.setRequestTimeout(requestTimeoutInput.current.value);
        SettingsCache.setAccessKey(accessKeyInput.current.value);
        SettingsCache.setUserName(userNameInput.current.value);
        SettingsCache.setEmail(emailInput.current.value);

        NotificationManager.info("Success, reload after 2s.");
        setTimeout(function () {
            window.location.reload();
        }, 2000);
    }

    function handleAuthen() {
        let app_id = "95da9e48d369117d17bb";
        window.location.href = "https://github.com/login/oauth/authorize?client_id=" + app_id;
    }

    return (
        <div className="pg_mm_amination">
            <Layout.MiddleContent >
                <h3 className='pg_mm_settings_area'>Data settings</h3>
                <input
                    ref={urlRepositoryInput}
                    className='pg_mm_settings_input'
                    placeholder='URL to repository...'
                    defaultValue="https://github.com/cuongphuong/memo_data"
                />
                <span
                    className='pg_mm_example'>
                    Repo for save data ex: https://github.com/cuongphuong/memo_data
                </span>

                <br />
                <input
                    type="number"
                    ref={cacheTimeDayInput}
                    className='pg_mm_settings_input'
                    placeholder='Cache time (ms)...'
                    defaultValue="10"
                />
                <span
                    className='pg_mm_example'>
                    Cache time (minutes) ex: 5 minutes
                </span>

                <br />
                <input
                    type="number"
                    ref={requestTimeoutInput}
                    className='pg_mm_settings_input'
                    placeholder='Request timeout (ms)...'
                    defaultValue="5000"
                />
                <span
                    className='pg_mm_example'>
                    Request timeout (ms) ex: 5000 (5 seconds)
                </span>

                <h3 className='pg_mm_settings_area'>Github account setting</h3>
                <input
                    ref={accessKeyInput}
                    className='pg_mm_settings_input'
                    placeholder='Access key (if private repository)...'
                />
                <span
                    className='pg_mm_example'>
                    Access key, get
                    <a
                        target="_blank"
                        href='https://github.com/settings/tokens'
                        rel="noreferrer"> here
                    </a> ex: ghp_ILEBZ7OZbzmnMd33z8MwStkSvp6zQq1MDYHQ
                </span>

                <br />
                <input
                    ref={userNameInput}
                    className='pg_mm_settings_input'
                    placeholder='Username github...'
                />
                <span
                    className='pg_mm_example'>
                    Github Username
                </span>

                <br />
                <input
                    ref={emailInput}
                    className='pg_mm_settings_input'
                    placeholder='Email...'
                />
                <span
                    className='pg_mm_example'>
                    Email: xxx@gmail.com
                </span>

                <br />
                <button
                    style={style.button}
                    onClick={handleSave}
                    className='pg_mm_settings_submit'>
                    Save
                </button>

                <button
                    style={style.button}
                    onClick={(handleAuthen)}
                    className='pg_mm_settings_submit'>
                    GitHub identity
                </button>
            </Layout.MiddleContent>
        </div>
    )
}
