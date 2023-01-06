import React, { FC, useEffect, useRef } from 'react'

import { useAtom } from 'jotai'
import { UserAtom } from 'state'

interface UserTempProps {}

const UserTemp: FC<UserTempProps> = () => {
    const [User, setUser] = useAtom(UserAtom)
    const picture = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setUser('fetch')
    }, [setUser])

    const update = () => {
        if (!picture.current || !picture.current.files) return
        const pic = picture.current.files[0]
        if (!pic) return

        setUser([
            'update',
            {
                picture: pic,
            },
        ])
    }

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
            <span>nickname: {User.nickname}</span>
            <span>picture: {User.picture}</span>
            <span>user_id: {User.user_id}</span>
            {User.picture && <img src={User.picture} width='200' alt='' />}
            <input type='file' ref={picture} />
            <button onClick={update}>Update</button>
        </div>
    )
}

export { UserTemp }
