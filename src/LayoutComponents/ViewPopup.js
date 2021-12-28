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

    function onEdit(filePath) {
        setStype({
            display: "block",
            animationName: "close",
            animationDuration: 300
        });
        props.onEdit(filePath);
    }

    async function onDelete() {
        setStype({
            display: "block",
            animationName: "close",
            animationDuration: 300
        });
        props.onDelete();
    }

    return (
        <div style={stype} className="pg_mm_view_popup">
            {props.source ?
                <Viewer
                    isPopupView
                    source={props.source}
                    onDelete={onDelete}
                    onClose={onClosePopup}
                    onEdit={onEdit}
                />
                : stype && !stype.animationName
                    ?
                    <img
                        className="pg_mm_loadding"
                        height="50px"
                        src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                        alt="loadding..."
                    /> : ""}
        </div>
    )
}
