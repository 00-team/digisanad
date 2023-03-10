import React, { FC, useEffect, useState } from 'react'

import { useSetAtom } from 'jotai'
import { LoginAtom } from 'state'

interface TimerProps {
    start: number
}

const Timer: FC<TimerProps> = ({ start }) => {
    const setLogin = useSetAtom(LoginAtom)

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
        timer <= 0 && setLogin({ resend: true })
    }, [timer])

    const convertHMS = (time: number) => {
        let seconds = ''
        let minutes = ''

        seconds = (time % 60).toString()
        if (parseInt(seconds) < 10) seconds = '0' + seconds

        minutes = Math.floor(time / 60).toString()

        let result = minutes + ':' + seconds

        return result
    }

    return <div>{convertHMS(timer)}</div>
}

export { Timer }
