import axios from 'axios'

import { MessageModel, UserModel, WalletModel } from 'state'

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
        const wallet: WalletModel = response.data
        wallet.next_update = Date.now() + wallet.next_update * 1000
        return wallet
    } catch (error) {
        console.log('error in [get_wallet] -- ' + error)
    }

    return null
}

const get_messages = async (token: string): Promise<MessageModel | null> => {
    try {
        const response = await axios.get('/api/messages/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })

        const messages: MessageModel = response.data

        return messages
    } catch (error) {
        console.log(error)
    }

    return null
}

export { user_get_me, get_wallet, get_messages }
