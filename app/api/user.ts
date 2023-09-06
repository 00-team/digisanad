import axios from 'axios'

import { PriceModel, UserModel } from 'state'

const user_get_me = async (token: string): Promise<UserModel | null> => {
    try {
        const response = await axios.get('/api/user/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        return response.data
    } catch (error) {
        HandleError(error)
    }

    return null
}

async function fetch_price(token: string): Promise<PriceModel | null> {
    try {
        const response = await axios.get('/api/user/price/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    } catch (error) {
        HandleError(error)
    }
    return null
}

export { user_get_me, fetch_price }
