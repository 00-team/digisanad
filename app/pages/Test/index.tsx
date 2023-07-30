import React, { FC, useRef, ElementRef, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import './test.scss'

const Test: FC = () => {
    const output = useRef<ElementRef<'textarea'>>(null)
    const [activeStage, setActiveStage] = useState(0)

    useEffect(() => {
        if (!output.current) return

        output.current.value = JSON.stringify({ hi: 12 }, null, 4)
    }, [])

    return (
        <div className='test-container'>
            <div className='contract-builder'>
                <div className='view'>
                    <div className='stages'>
                        {[12, 'GG', 14, 15, 1, 1, 2, 3, 4, 5, 5, 6, 7].map(
                            (n, i) => (
                                <div
                                    className={C(i === activeStage)}
                                    onClick={() => setActiveStage(i)}
                                    key={i}
                                >
                                    <span className='title'>Stage {n}</span>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className='builder'></div>
            </div>
            <textarea ref={output}></textarea>
        </div>
    )
}

export default Test
