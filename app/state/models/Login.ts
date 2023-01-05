interface LoginType {
    stage: 'phone' | 'code'
    resend: boolean
    time: number
}

export { LoginType }
