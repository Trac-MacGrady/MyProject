import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text, TextInput, TouchableOpacity, View,} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CommonDataManager from "../manager/CommonDataManager";
import Path from "../const/Path";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import VerifyCard from "../util/VerifyCard";
import HeaderView from "../widget/HeaderView";
import Toast from '../widget/Toast';
import LoadingView from "../widget/LoadingView";
import {Actions} from 'react-native-router-flux';
import {BankList, CardType} from "../const/BankList";
import _ from 'lodash';
import CheckUtil from "../util/CheckUtil";

const win = Dimensions.get('window');

export default class BindCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardNo: '',
            cardType: 'CREDIT',
            mobileNo: '',
            bankId: '',
            isLoading: false,
        };
        this.delayBind = _.debounce(this.registerCard, 2000)
    }

    bindCard = () => {
        if (this.state.cardNo === '') {
            Toast.show("卡号不能为空", Toast.SHORT);
            return;
        }

        if (!CheckUtil.checkPhone(this.state.mobileNo)) {
            Toast.show("请输入正确的手机号", Toast.SHORT);
            return;
        }
        let bankId = this.state.bankId ? this.state.bankId : this.props.bankId;
        if (bankId === '') {
            Toast.show("请选择信用卡所属银行", Toast.SHORT);
            return;
        }
        this.setState({isLoading: true});

        this.delayBind(this.state.cardNo, bankId);
    };

    registerCard = (cardNo, bankId) => {

        let cardType = this.state.cardType;
        let mobileNo = this.state.mobileNo;
        let token = CommonDataManager.getInstance().getToken();
        let data = {
            'token': token,
            "cardNo": cardNo,
            'cardType': cardType,
            'bankId': bankId,
            'mobileNo': mobileNo,
            'addon': {}
        };
        // Toast.show(JSON.stringify(data), Toast.SHORT);
        let url = Path.cardregister;
        HttpClient.doPost(url, data, this.bindResponse)
    };

    bindResponse = (code, response) => {
        this.setState({isLoading: false});
        switch (code) {
            case HttpCode.SUCCESS:
                let codeStatus = response.code;
                // Toast.show(JSON.stringify(response.data), Toast.SHORT);

                if (codeStatus === 0) {
                    Toast.show("绑定成功", Toast.SHORT);
                    this.getCardList();
                } else {
                    Toast.show(response.msg, Toast.SHORT);
                }
                break;
            case HttpCode.ERROR:
                Toast.show("网络问题，请重试", Toast.SHORT);
                console.log("http请求失败");
                break;
            default:
                break;
        }
    };
    //
    // onExit = () => {
    //     // Actions.pop();
    //     // this.backScene();
    // };


    getCardList = () => {
        let token = CommonDataManager.getInstance().getToken();
        if (token === "") {
            return;
        }
        let data = {"token": token};
        let url = Path.cardList;
        this.state.loading = true;
        HttpClient.doPost(url, data, (code, response) => {
            this.state.loading = false;
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    // Toast.show(JSON.stringify(response.data), Toast.SHORT);
                    if (codeStatus === 0) {
                        this.transformBankCardList(Array.from(response.data));
                        console.log(this.state.cardList);
                    } else {
                        Toast.show(response.msg, Toast.SHORT);
                    }
                    break;
                case HttpCode.ERROR:
                    Toast.show("网络问题，请重试", Toast.SHORT);
                    console.log("http请求失败");
                    break;
                default:
                    break;
            }
        });
    };
    // 通过服务器返回的银行卡信息获取银行相关信息，如银行简称，银行编码
    transformBankCardList = (oldList) => {
        let data = [];
        let BankList = CommonDataManager.getInstance().getBankInfo();
        // Toast.show(JSON.stringify(oldList), Toast.SHORT);
        oldList.map(function (cardData) {
            for (let bank of BankList) {
                if (bank.bankNo === cardData.bankNo) {
                    let dataItem = {
                        'abbrEN': bank.abbrEN,
                        'abbrCN': bank.abbrCN,
                        'bankName': bank.name,
                        'cardId': cardData.id,
                        'cardNo': cardData.cardNo,
                        'checked': false,
                    };
                    data.push({key: dataItem})
                }
            }
        });
        this.backScene(data);

        console.log("银行卡列表: " + this.state.cardList);
    };

    backScene = (cardList) => {
        Actions.pop({refresh: {creditCardList: cardList}});
    };

    onSelectBank = () => {
        if (this.state.cardNo === '' || this.state.mobileNo === ''){
            Toast.show("请先填写信用卡号和手机号");
            return;
        }
        Actions.bankpicker();
    };

    onChangeMobile = (mobileNo) => {
        if (this.state.cardNo === '') {
            Toast.show("卡号不能为空", Toast.SHORT);
            return;
        }
        if (this.state.bankId === '') {
            VerifyCard(this.state.cardNo, (code, response) => {
                if (response.hasOwnProperty("validated")) {
                    if (response.validated) {
                        let abbrEN = response.bank;
                        let cardType = response.cardType;
                        if (cardType !== CardType.Credit) {
                            Toast.show("只能绑定信用卡", Toast.SHORT);
                        } else {
                            let result = false;
                            for (let bank of BankList) {
                                if (bank.abbrEN === abbrEN) {
                                    this.setState({
                                        bankName: bank.abbrCN,
                                        bankId: bank.bankId,
                                    });
                                    result = true;
                                }
                            }
                            if (!result) {
                                this.setState({
                                    bankName: '',
                                    bankId: '',
                                })
                            }
                        }
                    } else {
                        Toast.show("无效的银行卡号", Toast.SHORT);
                    }
                }
                console.log(response);
            });
        }
        this.setState({mobileNo: mobileNo});
    };


    render() {
        const bankNameColor = this.props.bankId ? '#000000' : '#A0A0A0';
        const bankName = this.state.bankName ? this.state.bankName : this.props.bankName;
        return (
            <View style={{flex: 1}}>
                <HeaderView title="绑定信用卡"
                            onBack={this.backPress}
                />
                <View style={{backgroundColor: '#f6f6f6', padding: 20, flex: 1}}>
                    <Text style={styles.hint}>
                        为了账号安全考虑，目前仅支持绑定本人信用卡。
                    </Text>
                    <TextInput style={styles.textInput}
                               placeholder="信用卡卡号"
                               placeholderTextColor="#A0A0A0"
                               keyboardType='numeric'
                               underlineColorAndroid='transparent'
                               onChangeText={(cardNo) => this.setState({cardNo: cardNo})}
                    />
                    <View style={styles.backLine}/>

                    <TextInput style={styles.textInput}
                               placeholder="银行预留手机号"
                               placeholderTextColor="#A0A0A0"
                               keyboardType='phone-pad'
                               underlineColorAndroid='transparent'
                               onChangeText={this.onChangeMobile}
                    />
                    <View style={styles.backLine}/>


                    <TouchableOpacity onPress={this.onSelectBank}>
                        <View style={styles.bankNameContainer}>
                            <Text style={[{color: bankNameColor}, styles.bankName]}>{bankName}</Text>
                            <View style={styles.backLine}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} style={{marginTop: 30, width: win.width - 40, height: 40}}
                                      onPress={this.bindCard}>
                        <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                        end={{x: 1, y: 0}} style={styles.btn}>
                            <Text style={{color: 'white', fontSize: 16}}>完成</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {this.state.isLoading && <LoadingView/>}
            </View>
        )
    }
}

BindCard.defaultProps = {
    requestCode: '',
    bankName: '请选择信用卡所属银行',
    bankId: '',
};
const styles = StyleSheet.create({
    btn: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        height: 40,
        width: win.width - 40,
        //内边距
        paddingLeft: 10,
        paddingRight: 10,
        color: '#000000'
    },
    backLine: {
        width: win.width - 50,
        height: 1,
        backgroundColor: '#cccccc',
        marginLeft: 5,
        marginRight: 5,
    },
    hint: {
        fontSize: 13,
        color: '#009aff',
        textAlign: 'center',
    },
    bankNameContainer: {
        height: 40,
        width: win.width - 40,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    bankName: {
        width: win.width - 40,
        //内边距
        paddingLeft: 10,
        margin: 10,
        // backgroundColor: 'grey',
    }

});