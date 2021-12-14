import React from 'react';
import "./CategoryList.css"

import { ContentRender } from '../Utils/ContentRender';

function makeRenderList(categoryObj, sourcePath) {
    let renderList = [];
    for (const property in categoryObj) {
        if (typeof categoryObj[property] === "object" && property !== "itemList") {
            renderList = [...renderList, {
                name: property,
                path: `${sourcePath}/${property}`,
                type: "dir"
            }]
        }
    }

    if (categoryObj.itemList) {
        categoryObj.itemList.forEach(item => {
            item = { ...item, type: "file" }
            renderList = [...renderList, item];
        });
    }
    return renderList;
}

/**
 * CategoryList =====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
 */
function CategoryList({ children }) {
    return (
        <div className="pg_mm_category_list_main">
            <div className="section" id="J1" >
                {children}
            </div>
        </div>
    )
}


/**
 * Block =====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
 */
function Block(props) {
    // use for control sync process
    const refController = React.useRef(null);
    //
    const [categoryObj, setCategoryObj] = React.useState([]);

    React.useEffect(() => {
        refController.current = new AbortController();
        let signal = refController.current.signal;
        ContentRender.getAllItemFromPath(props.name).then(data => {
            if (signal.aborted) {
                return;
            }
            setCategoryObj(data);
        }).catch(err => {
            console.log(err)
        });

        return () => {
            refController.current.abort();
        }
    }, [props.name])


    function renderItem() {
        let renderList = makeRenderList(categoryObj, props.name);
        let dirList = renderList.filter(p => p.type === "dir");
        let fileList = renderList.filter(p => p.type === "file");

        return (
            <>
                {dirList.map((item, index) => <Row
                    handleItemClick={props.handleItemClick}
                    key={index}
                    source={item}
                />)}

                <dl className="link-list">
                    {fileList.map((item, index) => <Item
                        key={index}
                        name={item.name}
                        type={item.type}
                        path={item.path}
                        handleItemClick={props.handleItemClick}
                    />)}
                </dl>
            </>
        );
    }

    return (
        <>
            <div className="section-inner">
                <h3 className="hd">{props.name}</h3>
                {renderItem()}
            </div>
            <div className="clear_float"></div>
        </>
    )
}


/**
 * Row =====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
 */
function Row({ source = { name: "", path: "", type: "" }, handleItemClick }) {
    // use for control sync process
    const refController = React.useRef(null);
    //
    const [categoryObject, setCategoryObject] = React.useState([]);
    const [sourcePath, setSourcePath] = React.useState(source.path);
    const [isLoadding, setIsLoadding] = React.useState(true);
    const pathList = React.useRef([source.path]);

    React.useEffect(() => {
        refController.current = new AbortController();
        let signal = refController.current.signal;
        ContentRender.getAllItemFromPath(sourcePath).then(data => {
            if (signal.aborted) {
                return;
            }
            // success API
            setCategoryObject(data);
            setIsLoadding(false);
        }).catch(err => {
            console.log(err);
            // check unmount component
            if (signal.aborted) {
                return;
            }
            setCategoryObject([]);
            setIsLoadding(false);
        });

        return () => {
            refController.current.abort();
        }
    }, [sourcePath]);

    function gotoPath(path) {
        let index = pathList.current.indexOf(path);
        let tmpList = pathList.current.filter(p => pathList.current.indexOf(p) <= index);
        pathList.current = tmpList;
        setSourcePath(path);
        setIsLoadding(true);
        // fetch API
        refController.current = new AbortController();
        let signal = refController.current.signal;
        ContentRender.getAllItemFromPath(sourcePath).then(data => {
            if (signal.aborted) {
                return;
            }
            setCategoryObject(data);
            setIsLoadding(false);
        }).catch(err => {
            console.log("Fail to fetch data.");
            // check unmount component
            if (signal.aborted) {
                return;
            }
            setCategoryObject([]);
            setIsLoadding(false);
        });
    }

    function onClickSubFolder(name) {
        pathList.current = [...pathList.current, sourcePath + "/" + name];
        gotoPath(sourcePath + "/" + name)
    }

    function renderItem() {
        let renderList = makeRenderList(categoryObject, source.path);

        if (isLoadding) {
            return (<img
                height="20px"
                src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                alt="loadding..."
            />);
        }

        return renderList.map((item, index) => <Item
            key={index}
            name={item.name}
            type={item.type}
            path={item.path}
            handleItemClick={handleItemClick}
            onClickSubFolder={(name) => onClickSubFolder(name)}
        />);
    }

    function renderPathList() {
        let fixPathList = pathList.current.map(path => truncPathListItem(path));
        return (
            <>
                {fixPathList.map((item, index) => <span className="pg_mm_path_item"
                    key={index}
                    onClick={() => gotoPath(pathList.current[index])}>
                    {item}
                </span>)}
            </>
        )
    }

    function truncPathListItem(strPath) {
        let tmpPathList = strPath.split("/");
        return tmpPathList.pop();
    }

    return (
        <dl className="link-list">
            <dt className="link-hd" onClick={() => gotoPath(pathList.current[pathList.current.length - 1])}>{renderPathList()}</dt>
            <dd className="link-bd">
                {renderItem()}
            </dd>
        </dl>
    )
}


/**
 * Item =====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
 */
function Item(props) {
    if (props.type === "file") {
        let title = props.name.replace(".md", "");
        return (
            <p
                onClick={() => props.handleItemClick(props.path)}
                title={title} >
                {title}
            </p>);
    }

    if (props.type === "dir") {
        return (<span
            onClick={() => props.onClickSubFolder(props.name)}
            title="" >
            {props.name}
        </span>);
    }
}

CategoryList.Block = Block;
export default CategoryList;