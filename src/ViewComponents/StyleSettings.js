import React from 'react';
import { useDispatch } from 'react-redux';
import * as ReducerAction from '../Actions/StyleReducer';
import "./StyleSettings.css";

export default function StyleSettings() {
    const dispatch = useDispatch();

    function changeStyle(color) {
        let action = null;
        switch (color) {
            case "tomato":
                action = ReducerAction.changeToTomatoStyle();
                dispatch(action);
                break;
            case "blue":
                action = ReducerAction.changeToBlueStyle();
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
        </div>
    )
}
