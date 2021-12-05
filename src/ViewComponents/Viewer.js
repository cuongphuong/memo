import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Viewer({ source }) {
    return (
        <section className="section sec-html visible">
            <div className="section-container html-wrap">
                <div className="custom-html-style">
                    <ReactMarkdown children={source} remarkPlugins={[remarkGfm]} />
                </div>
            </div>
        </section>
    )
}
