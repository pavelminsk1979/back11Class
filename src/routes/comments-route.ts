import {Response, Router} from "express";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {STATUS_CODE} from "../common/constant-status-code";
import {IdCommentParam} from "../models/IdCommentParam";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {commentsSevrice} from "../servisces/comments-service";
import {commentIdMiddleware} from "../middlewares/commentsMiddleware/commentIdMiddleware";
import {commentIsOwnMiddleware} from "../middlewares/commentsMiddleware/commentIsOwnMiddleware";
import {RequestWithParamsWithBody} from "../allTypes/RequestWithParamsWithBody";
import {CreateComentBodyModel} from "../models/CreateComentBodyModel";
import {contentValidationComments} from "../middlewares/commentsMiddleware/contentValidationComments";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {isExistCommentMiddleware} from "../middlewares/commentsMiddleware/isExistCommentMiddleware";
import {likeStatusValidation} from "../middlewares/commentsMiddleware/likeStatusValidation";
import {LikeStatusBodyModel} from "../models/LikeStatusBodyModel";
import {isExistCommentMiddlewareById} from "../middlewares/commentsMiddleware/isExistCommentMiddlewareById";
import {idUserFromAccessTokenMiddleware} from "../middlewares/authMiddleware/idUserFromAccessTokenMiddleware";
import {IdStringParam} from "../models/IdStringParam";
import {newCommentsQueryRepository} from "../repositories/comments/new-comments-query-reposotory";
import {idMiddleware} from "../middlewares/commentsMiddleware/idMiddleware";


export const commentsRoute = Router({})



class CommentsController {

    async getCorrectComment (req: RequestWithParams<IdStringParam>, res: Response){
        try {

            /*вернуть данные одного коментария и внутри
                    данные по лайкам этого коментария*/

            const comment = await newCommentsQueryRepository.findCommentById(
                req.params.id,
                req.userId)

            if (comment) {
                return res.status(STATUS_CODE.SUCCESS_200).send(comment)
            } else {
                return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            }

        } catch (error) {
            console.log(' FIlE comments-routes.ts get-/:commentId' + error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async deleteCorrectComment (req: RequestWithParams<IdCommentParam>, res: Response){
        try {

            const isCommentDelete = await commentsSevrice.deleteComentById(req.params.commentId)

            if(isCommentDelete){
                return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
            } else {
                return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            }

        } catch (error) {
            console.log(' FIlE comments-routes.ts delete-/:commentId' + error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async updateCorrectComment (req: RequestWithParamsWithBody<IdCommentParam,CreateComentBodyModel>, res: Response){
        try {
            const isUpdateComment = await commentsSevrice.updateComment(req.params.commentId,req.body.content)

            if(isUpdateComment){

                return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
            }else {
                return res.sendStatus(STATUS_CODE.NO_RESPONSE_444)
            }

        } catch (error) {

            console.log(' FIlE comments-routes.ts put-/:commentId' + error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async setOrUpdateLikeStatusForCorrectComment(req: RequestWithParamsWithBody<IdCommentParam, LikeStatusBodyModel>, res: Response){
        try {

            await commentsSevrice.setOrUpdateLikeStatus(
                req.params.commentId,
                req.body.likeStatus,
                req.userIdLoginEmail.id)


            return res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } catch (error) {

            console.log(' FIlE comments-routes.ts put-/:commentId/like-status' + error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }
}

const commentController = new CommentsController()

commentsRoute.get('/:id',
    idMiddleware,
    isExistCommentMiddlewareById,
    idUserFromAccessTokenMiddleware,
    commentController.getCorrectComment)

commentsRoute.delete('/:commentId',
    commentIdMiddleware,
    isExistCommentMiddleware,
    authTokenMiddleware,
    commentIsOwnMiddleware,
    commentController.deleteCorrectComment)


commentsRoute.put('/:commentId',
    commentIdMiddleware,
    isExistCommentMiddleware,
    authTokenMiddleware,
    commentIsOwnMiddleware,
    contentValidationComments,
    errorValidationBlogs,
    commentController.updateCorrectComment)


commentsRoute.put('/:commentId/like-status',
    commentIdMiddleware,
    isExistCommentMiddleware,
    authTokenMiddleware,
    likeStatusValidation,
    errorValidationBlogs,
    commentController.setOrUpdateLikeStatusForCorrectComment)








