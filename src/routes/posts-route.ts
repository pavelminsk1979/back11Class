import {Response, Router} from "express";
import {STATUS_CODE} from "../common/constant-status-code";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {IdStringGetAndDeleteModel} from "../models/IdStringGetAndDeleteModel";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {CreateAndUpdatePostModel} from "../models/CreateAndUpdatePostModel";
import {titleValidationPosts} from "../middlewares/postsMiddlewares/titleValidationPosts";
import {authMiddleware} from "../middlewares/authMiddleware/authMiddleware";
import {shortDescriptionValidationPosts} from "../middlewares/postsMiddlewares/shortDescriptionValidationPosts";
import {contentValidationPosts} from "../middlewares/postsMiddlewares/contentValidationPosts";
import {blogIdValidationPosts} from "../middlewares/postsMiddlewares/blogIdValidationPosts";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {RequestWithParamsWithBody} from "../allTypes/RequestWithParamsWithBody";
import {QueryBlogInputModal} from "../allTypes/postTypes";
import {postsSevrice} from "../servisces/posts-service";
import {postQueryRepository} from "../repositories/post-query-repository";
import {RequestWithQuery} from "../allTypes/RequestWithQuery";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {CreateComentPostIdModel} from "../models/CreateComentPostIdModel";
import {CreateComentBodyModel} from "../models/CreateComentBodyModel";
import {contentValidationComments} from "../middlewares/commentsMiddleware/contentValidationComments";
import {ResultCode} from "../common/object-result";
import {RequestWithParamsWithQuery} from "../allTypes/RequestWithParamsWithQuery";
import {QueryInputModalGetCommentsForCorrectPost} from "../allTypes/commentTypes";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {postIdMiddleware} from "../middlewares/postsMiddlewares/postIdMiddleware";
import {isExistPostByPostIdMiddleware} from "../middlewares/postsMiddlewares/isExistPostByPostIdMiddleware";
import {idUserFromAccessTokenMiddleware} from "../middlewares/authMiddleware/idUserFromAccessTokenMiddleware";


export const postsRoute = Router({})


const createAndUpdateValidationPosts = () => [titleValidationPosts, shortDescriptionValidationPosts, contentValidationPosts, blogIdValidationPosts]


class PostsController {

    async getPosts (req: RequestWithQuery<QueryBlogInputModal>, res: Response){
        const sortDataPost = {
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10,
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
        }

        const posts = await postQueryRepository.getPosts(sortDataPost)

        res.status(STATUS_CODE.SUCCESS_200).send(posts)
    }

    async getCorrectPost (req: RequestWithParams<IdStringGetAndDeleteModel>, res: Response){
        const post = await postQueryRepository.findPostById(req.params.id)
        if (post) {
            res.status(STATUS_CODE.SUCCESS_200).send(post)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async createPost (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response){
        const newPost = await postsSevrice.createPost(req.body)
        res.status(STATUS_CODE.CREATED_201).send(newPost)
    }

    async updateCorrectPost (req: RequestWithParamsWithBody<IdStringGetAndDeleteModel, CreateAndUpdatePostModel>, res: Response){
        const isUpdatePost = await postsSevrice.updatePost(req.params.id, req.body)
        if (isUpdatePost) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async deleteCorrectPost (req: RequestWithParams<IdStringGetAndDeleteModel>, res: Response){
        const isPostDelete = await postsSevrice.deletePostById(req.params.id)
        if (isPostDelete) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    }

    async createCommentForCorrectPost(req: RequestWithParamsWithBody<CreateComentPostIdModel, CreateComentBodyModel>, res: Response){
        try {
            // создать новый коментарий для корректного
            //поста и вернуть данные этого коментария и также структуру(с
            //нулевыми значениями) данных о лайках к этому посту

            const newCommentForPost = await postsSevrice.createCommentForPostByPostId(
                req.params.postId,
                req.body.content,
                req.userIdLoginEmail.id,
                req.userIdLoginEmail.login)

            if (newCommentForPost.code === ResultCode.NotFound) {
                return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            }

            if (newCommentForPost.code === ResultCode.Success) {
                return res.status(STATUS_CODE.CREATED_201).send(newCommentForPost.data)

            } else {

                return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            }

        } catch (error) {

            console.log(' FIlE post-routes.ts post-/:postId/comments' + error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }

    async getCommentsFromCorrectPost(req: RequestWithParamsWithQuery<CreateComentPostIdModel, QueryInputModalGetCommentsForCorrectPost>, res: Response){
        //вернуть все коментарии(массив) корректного поста
        //и у каждого коментария будут данные о лайках
        //к этому коментарию

        const sortData = {
            //isNaN  проверяет, является ли переданное значение не числом (NaN)

            //Если req.query.pageNumber не является числом или не может быть
            //преобразовано в число, то isNaN(Number(req.query.pageNumber))
            // вернет true.
            pageNumber: isNaN(Number(req.query.pageNumber))
                ? 1
                : Number(req.query.pageNumber),

            pageSize: isNaN(Number(req.query.pageSize))
                ? 10
                : Number(req.query.pageSize),

            //Оператор ??- оператор нулевого слияния
            //Если req.query.sortBy равно null или undefined, то
            // переменная sortBy будет равна 'createdAt'.
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
        }


        try {

            const comments = await commentsQueryRepository.getCommentsForCorrectPost(
                req.params.postId,
                sortData,
                req.userId)

            //console.log(comments)

            return res.status(STATUS_CODE.SUCCESS_200).send(comments)



        } catch (error) {

            console.log(' FIlE post-routes.ts get-/:postId/comments' + error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
        }
    }
}


const postController = new PostsController()


postsRoute.get('/',postController.getPosts )


postsRoute.get('/:id', postController.getCorrectPost)


postsRoute.post('/',
    authMiddleware,
    createAndUpdateValidationPosts(),
    errorValidationBlogs,
    postController.createPost)

postsRoute.put('/:id',
    authMiddleware,
    createAndUpdateValidationPosts(),
    errorValidationBlogs,
    postController.updateCorrectPost)

postsRoute.delete('/:id', authMiddleware,
    postController.deleteCorrectPost)


postsRoute.post('/:postId/comments',
    postIdMiddleware,
    authTokenMiddleware,
    contentValidationComments,
    errorValidationBlogs,
    postController.createCommentForCorrectPost )

postsRoute.get('/:postId/comments',
    postIdMiddleware,
    isExistPostByPostIdMiddleware,
    idUserFromAccessTokenMiddleware,
    postController.getCommentsFromCorrectPost)









