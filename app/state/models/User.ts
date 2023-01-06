interface User {
    user_id: number
    token: string | null
    picture: string | null
    nickname: string | null
    phone: string | null
}

export { User as UserModel }
