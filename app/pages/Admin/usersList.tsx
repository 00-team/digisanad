import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import { EditIcon } from 'icons'

import { useAtomValue } from 'jotai'
import { TokenAtom, UserModel } from 'state'

import './style/userlist.scss'

const UsersList: FC = () => {
    const token = useAtomValue(TokenAtom)
    const [users, setUsers] = useState<UserModel[]>([])

    const fetch_users = async () => {
        const response = await axios.post(
            '/api/admin/users/',
            {},
            { headers: { Authorization: 'Bearer ' + token } }
        )
        setUsers(response.data)
    }

    useEffect(() => {
        fetch_users()
    }, [token])

    return (
        <section className='users-container'>
            <h3 className='section_title'>کاربران سایت</h3>
            <div className='users-wrapper'>
                <table>
                    <thead className='title_small'>
                        <tr>
                            <th className='id'>شماره</th>
                            <th className='name'>نام</th>
                            <th className='lname'>نام خانوادگی</th>
                            <th className='phone'>شماره تلفن</th>
                            <th className='edit'>تنظیم</th>
                        </tr>
                    </thead>
                    <tbody className='title_smaller'>
                        {users.map(
                            ({ first_name, last_name, user_id, phone }) => {
                                return (
                                    <tr key={user_id}>
                                        <td>{user_id}</td>
                                        <td>{first_name}</td>
                                        <td>{last_name}</td>
                                        <td>{phone}</td>
                                        <td className='edit'>
                                            <a href={`/admin/user/${user_id}/`}>
                                                <EditIcon size={25} />
                                                تنظیم
                                            </a>
                                        </td>
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
