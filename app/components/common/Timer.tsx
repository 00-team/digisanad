import React, { FC, useEffect, useState } from 'react'

import { useSetAtom } from 'jotai'
import { CanResendAtom } from 'state'

interface TimerProps {
    start: number
}

const Timer: FC<TimerProps> = ({ start }) => {
    const setCanResend = useSetAtom(CanResendAtom)
    const [timer, setTimer] = useState(start)

    useEffect(() => {
        const interval: ReturnType<typeof setInterval> = setInterval(() => {
            setTimer(value => {
                if (value === 0) {
                    clearInterval(interval)
                    return 0
                } else return value - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        timer <= 0 && setCanResend(true)
    }, [timer])

    return <div>{timer}</div>
}

export { Timer }
