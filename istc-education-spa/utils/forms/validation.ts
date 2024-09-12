export const validateLength = (value: string, minLength: number, maxLength: number) => {
    return value.length >= minLength && value.length <= maxLength;
}

export const validatePhone = (phone: string) => {
    const phoneRegex = /^1?\s?\(?([0-9]{3})\)?\s?([0-9]{3})[-.●]?([0-9]{4})$/;
    return phone === '' || phoneRegex.test(phone) ? '' : 'Invalid phone number';
};

export const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email === '' || emailRegex.test(email) ? '' : 'Invalid email';
};

export const validateZip = (zip: string) => {
    const zipRegex = /^[0-9]{5}$/;
    return zip === '' || zipRegex.test(zip) ? '' : 'Invalid zip code';
}