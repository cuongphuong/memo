import React from 'react'
import { useSelector } from 'react-redux';
import "./Layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress as faGear } from "@fortawesome/free-solid-svg-icons";

const Layout = ({ children }) => {
    return (
        <div className="pg_mm_grid-container">
            {children}
        </div>
    )
}

const Header = ({ children }) => {
    const style = useSelector(state => state.style);
    return (
        <div className="pg_mm_header" id="pg_mm_header-menu">
            <ul style={style.headerMenu}>
                {children}
            </ul>
        </div>
    );
}

const HeaderItem = ({ onClick, title, selected }) => {
    const style = useSelector(state => state.style);

    if (title === "Settings") {
        return <p onClick={() => onClick(title)} className='pg_mm_settings_menu_item unselectable'><FontAwesomeIcon icon={faGear} /></p>
    }

    return (
        <li>
            <span
                className="unselectable"
                style={selected === title ? style.menuSelected : {}}
                onClick={() => onClick(title)}>
                {title}
            </span>
        </li>
    );
}

Header.Item = HeaderItem;

const SiderBar = ({ children }) => {
    const style = useSelector(state => state.style);
    return (
        <div
            style={style.leftBackground}
            className="pg_mm_left pg_mm_scroll">
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
