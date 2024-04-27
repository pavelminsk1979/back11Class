import { Router} from "express";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {loginAndEmailValidationAuth} from "../middlewares/authMiddleware/loginAndEmailValidationAuth";
import {passwordValidationAuth} from "../middlewares/authMiddleware/passwordValidationAuth";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {loginValidationUsers} from "../middlewares/usersMiddlewares/loginValidationUsers";
import {passwordValidationUsers} from "../middlewares/usersMiddlewares/passwordValidationUsers";
import {emailValidationUsers} from "../middlewares/usersMiddlewares/emailValidationUsers";
import {codeConfirmationValidation} from "../middlewares/authMiddleware/codeConfirmationValidation";
import {isConfirmedFlagValidation} from "../middlewares/authMiddleware/isConfirmedFlagValidation";
import {isExistLoginValidator} from "../middlewares/authMiddleware/isExistLoginValidator";
import {isExistEmailValidation} from "../middlewares/authMiddleware/isExistEmailValidation";
import {visitLimitMiddleware} from "../middlewares/commonMiddlewares/visitLimitMiddleware";
import {newPasswordValidation} from "../middlewares/usersMiddlewares/newPasswordValidation";
import {recoveryCodeConfirmationValidation} from "../middlewares/authMiddleware/recoveryCodeConfirmationValidation";
import {AuthController} from "../controllers/auth-controller";


export const authRoute = Router({})

const postValidationAuth = () => [loginAndEmailValidationAuth, passwordValidationAuth]

const postValidationForRegistration = () => [loginValidationUsers, passwordValidationUsers, emailValidationUsers, isExistLoginValidator, isExistEmailValidation]




const authController = new AuthController()


authRoute.post('/login',
    visitLimitMiddleware,
    postValidationAuth(),
    errorValidationBlogs,
    authController.login)

authRoute.post('/refresh-token',
    authController.refreshToken)

authRoute.get('/me',
    authTokenMiddleware,
    authController.me)

authRoute.post('/registration',
    visitLimitMiddleware,
    postValidationForRegistration(),
    errorValidationBlogs,
    authController.registration)

authRoute.post('/registration-confirmation',
    visitLimitMiddleware,
    codeConfirmationValidation,
    errorValidationBlogs,
    authController.registrationConfirmation)

authRoute.post('/registration-email-resending',
    visitLimitMiddleware,
    emailValidationUsers,
    isConfirmedFlagValidation,
    errorValidationBlogs,
    authController.registrationEmailResending)

authRoute.post('/logout',
    authController.logout)


/*Востановление пароля через подтверждение по электронной почте.
    Электронное письмо должно быть отправлено С КОДОМ ВОСТАНОВЛЕНИЯ ВНУТРИ*/
authRoute.post('/password-recovery',
    visitLimitMiddleware,
    emailValidationUsers,
    errorValidationBlogs,
    authController.passwordRecovery)


/*Подтверждение и Восстановление (recovery) нового пароля и в базу данных помещаю
ХЭШНОВОГОПАРОЛЯ(passwordHash).  В теле запроса приходит КОД и новый пароль
который на фронте условный пользователь создал*/
authRoute.post('/new-password',
    visitLimitMiddleware,
    newPasswordValidation,
    recoveryCodeConfirmationValidation,
    errorValidationBlogs,
    authController.newPassword)


