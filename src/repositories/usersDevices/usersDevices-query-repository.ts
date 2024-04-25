import { usersDevicesModel} from "../../db/mongoDb";
import {deviceMaper} from "../../mapers/deviceMaper";


class UsersDevicesQueryRepository {

    async getDevices(userId: string) {

        const devices = await usersDevicesModel.find({userId})


        return devices.map(deviceMaper)
    }


}

export const usersDevicesQueryRepository = new UsersDevicesQueryRepository