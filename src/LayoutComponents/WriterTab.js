import React, { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Layout from './Layout';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

export default function WriterTab() {
    const mdParser = new MarkdownIt();
    const [content, setContent] = useState("");

    // Finish!
    function handleEditorChange({ html, text }) {
        setContent(text);
    }

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
            const blob = convertBase64UrlToBlob(reader.result)
            setTimeout(() => {
                callback('https://avatars0.githubusercontent.com/u/21263805?s=40&v=4')
            }, 1000)
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {

    }, [])

    return (
        <Layout.FullContent>
            <MdEditor onImageUpload={handleImageUpload} style={{ height: 'calc(100vh - 90px', width: '100%' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
        </Layout.FullContent>
    )
}
