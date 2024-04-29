/*

import {User1} from "./user";

//запуск теста     jest     в Terminal
describe('some',()=>{

    it('test',()=>{


const user1 = new User1()
       // cоздал user1 это {wallets:[],createWallet(){}}

       // кошелёк делается методом внутри user
        const wallet1 =user1.createWallet()
        const wallet2 =user1.createWallet()
       // wallet1 это-- {owner:user1}

        expect(user1.wallets.length).toBe(2)
        expect(wallet1.owner).toBe(user1)
        expect(wallet2.owner).toBe(user1)
    })

})*/
///////////////////////////////////////////////////////
                   //1
//////////////////////////////////////////////////////


/*

import {User1} from "./user";

//запуск теста     jest     в Terminal
describe('some',()=>{

    it('creat user and two wallets',()=>{


        const user1 = new User1()
        // cоздал user1 это {wallets:[],createWallet(){}}

        // кошелёк делается методом внутри user
        const wallet1 =user1.createWallet()
        const wallet2 =user1.createWallet()
        // wallet1 это-- {owner:user1}

        expect(user1.wallets.length).toBe(2)
        expect(wallet1.owner).toBe(user1)
        expect(wallet2.owner).toBe(user1)
    })


        // ВТОРАЯ ЗАДАЧА добавление денег
        // на кошелёк

    it('add money to wallet ',()=>{

/!*ПОЛЬЗОВАТЕЛЬ МОЖЕТ ПЕРЕВЕСТИ
        С КОШЕЛЬКА НЕКУЮ СУММУ ДЕНЕГ*!/
        const user1 = new User1()
        // cоздал user1 это {wallets:[],createWallet(){}}

        // кошелёк делается методом внутри user
        const wallet1 =user1.createWallet()
        const wallet2 =user1.createWallet()
        // wallet1 это-- {owner:user1,
        // balance:number,
        // addMoney(){}}



        wallet1.addMoney(100)
        const func = ()=> wallet2.addMoney(-100)


        expect(wallet1.balance).toBe(100)
        expect(func).toThrowError()
    })

})

*/



///////////////////////////////////////////////////////////////
                      //2
//////////////////////////////////////////////////////////////



import {User1} from "./user";

//запуск теста     jest     в Terminal
describe('some',()=>{

    it('creat user and two wallets',()=>{


        const user1 = new User1()
        // cоздал user1 это {wallets:[],createWallet(){}}

        // кошелёк делается методом внутри user
        const wallet1 =user1.createWallet()
        const wallet2 =user1.createWallet()
        // wallet1 это-- {owner:user1}

        expect(user1.wallets.length).toBe(2)
        expect(wallet1.owner).toBe(user1)
        expect(wallet2.owner).toBe(user1)
    })


    // ВТОРАЯ ЗАДАЧА добавление денег
    // на кошелёк

    it('add money to wallet ',()=>{

        /*ПОЛЬЗОВАТЕЛЬ МОЖЕТ ПЕРЕВЕСТИ
                С КОШЕЛЬКА НЕКУЮ СУММУ ДЕНЕГ*/
        const user1 = new User1()
        // cоздал user1 это {wallets:[],createWallet(){}}

        // кошелёк делается методом внутри user
        const wallet1 =user1.createWallet()
        const wallet2 =user1.createWallet()
        // wallet1 это-- {owner:user1,
        // balance:number,
        // addMoney(){}}



        wallet1.addMoney(100)
        const func = ()=> wallet2.addMoney(-100)
        wallet2.addMoney(10)


        expect(wallet1.balance).toBe(100)
        expect(func).toThrowError()
        expect(user1.totalBalance).toBe(110)

    })

})





