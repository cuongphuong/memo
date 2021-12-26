const orangeStyle = {
    headerMenu: {
        backgroundColor: "#eec0c6",
        backgroundImage: "linear-gradient(315deg, #eec0c6 0%, #e58c8a 74%)"
    },
    menuSelected: {
        background: "#ffd6d6",
        color: "#333 !important"
    },
    leftBackground: {
        backgroundColor: "#f0edd9"
    },
    borderLine: {
        border: "solid tomato 1px"
    },
    borderLineHover: {
        border: "solid 1px rgb(252, 139, 119)",
        boxShadow: "1px 1px 5px 1px rgb(252, 139, 119)"
    },
    button: {
        backgroundColor: "#e58c8a",
        color: "#fff"
    },
    input: {
        outline: "none",
        border: "solid tomato 1px"
    }
}

const blueStyle = {
    headerMenu: { background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(102,228,210,1) 0%, rgba(80,193,184,1) 98%)" },
    menuSelected: {
        background: "#b0f4e9",
        color: "#333 !important"
    },
    leftBackground: {
        backgroundColor: "#e5f2f0"
    },
    borderLine: {
        border: "solid #84d9cc 1px"
    },
    borderLineHover: {
        border: "solid 1px #3dab9b",
        boxShadow: "1px 1px 5px 1px #3dab9b"
    },
    button: {
        backgroundColor: "#3dab9b",
        color: "#fff"
    },
    input: {
        outline: "none",
        border: "solid tomato 1px"
    }
}

const StyleReducer = (state = blueStyle, action) => {
    switch (action.type) {
        case 'CHANGE_TO_TOMATO_STYLE': {
            return orangeStyle;
        }
        case 'CHANGE_TO_BLUE_STYLE': {
            return blueStyle;
        }
        default:
            return state;
    }
};
export default StyleReducer;