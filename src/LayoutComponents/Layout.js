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

const HeaderItem = ({ onPress, title, icon }) => {

    function handleClickItem() {
        onPress(title);
    }

    return (
        <li><span onClick={handleClickItem}>{title}</span></li>
    );
}

Header.Item = HeaderItem;

const SiderBar = ({ children }) => {
    return (
        <div className="pg_mm_left">
            {children}
        </div>
    );
}

const Content = ({ children }) => {
    return (
        <div className="pg_mm_right">
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
Layout.Content = Content;
Layout.FullContent = FullContent;
Layout.Fooder = Fooder;
export default Layout;
