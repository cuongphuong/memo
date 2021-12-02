import React, { useEffect } from 'react'
import "./App.css";
import { searchFromGitHub } from "./API/Github/Request";
import Loadding from './ViewComponents/Loadding';

function App() {

    const searchData = async () => {
        var data = await searchFromGitHub("Learn");
        console.log(data);
    }

    useEffect(() => {
        searchData();
    }, [])

    return (
        <div className="App">
            <button onClick={searchData}>Click</button>
            <Loadding/>
        </div>
    );
}

export default App;
