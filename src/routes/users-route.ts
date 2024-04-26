import { Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware/authMiddleware";
import {loginValidationUsers} from "../middlewares/usersMiddlewares/loginValidationUsers";
import {passwordValidationUsers} from "../middlewares/usersMiddlewares/passwordValidationUsers";
import {emailValidationUsers} from "../middlewares/usersMiddlewares/emailValidationUsers";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {container} from "../composition-root";
import {UsersController} from "../controllers/user-controller";
import "reflect-metadata"



/*const usersController = ioc.getInstans<UsersController>(UsersController)*/


const usersController = container.resolve(UsersController)

export const usersRoute = Router({})

const postValidationUsers = () => [loginValidationUsers, passwordValidationUsers, emailValidationUsers]




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