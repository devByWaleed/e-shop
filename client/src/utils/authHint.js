const key = (role) => `authHint_${role}`

export const setHint = (role) => {
    try { localStorage.setItem(key(role), '1') } catch (e) { /* storage blocked */ }
}

export const clearHint = (role) => {
    try { localStorage.removeItem(key(role)) } catch (e) { /* storage blocked */ }
}

export const hasHint = (role) => {
    try { return localStorage.getItem(key(role)) === '1' } catch (e) { return false }
}