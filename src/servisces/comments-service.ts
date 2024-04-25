import {commentsRepository} from "../repositories/comments/comments-repository";
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";
import {likesCommentsRepository} from "../repositories/LikesCommentsRepository";


class ClassComentsService {
    async deleteComentById(idComent: string) {

        return commentsRepository.deleteComentById(idComent)

    }


    async updateComment(commentId: string, content: string) {
        return commentsRepository.updateComment(commentId, content)
    }


    async setOrUpdateLikeStatus(
        commentId: string,
        statusLike: StatusLike,
        userId: string) {


        /*    ищу в базе Лайков  один документ   по
         двум полям userId и commentId---*/
        const documentByUserId = await likesCommentsRepository.findDocumentByUserIdAndCommentId(userId,commentId)

        /*Если документа  нет тогда надо добавить
   newDocumentForCollectionLikesComments в базу*/


        if (!documentByUserId) {
            const newDocumentForCollectionLikesComments: LikeComment = {
                commentId, userId, statusLike}

            return likesCommentsRepository.addNewDocumentForLikeCommentCollention(newDocumentForCollectionLikesComments)
        }

        /*Если документ есть тогда надо изменить
        statusLike на приходящий */

        return likesCommentsRepository.setNewStatusLike(userId,commentId,  statusLike)

    }
}

export const commentsSevrice = new ClassComentsService()