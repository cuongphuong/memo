import React from 'react'
import { NotificationManager } from 'react-notifications';
import { deleteFile } from '../Utils/GithubCRUD';
// import renderHTML from 'react-render-html';
import "./Viewer.css";
import "./markdown.css";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export default function Viewer(props) {

    const [content, setContent] = React.useState(`Just a link: https://reactjs.com.`);
    let { source } = props;

    React.useEffect(() => {
        setContent(source.content)
    }, [props.isPopupView, source.content])

    function onEdit() {
        props.onEdit(props.source.filePath);
    }

    async function onDelete() {
        if (!window.confirm("Do you want to delete " + props.source.filePath) === true) {
            return;
        }
        try {
            await deleteFile(props.source.filePath);
            NotificationManager.info("Deleted.");
            props.onDelete(true);
        } catch (err) {
            props.onDelete(false);
        }
    }

    async function handleCopyLink() {
        // Make link
        let url = window.location.protocol + '//' + window.location.host;
        let id = source.filePath.replaceAll("/", "+");
        id = id.substr(0, id.length - 3);
        id = encodeURI(id);
        let link = url + "/memo/#/get/" + id;

        await navigator.clipboard.writeText(link);
        NotificationManager.info("Copied: " + link);
    }

    return (
        <section className="section sec-html visible markdown-section pg_mm_container_view">
            {/* <span onClick={onEdit} className="pg_mm_view_edit_button">Edit [/]</span>
            <span onClick={onDelete} className="pg_mm_view_delete_button">Delete [#]</span> */}
            {
                props.isPopupView ?
                    <span onClick={() => { props.onClose() }} className="pg_mm_view_cls_button">Close [x]</span>
                    :
                    ""
            }
            <div className="section-container html-wrap">
                <div className="custom-html-style">
                    <h2 className='pg_mm_title'>
                        {source.title}
                        <img onClick={handleCopyLink}
                            style={{ marginLeft: 10, cursor: 'pointer' }}
                            src='/memo/icon/copy.png'
                            width={20}
                            alt='copy'
                        />
                    </h2>
                    {source.title ? <hr style={{ margin: '10px 0' }} /> : ''}
                    <div className='pg_mm_view_content'>
                        <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} />
                    </div>
                </div>
            </div>
        </section>
    )
}
