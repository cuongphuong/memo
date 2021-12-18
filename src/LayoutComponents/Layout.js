import React from 'react'
import "./Layout.css";

const Layout = ({ children }) => {
    return (
        <div className="pg_mm_grid-container">
            {children}
        </div>
    )
}

const Header = ({ children }) => {
    return (
        <div className="pg_mm_header" id="pg_mm_header-menu">
            <ul>
                {children}
            </ul>
        </div>
    );
}

const HeaderItem = ({ onClick, title, selected }) => {

    if (title === "Settings") {
        return <p onClick={() => onClick(title)} className='pg_mm_settings_menu_item'>⚙</p>
    }

    return (
        <li>
            <span
                className={selected === title ? "pg_mm_header-menu_selected" : ""}
                onClick={() => onClick(title)}>
                {title}
            </span>
        </li>
    );
}

Header.Item = HeaderItem;

const SiderBar = ({ children }) => {
    return (
        <div className="pg_mm_left pg_mm_scroll">
            {children}
        </div>
    );
}

const RightContent = ({ children }) => {
    return (
        <div className="pg_mm_right pg_mm_scroll">
            {children}
        </div>
    );
}

const MiddleContent = ({ children }) => {
    return (
        <div className="pg_mm_mid pg_mm_scroll">
            {children}
        </div>
    );
}


const FullContent = ({ children }) => {
    return (
        <div className="pg_mm_content_full">
            {children}
        </div>
    );
}

const Fooder = () => {

}

Layout.Header = Header;
Layout.SiderBar = SiderBar;
Layout.RightContent = RightContent;
Layout.MiddleContent = MiddleContent;
Layout.FullContent = FullContent;
Layout.Fooder = Fooder;
export default Layout;
