type RTPF = ['text' | 'uid', string][]

function parseFields(text: string): RTPF {
    let result: RTPF = []

    let s = text.indexOf('({')
    let e = text.indexOf('})')

    if (s < e && s != -1) {
        if (s > 0) result.push(['text', text.substring(0, s)])
        result.push(['uid', text.substring(s + 2, e)])

        result.push(...parseFields(text.substring(e + 2)))
    } else {
        if (text) result.push(['text', text])
    }

    return result
}

export { parseFields }
