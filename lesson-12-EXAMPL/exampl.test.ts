//import {describe} from "node:test";

import {Wallet} from "./wallet";
import {User1} from "./user";

//запуск теста     jest     в Terminal
describe('some',()=>{

    it('test',()=>{
        const wallet1 = new Wallet()
        const wallet2 = new Wallet()
const user1 = new User1([wallet1,wallet2])

        expect(user1.wallets.length).toBe(2)
        expect(wallet1.owner).toBe(user1)
        expect(wallet2.owner).toBe(user1)
    })

})