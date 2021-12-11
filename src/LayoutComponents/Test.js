import React, { useState, useMemo } from 'react'

export default function Test() {
    const [nunm, setNunm] = useState(0);
    const result = useMemo(() => function () {
        // 3s proccessing
        return nunm + 1;
    }, [nunm]);

    return (
        <div>
            <p>Number: {result}</p>
        </div>
    )
}
