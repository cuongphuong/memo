import React from 'react';
import Viewer from '../ViewComponents/Viewer';
import { NotificationManager } from 'react-notifications';
import "./ViewPopup.css";
import { deleteFile } from '../Utils/GithubCRUD';

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

    function onEdit() {
        setStype({
            display: "block",
            animationName: "close",
            animationDuration: 300
        });
        props.onEdit(props.source.filePath);
    }

    async function onDelete() {
        if (!window.confirm("Do you want to delete " + props.source.filePath) === true) {
            return;
        }

        await deleteFile(props.source.filePath);
        NotificationManager.info("Deleted.");
        setStype({
            display: "block",
            animationName: "close",
            animationDuration: 300
        });
        props.onDelete();
    }

    return (
        <div style={stype} className="pg_mm_view_popup">
            <span onClick={onClosePopup} className="pg_mm_view_cls_button">Close [x]</span>
            <span onClick={onEdit} className="pg_mm_view_edit_button">Edit [/]</span>
            <span onClick={onDelete} className="pg_mm_view_delete_button">Delete [#]</span>
            {props.source ? <Viewer source={props.source} /> : stype && !stype.animationName ? <img
                className="pg_mm_loadding"
                height="50px"
                src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                alt="loadding..."
            /> : ""}
        </div>
    )
}
