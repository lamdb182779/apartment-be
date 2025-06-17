import * as bcrypt from "bcrypt"
import * as crypto from 'crypto'
import { ILike } from "typeorm"
import { IsUUID } from "class-validator"
const saltRounds = 10

export const hashPassword = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds)
    } catch (error) {
        console.log("Hash password error: ", error)
    }
}

export const comparePassword = async (plainPassword: string, hashPassword: string) => {
    try {
        return await bcrypt.compare(plainPassword, hashPassword)
    } catch (error) {
        console.log("Compare password error: ", error)
    }
}

export const generatePassword = (length: number) => {
    return crypto.randomBytes(length).toString('base64').slice(0, length)
}

export const generateUsername = (name: string) => {
    const normal = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
    const lower = normal.toLowerCase()
    const split = lower.split(" ")
    let username = split[split.length - 1]
    split.map((item, index) => {
        if (index !== split.length - 1) {
            username = username + item[0]
        }
    })

    const digits = '1234567890'
    const seed = Date.now()
    let result = ''

    const length = Math.floor(((seed / 1000) % 4) + 1)

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(((seed + i) % 1000 + Math.random()) * digits.length) % digits.length
        result += digits[randomIndex]
    }
    return username + result
}

export const transformFilterToILike = (filter: Record<string, any>): Record<string, any> => {
    const transformedFilter: Record<string, any> = {}

    for (const key in filter) {
        if (filter[key] !== undefined && filter[key] !== null) {
            transformedFilter[key] = ILike(`%${filter[key]}%`)
        }
    }

    return transformedFilter
}

export const generateSecureOtp = (length: number = 6): string => {
    const digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789';
    const buffer = crypto.randomBytes(length);
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[buffer[i] % digits.length];
    }
    return otp;
}

export const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split('@');

    if (localPart.length <= 4) {
        return `${localPart[0]}***${localPart.slice(-2)}@${domain}`;
    }

    const maskedLocalPart = `${localPart[0]}***${localPart.slice(-2)}`;
    return `${maskedLocalPart}@${domain}`;
}

export const getName = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1];
}

export class IdParamDto {
    @IsUUID(undefined, { message: 'Id không đúng định dạng!' })
    id: string
}

export const roles = {
    accountant: 22,
    owner: 31,
    resident: 32,
    manager: 12,
    technician: 23,
    receptionist: 21
}


export const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

export const hasLetterNumber = (pw: string) => {
    return /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw)
}




