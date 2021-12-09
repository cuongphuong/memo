import React, { useEffect, useState, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Layout from './Layout';
import { getAllCategoryList, savePost } from '../API/Github/Request';
import { StringUtils } from '../Utils/StringUtils';
import { NotificationManager } from 'react-notifications';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

export default function WriterTab(props) {
    const mdParser = new MarkdownIt();
    const [categoryList, setCategoryList] = useState([]);
    const [content, setContent] = useState("");
    const titleInput = useRef(null);
    const categoryInput = useRef(null);

    useEffect(() => {
        let abortController = new AbortController();
        getAllCategoryList().then(data => {
            setCategoryList(categoryList => ([categoryList, ...data]));
        });

        return () => {
            abortController.abort();
        }
    }, [])

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
        let title = titleInput.current.value;
        let category = categoryInput.current.value;

        if (StringUtils.trim(title, "") === "") {
            NotificationManager.error("Please input title!!!");
            return;
        }

        if (StringUtils.trim(category, "") === "") {
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
        let titleFix = StringUtils.nonAccentVietnamese(title);
        let filePath = `${category}/${titleFix}.md`;

        // content of file md
        let fileContent = "";
        fileContent += `---\n`;
        fileContent += `id: ${id}\n`;
        fileContent += `title: ${title}\n`;
        fileContent += `category: ${category}\n`;
        fileContent += `---\n\n`;
        fileContent += content;

        let data = {
            message: `mm_project: add ${StringUtils.truncateString(titleFix, 25)}.md`,
            content: StringUtils.base64Encode(fileContent)
        }

        let response = await savePost(data, filePath);
        if (response && response.commit) {
            NotificationManager.info("Commited to \n" + response.commit.html_url, "Sucess commit Github repository.", 5000, function () {
                window.open(response.commit.html_url, '_blank').focus();
            }, false);

            props.actionSubmit({
                title: title,
                content: content,
                id: id,
                category: category
            });
        }
    }

    return (
        <div className="pg_mm_amination">
            <Layout.MiddleContent>
                <>
                    <input
                        ref={titleInput}
                        style={{ width: '78%' }}
                        type="text" className="pg_mm_search_input"
                        placeholder="Note title please input..."
                    />
                    {/* Render category select option */}

                    <input className="pg_mm_search_input" ref={categoryInput} type="text" list="categoryList" style={{ width: '12%', marginLeft: '0.5%' }} />
                    <datalist id="categoryList">
                        {categoryList.map((item, index) => <option key={index}>{item}</option>)}
                    </datalist>
                    {/* Save button  */}
                    <button onClick={handleSubmit} style={{ width: '9%', float: 'right', height: 40 }}>Submit</button>
                </>
                <div style={{ marginTop: '5px' }}></div>
                <MdEditor
                    onImageUpload={handleImageUpload}
                    style={{ height: 'calc(100vh - 90px', width: '100%' }}
                    renderHTML={text => mdParser.render(text)}
                    onChange={({ html, text }) => setContent(text)}
                />
            </Layout.MiddleContent>
        </div>
    )
}
