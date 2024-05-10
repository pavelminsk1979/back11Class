import "reflect-metadata"
import {UsersRepository} from "./repositories/users/users-repository";
import {UserService} from "./servisces/users-service";
import {UsersController} from "./controllers/user-controller";
import {Container, injectable} from "inversify";

/*В ЭТОМ ФАЙЛЕ -СБОРОЧНЫЙ ЦЕХ....СОЗДАЁТСЯ ОБЬЕКТ   container
И В НЕМ ЗАВИСИМОСТИ(ПОДОБЬЕКТЫ) И ТУТ ОПРЕДЕЛЯЕТСЯ КАКИЕ
ИМЕННО ЗАВИСИМОСТИ БУДУТ ПОДСТАВЛЕНЫ*/

/*

ДО ТРЕХ РЯДОВ ПАЛОК  это самописный   ioc котейнер
ПОСЛЕ-ЭТО БИБЛИОТЕКА INVERSIFY


const obj:any[]=[]  тут будут все созданные обьекты



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




    ИСПОЛЬЗОВАНИЕ ТАКОЕ -- в файле  user-route.ts

    const userController = ioc.getInstans(UserController)


    !!!ВАЖНО ТОЛЬКО В ОДНОМ МЕСТЕ В ПРиЛОЖЕНИИ
    ПРОПИСАТЬ  ioc.getInstans   А ДАЛЕЕ ВЕЗДЕ В
    ПРОЛОЖЕНИИ ИСПОЛЬЗОВАТЬ   ОБЬЕКТ  userController
}*/



//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



/*
INVERSIFY -ФРЕЙМВОРК  ПОМОЖЕТ И СОЗДАВАТЬ ЗАВИСИМОСТИ
И ПОДСТАВЛЯТЬ РАЗЛИЧНЫЕ ЗАВИСИМОСТ
IOC контэйнер будет создан этим фреймворком


yarn add inversify@5.0.5 reflect-metadata




в файле  tsconfig.json  раскоментирую
примерно  18 строка
это чтоб декораторы работали
"experimentalDecorators": true,
    "emitDecoratorMetadata": true,*/




/*https://github.com/inversify/inversifyJS/tree/master/wiki

    тут рассматривал разделы
--------    INSTALATION
---Vanilla JavaScript example
---Support for classes*/






/*Здесь создается новый экземпляр класса Container из библиотеки InversifyJS. Контейнер служит для регистрации и разрешения зависимостей в приложении. В НЕМ БУДЕТ ОПРЕДЕЛЯТСЯ
* КАКИЕ ЗАВИСИМОСТИ КОМУ ПОДСТАВЛЯТЬ//// хотя в конце урока
* и я написал это в самом низу конспекта КАК ПРОПИСЫВАЕТСЯ
* декоратор с помощью которого определяется зависимость */
export const container = new Container();

/*использование  container   в одном месте в приложении
в файле   src/route/user-route.ts
const usersController = container.resolve(UsersController)

--получаю обьект конкретного класса
*/


container.bind<UsersController>(UsersController).to(UsersController);
/*-


---<UsersController>  это типизация

container.bind<UsersController>(UsersController)  в этом коде такой
смысл--если понадобится UsersController тогда следующая часть
---   .to(UsersController)   тогда создай обьект  UsersController

В этой строке происходит регистрация класса UsersController в контейнере container.

в Nest  это будет рассмотрено


используется контэйнер в файле user.routes.ts
const usersController = container.resolve(UsersController)
--*/




container.bind<UserService>(UserService).to(UserService);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);



/*
в файле  src/controller/user-controller.ts
@injectable()
декоратор-это сущность которая добавляет классу метаданные
 это для INVERSIFY -ФРЕЙМВОРК    добавить к классам всем в цепочке
  class UsersController          class UserService
  class UsersRepository


  также в этом файле и в файлах где классы надо закинуть
  на первую строку в коде
  import "reflect-metadata"
 */






/*
еще ошибка будет-и чтоб ее убрать надо в этом файле
прописать а самом верху  импорт import "reflect-metadata"

и также в файле  user-repository.ts*/




/*
Чтобы добавить зависимость --например ХХХ  в  UserService    я  этом файле прописываю

container.bind<ХХХ>(ХХХ).to(ХХХ);
гдето расписываю класс  ХХХ
и далеев файле  user-service

@injectable()
export class UserService {

    constructor( protected  usersRepository:UsersRepository,
                 protected ХХХ:ХХХ)

  БИБЛИОТЕКА САМА ОПРЕДЕЛЯЕТ ЗАВИСИМОСТИ ДЛЯ КЛАССОВ
  БЛАГОДОРЯ ДЕКОРАТОРАМ




      КАК ПРОПИСЫВАЕТСЯ
* декоратор с помощью которого определяется зависимость
--НО У МЕНЯ РАБОТАЕТ И БЕЗ НЕГО А С НИМ
ОШИБКА ПАДАЕТ---ВОБЩЕМ ТИПО И НЕНАДО ДЕКАРАТОР ТУТ
ДЛЯ ДАННОЙ БИБЛИОТЕКИ
       export class UsersController {
        constructor(@inject(UserService) protected usersService:UserService) { }
                 */
