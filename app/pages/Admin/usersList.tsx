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

    return (
        <section className='users-container'>
            <h3 className='section_title'>کاربران سایت</h3>
            <div className='users-wrapper'>
                <table>
                    <thead className='title_small'>
                        <th className='id'>شماره</th>
                        <th className='name'>نام</th>
                        <th className='lname'>نام خانوادگی</th>
                        <th className='phone'>شماره تلفن</th>
                    </thead>
                    <tbody className='title_smaller'>
                        {users &&
                            users.map(
                                ({ first_name, last_name, user_id, phone }) => {
                                    return (
                                        <tr>
                                            <td>{user_id}</td>
                                            <td>{first_name}</td>
                                            <td>{last_name}</td>
                                            <td>{phone}</td>
                                        </tr>
                                    )
                                }
                            )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default UsersList
