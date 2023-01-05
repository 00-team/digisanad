import React, { FC, useEffect, useState } from 'react'

interface TimerProps {
    start: number
    cb: () => void
}

const Timer: FC<TimerProps> = ({ start, cb }) => {
    const [timer, setTimer] = useState(start)

    useEffect(() => {
        const interval: ReturnType<typeof setInterval> = setInterval(() => {
            setTimer(value => {
                if (value === 0) {
                    cb()
                    clearInterval(interval)
                    return 0
                } else return value - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return <div>{timer}</div>
}

export { Timer }
