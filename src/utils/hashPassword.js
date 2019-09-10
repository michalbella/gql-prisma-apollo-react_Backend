import bcrypt from 'bcryptjs'

const hashPassword = (password) =>{
    if (password.length < 8) {
        throw new Error('min 8 characters')
    }

    return bcrypt.hash(password, 10)
}

export { hashPassword as default }