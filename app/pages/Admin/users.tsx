import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import { EditIcon } from 'icons'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom, UserModel } from 'state'

import './style/userlist.scss'

const UsersList: FC = () => {
    const token = useAtomValue(TokenAtom)
    const [users, setUsers] = useState<UserModel[]>([])
    const { pid } = useParams()
    const navigate = useNavigate()
    let page = parseInt(pid || '0') || 0

    const fetch_users = async () => {
        try {
            const response = await axios.post(
                '/api/admin/users/',
                { page },
                { headers: { Authorization: 'Bearer ' + token } }
            )
            if (!response.data.length && page) {
                navigate('/admin/users/' + (page - 1))
                return
            }
            setUsers(response.data)
        } catch (error) {
            HandleError(error)
            setUsers([])
        }
    }

    useEffect(() => {
        fetch_users()
    }, [token, page])

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
            <div className='actions title_smaller'>
                <div className='pagination'>
                    <button
                        disabled={page == 0}
                        onClick={() => navigate('/admin/users/' + (page - 1))}
                    >
                        صفحه قبلی
                    </button>
                    <button
                        onClick={() => navigate('/admin/users/' + (page + 1))}
                    >
                        صفحه بعدی
                    </button>
                </div>
            </div>
        </section>
    )
}

export default UsersList
