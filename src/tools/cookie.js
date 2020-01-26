export function setCookie (name, value, seconds = 0) {
    let expires = ''
    if (seconds !== 0) {
        let date = new Date()
        date.setTime(date.getTime() + (seconds * 1000))
        expires = '; expires=' + date.toGMTString()
    }
    // document.cookie = name+"="+escape(value)+expires+"; path=/";
    document.cookie = `${name}=${escape(value)}${expires}; path=/`
}
export function getCookie (name) {
    let nameEQ = name + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length)
        }
        if (c.indexOf(nameEQ) === 0) {
            return unescape(c.substring(nameEQ.length, c.length))
        }
    }
    return false
}
export function deleteCookie (name) {
    setCookie(name, '', -1)
}
