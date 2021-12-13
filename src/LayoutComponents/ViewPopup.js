import React from 'react';
import Viewer from '../ViewComponents/Viewer';
import "./ViewPopup.css";

export default function ViewPopup(props) {
    const [stype, setStype] = React.useState(null);

    React.useEffect(() => {
        setStype({
            display: props.display
        })
        return () => {
        }
    }, [props.display])

    function onClosePopup() {
        setStype({
            display: "block",
            animationName: "close",
            animationDuration: 300
        });
        props.onClose();
    }

    return (
        <div style={stype} className="pg_mm_view_popup">
            <span onClick={onClosePopup} className="pg_mm_view_cls_button">Close [x]</span>
            {props.source ? <Viewer source={props.source} /> : stype && !stype.animationName ? <img
                className="pg_mm_loadding"
                height="50px"
                src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                alt="loadding..."
            /> : ""}
        </div>
    )
}
