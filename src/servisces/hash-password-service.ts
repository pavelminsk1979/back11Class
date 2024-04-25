import bcrypt from "bcrypt";


class ClassHashPasswordService {

    async generateHash(password:string) {
        const  salt = await  bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    }

    async checkPassword(password:string,hash:string){
        return bcrypt.compare(password,hash)
    }

}

export const hashPasswordService = new ClassHashPasswordService()