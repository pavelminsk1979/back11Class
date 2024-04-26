import {UsersRepository} from "./repositories/users/users-repository";
import {UserService} from "./servisces/users-service";
import {UsersController} from "./routes/users-route";


const usersRepository = new UsersRepository()

const usersService = new UserService(usersRepository)

export const usersController = new UsersController(usersService)