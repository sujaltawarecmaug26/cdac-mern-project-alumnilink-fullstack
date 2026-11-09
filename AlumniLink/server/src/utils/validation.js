export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password) => {
    return password.length >= 8 && /[0-9]/.test(password);
};

export const isValidId = (id) => {
    return /^\d+$/.test(String(id));
};
