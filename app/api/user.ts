import axios from 'axios'

import { UserModel, WalletModel } from 'state'

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

const get_wallet = async (token: string): Promise<WalletModel | null> => {
    try {
        const response = await axios.get('/api/user/wallet/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        return response.data
    } catch (error) {
        console.log('error in [get_wallet] -- ' + error)
    }

    return null
}

export { user_get_me, get_wallet }
