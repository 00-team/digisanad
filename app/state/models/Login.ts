interface LoginType {
    phone: string
    stage: 'phone' | 'code'
    resend: boolean
    time: number
}

export { LoginType }
