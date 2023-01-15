interface User {
    address: string
    birth_date: string[]
    email: string
    first_name: string
    last_name: string
    national_id: string
    phone: string | null
    postal_code: string
    token: string | null
    user_id: number | null
    wallet: number
}

export { User as UserModel }
