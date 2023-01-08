import React, { FC, useEffect, useRef } from 'react'

import { useAtom } from 'jotai'
import { UserAtom } from 'state'

function get_nickname() {
    let result = ''
    let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < Math.floor(Math.random() * 50); i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

const UserTemp: FC = () => {
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
                nickname: get_nickname(),
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
