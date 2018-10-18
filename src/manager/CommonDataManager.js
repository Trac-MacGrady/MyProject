import User from "../model/User";
import CityList from "../const/CityList";
import {BankList} from "../const/BankList";
import Path from '../const/Path';
import HttpCode from '../const/HttpCode';
import HttpClient from '../network/HttpClient';
import Host from '../conf/Config';
import DataKeys from "../const/DataKeys";
import StorageUtil from '../util/StorageUtil';
import {DeviceEventEmitter} from "react-native";

export default class CommonDataManager {

    static myInstance = null;


    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return CommonDataManager.myInstance;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }

    getEnableTunnelInfo(){
        return this.tunnelInfo;
    }

    setEnableTunnelInfo(tunnelInfo){
        this.tunnelInfo = tunnelInfo;
    }

    getToken() {
        return this.user ? this.user.token : "";
    }

    getUid() {
        return this.user ? this.user.uid : "";
    }

    getVersion() {
        return this.version;
        // if (this.version === '') {
        //     StorageUtil.get(DataKeys.VERSION)
        //         .then((version) => {
        //             if (version === undefined || version === null) {
        //                 callback(Host.version);
        //             } else {
        //                 callback(version >= Host.version ? version : Host.version);
        //             }
        //         });
        // } else {
        //     callback(this.version);
        // }
    }


    setVersion(version) {
        this.version = version;
    }

    getCityInfo() {
        return this.cityInfo;
    }

    getBankInfo() {
        return this.bankInfo;
    }

    getContractUrl() {
        return this.contractUrl;
    }

    getRateUrl() {
        return this.rateUrl;
    }

    getGrowUpUrl() {
        return this.growUpUrl;
    }

    getHelpUrl(){
        return this.helpUrl;
    }

    getTimeoutMessage() {
        return this.timeoutMessage;
    }

    getSupportBankInfo() {
        if (this.supportBank !== null || this.supportBank !== "") {
            this.supportBank = this.supportBank.replace("[", "").replace("]", "");
        }

        return this.supportBank;
    }

    setLogin(isLogin) {
       this.isLogin = isLogin; 
    }

    getLogin() {
       return this.isLogin;
    }

    init() {
        this.contractUrl = '';
        this.rateUrl = '';
        this.growUpUrl = '';
        this.helpUrl = '';
        this.cityList = '';
        this.bankList = '';
        this.supportBank = '';
        this.version = Host.version;
        this.cityInfo = this.refactorCityInfo();
        this.bankInfo = this.refactorBankInfo();
        this.isLogin = '';
        this.initConfig();
        this.addTimeoutListener()
    }

    // 注冊網絡超时监听：
    addTimeoutListener() {
        DeviceEventEmitter.addListener("RNFetchBlobMessage", (e) => {

            if(e.event === 'warn') {
                console.warn(e.detail);
                this.timeoutMessage = "timeout: " + e.detail;
            }
            else if (e.event === 'error') {
                throw e.detail
            }
            else {
                console.log("RNFetchBlob native message", e.detail)
                this.timeoutMessage = e.detail;
            }
        })
    }

    refactorCityInfo() {
        return Object.keys(CityList).map(province => {
            let citySet = CityList[province];
            return {
                name: province,
                area: Object.keys(citySet).map(city => {
                    return {
                        name: city,
                        area: citySet[city]
                    };
                }),
            };
        });
    }

    refactorBankInfo() {
        return BankList;
    }

    initDatabase() {
        const BankInfoSchema={
            name:'BankInfoData',
            primaryKey:'id',
            properties:{
                id:'string', //卡号
                cardName:'string',   // 银行名称
                cardNumLast:'string',// 银行卡后四位
                cardMoney:'string',  // 额度
                cardRepayDay:'string',// 还款日
                cardBillDay:'string', // 账单日
            }
        };

        return new Realm({schema:[BankInfoSchema]});
    }

    initConfig() {
        let data = {
            'version': Host.version
        };
        let url = Path.init;
        HttpClient.doPost(url, data, (code, response) => {
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    // ToastAndroid.show(JSON.stringify(response.data), ToastAndroid.SHORT);
                    if (codeStatus === 0) {
                        let result = response.data;
                        this.contractUrl = result.contract;
                        this.rateUrl = result.rate_intro;
                        this.growUpUrl = result.promotion_intro;
                        this.helpUrl = result.help;
                        this.supportBank = result.supportBankInfo;
                    } else {
                    }
                    break;
                case HttpCode.ERROR:
                    break;
                default:
                    break;
            }
        });
    }


    initGetEnableTunnelInfo = () => {
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            // 'version': Host.version,
            // 'client': DeviceUtil.getPlatform()
        };
        let url = Path.enableTunnels;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        CommonDataManager.getInstance().setEnableTunnelInfo(response.data)
                    } else {
                        console.log("服务器返回错误：" + response.msg);
                    }
                    break;
                case HttpCode.ERROR:
                    console.log("http请求失败");
                    break;
                default:
                    break;
            }
        });
    }

    initMeta = (dataType) => {
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'version': Host.version,
            'dataType': dataType,
        };
        let url = Path.tunnelInfo;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    if (dataType === DataKeys.BANK) {
                        this.cityList = response;
                    } else if (dataType === DataKeys.CITY){
                        this.bankList = response;
                    }
                    break;
                case HttpCode.ERROR:
                    console.log("http请求失败");
                    break;
                default:
                    break;
            }
        });
    }
}
