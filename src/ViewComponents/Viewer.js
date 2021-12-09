import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Viewer({ source }) {
    return (
        <section className="section sec-html visible">
            <div className="section-container html-wrap">
                <div className="custom-html-style">
                    <h1>{source.title}</h1>
                    <hr />
                    <ReactMarkdown children={source.content} remarkPlugins={[remarkGfm]} />
                </div>
            </div>
        </section>
    )
}
