export function isValidEmail(email) {
    if (typeof email !== "string") return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
    return typeof password === "string" && password.length >= 6;
}

export function sanitize(input) {
    if (typeof input !== "string") return input;
    return input.trim();
}
