import {ContentRefreshToken} from "../allTypes/usersDevicesTypes";
import {tokenJwtServise} from "./token-jwt-service";
import {usersDevicesRepository} from "../repositories/usersDevices/usersDevices-repository";


class ClassLogoutService {

    async logout(refreshToken:string){

        const result :ContentRefreshToken|null =  await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if(!result) return null

        const isDelete = await usersDevicesRepository.deleteDevice(result.deviceId,result.issuedAtRefreshToken)

        if(isDelete){return true} else {return false}

    }

}

export const logoutService = new ClassLogoutService