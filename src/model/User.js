export default class User {
    constructor(token, uid){
        this.token = token;
        this.uid = uid;
    }

    getToken(){
        return this.token;
    }

    getUid(){
        return this.uid;
    }

    setToken(token){
        this.token = token;
    }

    setUid(uid){
        this.uid;
    }
}