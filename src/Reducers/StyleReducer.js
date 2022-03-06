const orangeStyle = {
    headerMenu: {
        backgroundColor: "#eec0c6",
        backgroundImage: "linear-gradient(315deg, #eec0c6 0%, #e58c8a 74%)"
    },
    category: { "background": "linear-gradient(102deg, rgba(2,0,36,1) 0%, rgba(102,228,210,1) 0%, rgba(255,157,135,0.8434971400669643) 0%, rgba(244,123,58,0.35890330253195024) 100%, rgba(244,124,60,0.5157660476299895) 100%, rgba(80,193,184,1) 100%)" },
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
        color: "#fff",
        marginRight: 5
    },
    input: {
        outline: "none",
        border: "solid tomato 1px"
    }
}

const blueStyle = {
    headerMenu: {
        background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(102,228,210,1) 0%, rgba(80,193,184,1) 98%)"
    },
    category: { "background": "linear-gradient(102deg, rgba(2,0,36,1) 0%, rgba(84,203,204,0.8519005014115021) 0%, rgba(90,204,195,0.4149257114955357) 100%, rgba(244,123,58,0.35890330253195024) 100%, rgba(244,124,60,0.5157660476299895) 100%, rgba(71,217,196,1) 100%)" },
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
        border: "solid 1px #68d4c4",
        boxShadow: "1px 1px 5px 1px #68d4c4"
    },
    button: {
        backgroundColor: "#3dab9b",
        color: "#fff",
        marginRight: 5
    },
    input: {
        outline: "none",
        border: "solid tomato 1px"
    }
}

const violetStyle = {
    headerMenu: { "background": "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)" },
    category: { "background": "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(235,174,203,0.5493794930081408) 0%, rgba(148,187,233,0.4989593249409139) 100%)" },
    menuSelected: {
        background: "#ebaecb",
        color: "#333 !important"
    },
    leftBackground: {
        backgroundColor: "#e5f2f0"
    },
    borderLine: {
        border: "solid #ebaecb 1px"
    },
    borderLineHover: {
        border: "solid 1px #ebaecb",
        boxShadow: "1px 1px 5px 1px #ebaecb"
    },
    button: {
        backgroundColor: "#ebaecb",
        color: "#fff",
        marginRight: 5
    },
    input: {
        outline: "none",
        border: "solid tomato 1px"
    }
}

const StyleReducer = (state = violetStyle, action) => {
    switch (action.type) {
        case 'CHANGE_TO_TOMATO_STYLE': {
            return orangeStyle;
        }
        case 'CHANGE_TO_BLUE_STYLE': {
            return blueStyle;
        }
        case 'CHANGE_TO_VIOLET_STYLE': {
            return violetStyle;
        }
        default:
            return state;
    }
};
export default StyleReducer;