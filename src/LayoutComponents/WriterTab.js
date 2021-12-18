import React, { useState, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Layout from './Layout';
import * as hub from '../Utils/GithubCRUD';
import { StringUtils } from '../Utils/StringUtils';
import { NotificationManager } from 'react-notifications';
import CategoryInput from '../ViewComponents/CategoryInput';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import { ContentRender } from '../Utils/ContentRender';

export default function WriterTab(props) {
    // Use for control sync process
    const refController = React.useRef(null);
    // Use for store data
    const mdParser = new MarkdownIt();
    const [content, setContent] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const title = useRef("");
    const category = useRef("");

    // Use for update file
    const { updateAction } = props;
    const { inputPath, clearPath } = updateAction;
    const isCreated = !inputPath;
    const originData = useRef({
        title: null,
        category: null,
        content: null
    });

    React.useEffect(() => {
        if (isCreated) {
            return;
        }
        //
        clearPath();
        refController.current = new AbortController();
        let signal = refController.current.signal;
        // fetch API
        ContentRender.makeContentObject(inputPath, signal).then(data => {
            if (!data) return;
            title.current = data.title;
            category.current = data.category;
            originData.current = {
                title: data.title,
                category: data.category,
                originData: data.content
            }
            setContent(data.content);
        });

        return () => {
            refController.current.abort();
        }
    }, [clearPath, inputPath, isCreated])

    function handleImageUpload(file, callback) {
        const reader = new FileReader()
        reader.onload = () => {
            const convertBase64UrlToBlob = (urlData) => {
                let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new Blob([u8arr], { type: mime })
            }
            const blob = convertBase64UrlToBlob(reader.result);
            console.log(blob);
            setTimeout(() => {
                callback('https://avatars0.githubusercontent.com/u/21263805?s=40&v=4')
            }, 1000)
        }
        reader.readAsDataURL(file)
    }

    /**
     * After click button submit collect data from form and call API
     */
    async function handleSubmit() {
        if (StringUtils.trim(title.current, "") === "") {
            NotificationManager.error("Please input title!!!");
            return;
        }

        if (StringUtils.trim(category.current, "") === "") {
            NotificationManager.error("Please select category!!!");
            return;
        }

        if (StringUtils.trim(content, "") === "" || StringUtils.trim(content, "").length < 50) {
            NotificationManager.error("Please input content than 50 charactor!!!");
            return;
        }

        // correct data
        // make data from form data for API body
        let id = new Date().getTime();
        let titleFix = /*StringUtils.nonAccentVietnamese(title.current);*/title.current;
        let filePath = `${category.current}/${StringUtils.truncateString(titleFix, 25)}.md`;
        filePath = filePath.replaceAll("//", "/");

        // content of file md
        let fileContent = "";
        fileContent += `---\n`;
        fileContent += `id: ${id}\n`;
        fileContent += `title: ${title.current}\n`;
        fileContent += `category: ${category.current}\n`;
        fileContent += `---\n\n`;
        fileContent += content;

        let commitMsg = isCreated
            ? "Create file " + category.current + "/" + StringUtils.truncateString(titleFix, 25)
            : "Update file " + inputPath;

        let data = {
            message: commitMsg,
            content: StringUtils.base64Encode(fileContent)
        }

        store(data, filePath);
    }

    async function store(data, filePath) {
        setIsProcessing(true);
        if (isCreated) {
            let response = await hub.create(data, filePath);
            if (response && response.commit) {
                NotificationManager.info(response.commit.html_url, "Commited", 5000, function () {
                    window.open(response.commit.html_url, '_blank').focus();
                }, false);
                setIsProcessing(false);
            }
        } else {
            if (title.current !== originData.current.title
                || category.current !== originData.current.category) {
                console.log("update path send...")
                await hub.move("main", inputPath, filePath);
            }

            if (content !== originData.current.content) {
                console.log("update content send...")
                await hub.update(data, filePath).catch(err => {
                    NotificationManager.error(err + "");
                });
            }
            setIsProcessing(false);
            NotificationManager.info("Updated");
        }
    }

    function handleChangeCategory(source = { category: "", title: "" }) {
        title.current = source.title;
        category.current = source.category;
    }

    return (
        <div className="pg_mm_amination">
            <Layout.MiddleContent>
                <>
                    <div style={{ width: "90%", height: 90, float: 'left' }}>
                        <CategoryInput defaultTitle={title.current} defaultCategory={category.current} onChange={handleChangeCategory} />
                    </div>
                    {/* Save button  */}
                    <button
                        onClick={handleSubmit}
                        style={{ width: '9%', height: 40, float: 'right' }}>
                        {isCreated ? "Create" : "Update"}
                    </button>
                </>
                <div style={{ marginTop: '5px' }}></div>
                <MdEditor
                    value={content}
                    onImageUpload={handleImageUpload}
                    style={{ height: 'calc(100vh - 160px', width: '100%' }}
                    renderHTML={text => mdParser.render(text)}
                    onChange={({ html, text }) => setContent(text)}
                />

                {
                    isProcessing ?
                        <div className="pg_mm_loadding">
                            <img height="45px"
                                src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                                alt="loadding..."
                            />
                        </div>
                        :
                        ''
                }

            </Layout.MiddleContent>
        </div>
    )
}
