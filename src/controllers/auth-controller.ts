import {RequestWithBody} from "../allTypes/RequestWithBody";
import {
    AuthCodeConfirmationModel,
    AuthEmailModel,
    AuthModel,
    AuthRegistrationModel,
    NewPasswordModel
} from "../allTypes/authTypes";
import {Response} from "express";
import {AccessAndRefreshToken} from "../allTypes/usersDevicesTypes";
import {loginService} from "../servisces/login-service";
import {STATUS_CODE} from "../common/constant-status-code";
import {updateRefreshTokenService} from "../servisces/update-refreshToken-service";
import {userMaperForMeRequest} from "../mapers/userMaperForMeRequest";
import {authService} from "../servisces/auth-service";
import {logoutService} from "../servisces/logout-service";



 export  class AuthController {

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