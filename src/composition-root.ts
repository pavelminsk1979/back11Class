import {UsersRepository} from "./repositories/users/users-repository";
import {UserService} from "./servisces/users-service";
import {UsersController} from "./controllers/user-controller";
import {Container} from "inversify";
import "reflect-metadata"



const obj:any[]=[]

const usersRepository = new UsersRepository()
obj.push(usersRepository)

const usersService = new UserService(usersRepository)
obj.push(usersService)

 const usersController = new UsersController(usersService)
obj.push(usersController)

export const ioc={
    getInstans<T>(ClassType:any){
        const targetInstance = obj.find(o=>o instanceof ClassType)
        return targetInstance as T
    }
}

export const container = new Container();
container.bind<UsersController>(UsersController).to(UsersController);
container.bind<UserService>(UserService).to(UserService);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);