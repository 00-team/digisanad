import axios from 'axios'

import { UserModel } from 'state'

const user_get_me = async (token: string): Promise<UserModel | null> => {
    try {
        const response = await axios.get('/api/user/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        return response.data
    } catch (error) {
        console.log('user get me error -- ' + error)
    }

    return null
}
export { user_get_me }
