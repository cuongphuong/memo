import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Viewer({ source = {
    title: "n/a",
    content: "n/a",
    id: "n/a",
    category: "n/a"
} }) {
    return (
        <section className="section sec-html visible">
            <div className="section-container html-wrap">
                <div className="custom-html-style">
                    <h2 style={{ margin: '5px 0' }}>{source.title}</h2>
                    {source.title ? <hr style={{ margin: '10px 0' }} /> : ''}
                    <ReactMarkdown children={source.content} remarkPlugins={[remarkGfm]} />
                </div>
            </div>
        </section>
    )
}
