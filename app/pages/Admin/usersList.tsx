import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'

import { useAtomValue } from 'jotai'
import { TokenAtom, UserModel } from 'state'

import './style/userlist.scss'

const UsersList: FC = () => {
    const token = useAtomValue(TokenAtom)

    const [users, setusers] = useState<UserModel[] | null>(null)

    const fetch_users = async () => {
        const response = await axios.post(
            '/api/admin/users/',
            {},
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        )
        setusers(response.data)
    }

    useEffect(() => {
        fetch_users()
    }, [])
    useEffect(() => {
        console.log(users)
    }, [users])

    return <section className='users-container'>UsersList</section>
}

export default UsersList
