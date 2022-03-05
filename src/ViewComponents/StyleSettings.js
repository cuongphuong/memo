import React from 'react';
import { useDispatch } from 'react-redux';
import * as ReducerAction from '../Actions/StyleReducer';
import "./StyleSettings.css";
import SettingsCache from '../Utils/SettingsCache';

export default function StyleSettings() {
    const dispatch = useDispatch();

    function changeStyle(color) {
        let action = null;
        switch (color) {
            case "tomato":
                action = ReducerAction.changeToTomatoStyle();
                SettingsCache.setTheme("tomato");
                dispatch(action);
                break;
            case "blue":
                action = ReducerAction.changeToBlueStyle();
                SettingsCache.setTheme("blue");
                dispatch(action);
                break;
            case "violet":
                action = ReducerAction.changeToVioletStyle();
                SettingsCache.setTheme("violet");
                dispatch(action);
                break;
            default:
                break;
        }
    }

    return (
        <div className='pg_mm_style_settings unselectable'>
            <span onClick={() => changeStyle("tomato")}></span>
            <span onClick={() => changeStyle("blue")}></span>
            <span onClick={() => changeStyle("violet")}></span>
        </div>
    )
}
