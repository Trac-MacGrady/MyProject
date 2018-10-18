const Path = {
    init: "/app/init/init",
//支行信息查询
    subbranch: "/app/init/subbranch",
//用户登录接口
    login: "/app/user/login",
// 请求用户信息
    userInfo: "/app/user/info",
// 获取通道信息
    tunnelInfo: "/app/init/tunnelInfo",
//推广注册接口
    promote: "/app/user/promote",
//用户注册接口
    register: "/app/user/register",
//商户注册
    merchantRegister: "/app/merchant/register",
//获取自身已注册测商户
    mine: "/app/merchant/mine",
//获取商户自身开通支付通道的信息    ！！！商户商户商户
    enableTunnels: "/app/merchant/enableTunnels",
//开通费率通道
    openChannel: "/app/merchant/openChannel",
//获取商户的下游商户
    belonged: "/app/merchant/belonged",
//商户注册信息的更改，也就是商户换卡
    update: "/app/merchant/update",
//发送验证接口
    code: "/app/security/sendSmsCode",
//消费通道绑定
    bind: "/app/card/bind",
//绑定银行卡
    cardstart: "/app/card/start",  //接口作废
//注册银行卡
    cardregister: "/app/card/register",
//获取银行卡消费通道信息    ！！！银联银联银联
    cardenableTunnels: "/app/card/enableTunnels",
//已注册银行卡开通支付通道
    startOnCard: "/app/card/startOnCard",
//绑卡短信发送接口
    bindSms: "/app/card/bindSms",
//查询绑卡结果
    bindQuery: "/app/card/bindQuery",
//删除已绑定的银行卡
    deletecard: "/app/card/delete",
//开始消费接口
//     start: "/app/consume/start",
    start: "/app/consume/startConsume",
//正式消费接口
    consume: "/app/consume/consume",
//消费结果查询接口
    consumeQuery: "/app/consume/consumeQuery",
//消费短信发送
    consumeSms: "/app/consume/consumeSms",
//消费记录查询
    consumeList: "/app/consume/list",
//忘记密码
    forget_psw: "/app/user/forgetPassword",
//修改密码
    change_psw: "/app/user/modifyPassword",
//注销登陆
    logout: "/app/user/logout",
//获取已绑定银行卡列表
    cardList: "/app/card/list",
//提现
    takeMoney: "/app/settle/withdraw",
//用户收入
    income: "/app/settle/income",
//实名认证接口
    certificate: "/app/user/certificate",
    // 客户端版本检查
    checkVersion: "/app/init/checkVersion",
};

export default Path
