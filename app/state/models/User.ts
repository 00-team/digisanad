interface User {
    first_name: string
    last_name: string
    phone: string | null
    national_id: string
    birth_date: string[]
    email: string
    address: string
    postal_code: string
    user_id: number | null
}

export { User as UserModel }
