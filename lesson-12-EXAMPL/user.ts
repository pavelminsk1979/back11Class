/*

/!*ЗАДАЧА - юзер имеет кошельки и может делать переводы с них
другим юзерам
расположить 3 файла
exampl.test.ts
user.ts
wallet.ts*!/



import {Wallet} from "./wallet";



export class User1 {

    public wallets :Wallet[]=[]

    constructor() {

    }

    createWallet(){
//в this попадёт( смотрю
// туда где вызов в тестах ---user1.createWallet())
// --значит ---user1 будет в this
const newWallet = new Wallet (this)
        this.wallets.push(newWallet)
            // в массив добавится один обьект
return newWallet
       // newWallet  это-- {owner:user1}
    }
}*/

/////////////////////////////////////////////////////////
                        // 1
////////////////////////////////////////////////////////////



/*

/!* первоначальнаяЗАДАЧА - юзер имеет кошельки и может делать переводы с них
другим юзерам
расположить 3 файла
exampl.test.ts
user.ts
wallet.ts*!/



import {Wallet} from "./wallet";



export class User1 {

    public wallets :Wallet[]=[]

    constructor() {

    }

    createWallet(){
//в this попадёт( смотрю
// туда где вызов в тестах ---user1.createWallet())
// --значит ---user1 будет в this
        const newWallet = new Wallet (this)
        this.wallets.push(newWallet)
        // в массив добавится один обьект
        return newWallet
        // newWallet  это-- {owner:user1}
    }
}*/


///////////////////////////////////////////////////////////
                     //2
/////////////////////////////////////////////////////////////



/*первоначальная ЗАДАЧА - юзер имеет кошельки и может делать переводы с них
другим юзерам
расположить 3 файла
exampl.test.ts
user.ts
wallet.ts*/


//тут добавился общий баланс всех кошельков юзера
import {Wallet} from "./wallet";



export class User1 {

    public wallets :Wallet[]=[]
    public totalBalance :number =0


    createWallet(){
//в this попадёт( смотрю
// туда где вызов в тестах ---user1.createWallet())
// --значит ---user1 будет в this
        const newWallet = new Wallet (this)
        this.wallets.push(newWallet)
        // в массив добавится один обьект
        return newWallet
        // newWallet  это-- {owner:user1}
    }
}