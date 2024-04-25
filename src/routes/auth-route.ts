import {Response, Router} from "express";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {STATUS_CODE} from "../common/constant-status-code";
import {loginAndEmailValidationAuth} from "../middlewares/authMiddleware/loginAndEmailValidationAuth";
import {passwordValidationAuth} from "../middlewares/authMiddleware/passwordValidationAuth";
import {
    AuthCodeConfirmationModel,
    AuthEmailModel,
    AuthModel,
    AuthRegistrationModel,
    NewPasswordModel
} from "../allTypes/authTypes";
import {authService} from "../servisces/auth-service";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {userMaperForMeRequest} from "../mapers/userMaperForMeRequest";
import {loginValidationUsers} from "../middlewares/usersMiddlewares/loginValidationUsers";
import {passwordValidationUsers} from "../middlewares/usersMiddlewares/passwordValidationUsers";
import {emailValidationUsers} from "../middlewares/usersMiddlewares/emailValidationUsers";
import {codeConfirmationValidation} from "../middlewares/authMiddleware/codeConfirmationValidation";
import {isConfirmedFlagValidation} from "../middlewares/authMiddleware/isConfirmedFlagValidation";
import {isExistLoginValidator} from "../middlewares/authMiddleware/isExistLoginValidator";
import {isExistEmailValidation} from "../middlewares/authMiddleware/isExistEmailValidation";
import {visitLimitMiddleware} from "../middlewares/commonMiddlewares/visitLimitMiddleware";
import {loginService} from "../servisces/login-service";
import {AccessAndRefreshToken} from "../allTypes/usersDevicesTypes";
import {updateRefreshTokenService} from "../servisces/update-refreshToken-service";
import {logoutService} from "../servisces/logout-service";
import {newPasswordValidation} from "../middlewares/usersMiddlewares/newPasswordValidation";
import {recoveryCodeConfirmationValidation} from "../middlewares/authMiddleware/recoveryCodeConfirmationValidation";


export const authRoute = Router({})

const postValidationAuth = () => [loginAndEmailValidationAuth, passwordValidationAuth]

const postValidationForRegistration = () => [loginValidationUsers, passwordValidationUsers, emailValidationUsers, isExistLoginValidator, isExistEmailValidation]


class AuthController {
    async login(req: RequestWithBody<AuthModel>, res: Response) {
        try {

            const result: AccessAndRefreshToken | null = await loginService.loginUser(req)

            if (result) {
                res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,})
                res.status(STATUS_CODE.SUCCESS_200).send({"accessToken": result.accessToken})
            } else {
                res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
            }

        } catch (error) {
            console.log('auth-routes.ts /login' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }


    async refreshToken(req: any, res: Response) {

        try {
            const refreshToken = req.cookies.refreshToken

            const result = await updateRefreshTokenService.updateRefreshToken(refreshToken)

            if (result) {
                res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,})
                res.status(STATUS_CODE.SUCCESS_200).send({"accessToken": result.accessToken})
            } else {
                res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
            }
        } catch (error) {
            console.log('auth-routes.ts /refresh-token' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }


    async me(req: any, res: Response) {

        try {

            const userModel = await userMaperForMeRequest(req.userIdLoginEmail)
            res.status(STATUS_CODE.SUCCESS_200).send(userModel)

        } catch (error) {
            console.log(' FIlE auth-routes.ts /me' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async registration(req: RequestWithBody<AuthRegistrationModel>, res: Response) {
        try {
            await authService.registerUser(req.body.login, req.body.email, req.body.password)

            res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } catch (error) {
            console.log(' FIlE auth-routes.ts /registration' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async registrationConfirmation(req: RequestWithBody<AuthCodeConfirmationModel>, res: Response){
        try {
            await authService.updateConfirmationCode(req.body.code)

            res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } catch (error) {
            console.log(' FIlE auth-routes.ts /registration-confirmation' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }


    async registrationEmailResending(req: RequestWithBody<AuthEmailModel>, res: Response) {

        try {
            await authService.updateCodeConfirmationAndExpirationDate(req.body.email)

            res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } catch (error) {
            console.log(' FIlE auth-routes.ts /registration-email-resending' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async logout(req: any, res: any){
        try {
            const refreshToken = req.cookies.refreshToken

            const isLogout = await logoutService.logout(refreshToken)


            if (isLogout) {
                res.sendStatus(STATUS_CODE.NO_CONTENT_204)

            } else {
                res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
            }


        } catch (error) {
            console.log('auth-routes.ts /logout' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async passwordRecovery(req: RequestWithBody<AuthEmailModel>, res: Response){

        try {
            await authService.sendEmailForRecoveryPassword(req.body.email)

            res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } catch (error) {
            console.log('auth-routes.ts /password-recovery' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async newPassword(req: RequestWithBody<NewPasswordModel>, res: Response){
        try {
            await authService.recoveryNewPassword(req.body.newPassword, req.body.recoveryCode)
            //ecли КОД валидный И НОВЫЙ ПАРОЛЬ установлен в базу данных
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } catch (error) {
            console.log('auth-routes.ts /password-recovery' + error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }
}


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


