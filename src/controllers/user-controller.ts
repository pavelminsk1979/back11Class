import {UserService} from "../servisces/users-service";
import {RequestWithQuery} from "../allTypes/RequestWithQuery";
import {CreateUserModel, IdUserModel, QueryUsersInputModal} from "../allTypes/userTypes";
import {Response} from "express";
import {userQueryRepository} from "../repositories/users/user-query-repository";
import {STATUS_CODE} from "../common/constant-status-code";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {inject, injectable} from "inversify";



@injectable()
export class UsersController {

    /*  usersService:UserService
      constructor(usersService:UserService) {
          this.usersService=usersService

          НИЖЕ сокращенный синтаксис
  и одно заменяет другое
      }*/
    constructor( protected usersService:UserService) { }

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