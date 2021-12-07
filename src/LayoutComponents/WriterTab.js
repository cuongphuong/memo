import React, { useEffect, useState, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Layout from './Layout';
import { getAllCategoryList, savePost } from '../API/Github/Request';
import { StringUtils } from '../Utils/StringUtils';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

export default function WriterTab({ onSubmitSuccess }) {
    const mdParser = new MarkdownIt();
    const [categoryList, setCategoryList] = useState(["---"]);
    const [content, setContent] = useState("");
    const titleInput = useRef(null);
    const categoryInput = useRef(null);

    useEffect(() => {
        async function fetchCategoryList() {
            var data = await getAllCategoryList();
            setCategoryList(categoryList => ([categoryList, ...data]));
        }

        fetchCategoryList();
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
            alert("Please input title!!!")
            return;
        }

        if (category === "---") {
            alert("Please select category!!!")
            return;
        }

        // correct data
        // make data from form data to API body
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
            message: `mm_project: add ${titleFix}.md`,
            content: StringUtils.base64Encode(fileContent)
        }

        let response = await savePost(data, filePath);
        if (response && response.commit) {
            alert("Post thành công \n" + response.commit.html_url);
            onSubmitSuccess({
                title: title,
                content: content,
                id: id,
                category: category
            });
        }
    }

    return (
        <Layout.FullContent>
            <>
                <input
                    ref={titleInput}
                    style={{ width: '75%' }}
                    type="text" id="pg_mm_search_input"
                    placeholder="Note title please input..."
                />
                {/* Render category select option */}
                <select ref={categoryInput} style={{ width: '14%', marginLeft: '1%', height: 40 }}>
                    {
                        categoryList.map((item, index) => <option key={index} value={item}>{item}</option>)
                    }
                </select>
                {/* Save button  */}
                <button onClick={handleSubmit} style={{ width: '9%', minWidth: 95, float: 'right', height: 40 }}>Submit</button>
            </>
            <hr />
            <MdEditor
                onImageUpload={handleImageUpload}
                style={{ height: 'calc(100vh - 90px', width: '100%' }}
                renderHTML={text => mdParser.render(text)}
                onChange={(text, html) => setContent(text)}
            />
        </Layout.FullContent>
    )
}
