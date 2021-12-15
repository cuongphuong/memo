import React from "react";
import { ContentRender } from "../Utils/ContentRender";

export default function CategoryInput(props) {
    // use for control sync process
    const refController = React.useRef(null);
    //
    const nameInput = React.useRef("");
    const pathDataList = React.useRef([]);
    const [categoryList, setCategoryList] = React.useState([]);
    const [pathRenderList, setPathRenderList] = React.useState([]);
    const [isFetching, setIsFetching] = React.useState(false);
    const makeReturn = () => {
        let category = "";
        if (pathDataList.current && pathDataList.current.length > 0) {
            category = pathDataList.current.map((item) => item.name).join("");
        }
        return { category: category, title: nameInput.current.value }
    }

    React.useEffect(() => {
        refController.current = new AbortController();
        let signal = refController.current.signal;
        // fetch API
        ContentRender.getAllCategoryList("").then((data) => {
            // check unmount component
            if (signal.aborted) {
                return;
            }
            setCategoryList([...data]);
        }).catch(err => {
            console.log(err);
        });

        return () => {
            refController.current.abort();
        };
    }, []);

    function makeNewCategory(name, callback = function () { }) {
        if (name !== "/" && name.endsWith("/")) {
            // Fetch sublist
            let currentPath = pathRenderList.map((item) => item.name).join("");
            let newPath = {
                name: name,
                path: currentPath + name,
                subList: [],
            };
            pathDataList.current = [...pathDataList.current, newPath];
            setPathRenderList(pathDataList.current);
            callback(true);

            let lastItem = pathDataList.current.at(-1);
            // Update sub list from API
            setIsFetching(true);
            refController.current = new AbortController();
            let signal = refController.current.signal;
            // fetch API
            ContentRender.getAllCategoryList(lastItem.path).then(subDataList => {

                // Remove last item in list
                let tmpList = [...pathDataList.current];
                tmpList.pop();
                //
                lastItem = { ...lastItem, subList: subDataList }
                tmpList.push(lastItem);
                pathDataList.current = tmpList;
                // check unmount component
                if (signal.aborted) {
                    return;
                }
                setPathRenderList(pathRenderList => tmpList);
                setIsFetching(false);
            }).catch(err => {
                console.log(err);
            });
        } else {
            callback();
        }
    }

    function handleKeyInput(evt) {
        let key = evt.which || evt.keyCode || evt.charCode;
        if (/*key === 8 || */ key === 46 && pathDataList.current.length > 0) {
            let lastItem = pathDataList.current.at(-1);
            evt.target.value = lastItem.name.substring(0, lastItem.name.length - 1);
            let tmpList = [...pathDataList.current];
            tmpList.pop();
            pathDataList.current = tmpList;
            setPathRenderList(pathDataList.current);
        } else {
            makeNewCategory(evt.target.value, function (success = false) {
                if (success) evt.target.value = "";
                props.onChange(makeReturn());
            });
        }

        evt.target.focus();
    }

    function setNameInputValue(val) {
        makeNewCategory(val + "/", function () {
            props.onChange(makeReturn());
        });
        // nameInput.current.value = "";
        nameInput.current.focus();
    }

    function renderSubCategoryList() {
        let currentCtgList = [];
        let lastItem = pathRenderList.at(-1);
        if (pathRenderList.length > 0) {
            currentCtgList = [...lastItem.subList];
        } else {
            currentCtgList = categoryList;
        }

        if (isFetching) {
            return (
                <div style={{ position: "absolute", top: 6, zIndex: -1, color: "#cdcdcd" }}>
                    <img height="20px"
                        src="https://raw.githubusercontent.com/cuongphuong/memo/master/public/icon/blue_loading.gif"
                        alt="loadding..."
                    />
                </div>
            )
        }

        if (currentCtgList.length === 0) {
            let name = "root/";
            if (lastItem && lastItem.name) {
                name = ".../" + lastItem.name;
            }

            return (
                <div style={{ position: "absolute", top: 6, zIndex: -1, color: "#cdcdcd" }}>No category from {name}</div>
            )
        }

        return currentCtgList.map((item, index) => (
            <span
                onClick={() => setNameInputValue(item)}
                className="pg_mm_sublist_item"
                key={index}
            >
                {item}
            </span>
        ));
    }

    return (
        <div style={{ marginBottom: 50, height: 30 }}>
            <div className="pg_mm_path_parent">
                <span className="pg_mm_selected_path_item">/</span>
                {/* Render path */}
                {pathRenderList.map((item, index) => (
                    <span className="pg_mm_selected_path_item" key={index}>
                        {item.name}
                    </span>
                ))}
                {/* Input path */}
                <input
                    placeholder="Press [DEL] to back to previous folder."
                    ref={nameInput}
                    className="pg_mm_name_input"
                    onKeyUp={(evt) => handleKeyInput(evt)}
                />
            </div>
            <div className="sub_list_redered" style={{ marginTop: 5, position: "relative" }}>
                {renderSubCategoryList()}
            </div>
        </div>
    );
}
