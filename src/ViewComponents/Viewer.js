import React from 'react'
import { NotificationManager } from 'react-notifications';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { deleteFile } from '../Utils/GithubCRUD';
import "./Viewer.css";

export default function Viewer(props) {

    let { source } = props;

    React.useEffect(() => {
        return () => {
        }
    }, [props.isPopupView])

    function onEdit() {
        props.onEdit(props.source.filePath);
    }

    async function onDelete() {
        if (!window.confirm("Do you want to delete " + props.source.filePath) === true) {
            return;
        }
        await deleteFile(props.source.filePath);
        NotificationManager.info("Deleted.");

        props.onDelete();
    }

    return (
        <section className="section sec-html visible">
            <span onClick={onEdit} className="pg_mm_view_edit_button">Edit [/]</span>
            <span onClick={onDelete} className="pg_mm_view_delete_button">Delete [#]</span>
            {
                props.isPopupView ?
                    <span onClick={() => { props.onClose() }} className="pg_mm_view_cls_button">Close [x]</span>
                    :
                    ""
            }
            <div className="section-container html-wrap">
                <div className="custom-html-style">
                    <h2 style={{ margin: '5px 0' }}>{source.title}</h2>
                    {source.title ? <hr style={{ margin: '10px 0' }} /> : ''}
                    <div className='pg_mm_view_content'>
                        <ReactMarkdown children={source.content} remarkPlugins={[remarkGfm]} />
                    </div>
                </div>
            </div>
        </section>
    )
}
