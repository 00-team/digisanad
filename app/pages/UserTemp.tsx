import React, { FC, useEffect, useRef } from 'react'

import { useAtom } from 'jotai'
import { UserAtom } from 'state'

const UserTemp: FC = () => {
    const [User, setUser] = useAtom(UserAtom)
    const picture = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setUser('fetch')
    }, [setUser])

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
                fontSize: 30,
                padding: '2rem',
                fontFamily: 'sans-serif',
            }}
        >
            {User.user_id === 0 && <span>No User</span>}
            <span>nickname: {User.first_name}</span>
            <span>user_id: {User.user_id}</span>
            <input type='file' ref={picture} />
        </div>
    )
}

export { UserTemp }
