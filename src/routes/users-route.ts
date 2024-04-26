import {Response, Router} from "express";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {CreateUserModel, IdUserModel, QueryUsersInputModal} from "../allTypes/userTypes";
import {authMiddleware} from "../middlewares/authMiddleware/authMiddleware";
import {loginValidationUsers} from "../middlewares/usersMiddlewares/loginValidationUsers";
import {passwordValidationUsers} from "../middlewares/usersMiddlewares/passwordValidationUsers";
import {emailValidationUsers} from "../middlewares/usersMiddlewares/emailValidationUsers";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";

import {STATUS_CODE} from "../common/constant-status-code";
import {RequestWithQuery} from "../allTypes/RequestWithQuery";
import {userQueryRepository} from "../repositories/users/user-query-repository";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {UserService} from "../servisces/users-service";
import {usersController} from "../composition-root";


export const usersRoute = Router({})

const postValidationUsers = () => [loginValidationUsers, passwordValidationUsers, emailValidationUsers]


export class UsersController {

  /*  usersService:UserService
    constructor(usersService:UserService) {
        this.usersService=usersService

        НИЖЕ сокращенный синтаксис
и одно заменяет другое
    }*/
    constructor(protected usersService:UserService) { }

    async getUsers(req: RequestWithQuery<QueryUsersInputModal>, res: Response) {
        const users = await userQueryRepository.getUsers(req.query)

        res.status(STATUS_CODE.SUCCESS_200).send(users)
    }

    async createUser(req: RequestWithBody<CreateUserModel>, res: Response) {
        try {

            const newUser = await this.usersService.createUser(req.body)

            if (newUser) {

                res.status(STATUS_CODE.CREATED_201).send(newUser)

            } else {
                res.sendStatus(STATUS_CODE.BAD_REQUEST_400)
            }
        } catch (error) {
            console.log('users-route.ts post /users' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async deleteCorrectUser(req: RequestWithParams<IdUserModel>, res: Response) {
        const isUserDelete = await this.usersService.deleteUserById(req.params.id)

        if (isUserDelete) {
            return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }
}

//const usersController = new UsersController(usersService)


usersRoute.get('/',
    authMiddleware,
    usersController.getUsers.bind(usersController))


usersRoute.post('/',
    authMiddleware,
    postValidationUsers(),
    errorValidationBlogs,
    usersController.createUser.bind(usersController))

usersRoute.delete('/:id',
    authMiddleware,
    usersController.deleteCorrectUser.bind(usersController))