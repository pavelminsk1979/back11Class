import {app} from "./settings";
import { runDb} from "./db/mongoDb";

 const port = 3000


     //тут вход в приложение

//Определяется асинхронная функция startApp(), которая будет запускать приложение.
const startApp=async ()=>{
     //подключение к базе данных
    await runDb()

    //толькo после успешного подключения к базе данных
        //активирую данное приложение чтоб оно слушало HTTP
    //чтоб пользователи могли стучатся

    /*После успешного подключения к базе данных, вызывается метод listen() объекта app , чтобы он начал прослушивать входящие HTTP-запросы на указанном порту. Когда сервер будет запущен и начнет прослушивать указанный порт, будет выведено сообщение в консоль.*/
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
//Функция startApp() вызывается в конце кода, чтобы запустить приложение.
startApp()


