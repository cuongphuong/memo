import React from 'react';
import Layout from './Layout';
import CategoryList from '../ViewComponents/CategoryList';
import { getAllCategoryList } from '../API/Github/Request';

export default function ListTab() {
    // use for control sync process
    let acontroller = React.useMemo(() => new AbortController(), []);
    let signal = acontroller.signal;
    const [categoryList, setCategoryList] = React.useState([]);

    React.useEffect(() => {
        getAllCategoryList("").then(data => {
            if (signal.aborted) {
                const error = new DOMException('aborted!', 'AbortError');
                return Promise.reject(error);
            }
            setCategoryList(categoryList => data);
        }).catch(error => {
            console.log(error);
        });

        return () => {
            acontroller.abort();
        }
    }, [acontroller, signal.aborted]);

    return (
        <div className="pg_mm_amination">
            <Layout.MiddleContent >
                <CategoryList>
                    {categoryList.map((categoryName, index) => <CategoryList.Block key={index} name={categoryName} />)}
                </CategoryList>
            </Layout.MiddleContent >
        </div>
    )
}
