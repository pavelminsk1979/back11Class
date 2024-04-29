/*


import {User1} from "./user";


//это кошелёк User1
export class Wallet {
public owner:User1

    constructor( owner:User1) {

        this.owner=owner

    }

}*/

////////////////////////////////////////////////////////
                      //1
//////////////////////////////////////////////////////////




/*
import {User1} from "./user";


//это кошелёк User1
export class Wallet {
    public owner:User1
    public balance:number

    constructor( owner:User1) {

        this.owner=owner
this.balance=0
    }

    addMoney(sum:number){
        if(sum<0){  throw new Error('Error money little')}
        this.balance+=sum

    }

}*/



///////////////////////////////////////////////////////////
                 //2
////////////////////////////////////////////////////////////


import {User1} from "./user";


//это кошелёк User1
export class Wallet {
    public owner:User1
    public balance:number

    constructor( owner:User1) {

        this.owner=owner
        this.balance=0
    }

    addMoney(sum:number){
        if(sum<0){  throw new Error('Error money little')}
        this.balance+=sum

    }

}