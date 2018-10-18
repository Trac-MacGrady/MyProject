import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CommonDataManager from "../manager/CommonDataManager";
import Path from "../const/Path";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import {Actions} from "react-native-router-flux";
import HeaderView from '../widget/HeaderView';
import LoadingView from '../widget/LoadingView';
import Toast from '../widget/Toast';


const win = Dimensions.get('window');
export default class Consume extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardBackNo: '',
            creditCardDate: '',
            code: '',
            isLoading: false,
            textCode: '获取验证码',
            canClick: true,
        }
    }

    //发送验证码
    consumeSms = () => {
        let orderId = this.props.orderId;
        if (orderId === '') {
            Toast.show("订单号为空，请返回支付页面重新支付");
            return;
        }
        if (this.state.cardBackNo === '') {
            Toast.show("信用卡CVN码不能为空");
            return;
        }
        if (this.state.creditCardDate === '') {
            Toast.show("信用卡过期时间不能为空");
            return;
        }
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'orderId': orderId,
            'addon': {
                'CREDIT_CVN2': this.state.cardBackNo,
                'CREDIT_EXPIRED': this.state.creditCardDate
            }
        };

        let url = Path.consumeSms;
        // Toast.show(orderId, Toast.SHORT);

        HttpClient.doPost(url, data, (code, response) => {
                switch (code) {
                    case HttpCode.SUCCESS:
                        let codeStatus = response.code;
                        if (codeStatus === 0) {
                            // Toast.show(JSON.stringify(response.data), Toast.SHORT);
                            Toast.show("验证码发送成功", Toast.SHORT);
                            this.countDownTimer()
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
            }
        )
    };

    countDownTimer = () => {
        this.setState({canClick: false})
        const now = Date.now()
        /*过期时间戳（毫秒） +100 毫秒容错*/
        const overTimeStamp = now + 60 * 1000 + 100
        this.interval = setInterval(() => {
            const nowStamp = Date.now()
            if (nowStamp >= overTimeStamp) {
                /* 倒计时结束*/
                this.stopTimer();
            } else {
                const leftTime = parseInt((overTimeStamp - nowStamp) / 1000, 10)
                let activeTitle = `重新获取(${leftTime}s)`
                this.setState({
                    canClick: false,
                    textCode: activeTitle,
                })
            }

        }, 1000)
    }

    stopTimer = () => {
        /* 倒计时结束*/
        this.interval && clearInterval(this.interval);
        this.setState({
            canClick: true,
            textCode: '获取验证码',
        })
    };

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    //消费
    consume = () => {
        this.setState({isLoading: true});
        let orderId = this.props.orderId;
        if (orderId === '') {
            this.setState({isLoading: false});
            Toast.show("订单号为空，请返回支付页面重新支付");
            return;
        }
        if (this.state.code === '') {
            this.setState({isLoading: false});
            Toast.show("短信验证码不能为空");
            return;
        }
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'orderId': this.props.orderId,
            'addon': {
                'SMS_CODE': this.state.code,
            }
        };
         // 停止验证码倒计时
        this.stopTimer();
        let url = Path.consume;
        // Toast.show(JSON.stringify(data), Toast.SHORT);
        HttpClient.doPost(url, data, (code, response) => {
                this.setState({isLoading: false});
                switch (code) {
                    case HttpCode.SUCCESS:
                        let codeStatus = response.code;
                        if (codeStatus === 0) {
                            // Toast.show(JSON.stringify(response.data), Toast.SHORT);
                            Toast.show("支付完成，请等待支付结果处理", Toast.SHORT);
                            Actions.replace('home');
                        } else {
                            Actions.pop();
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
            }
        )
    };


    render() {
        return (
            <View style={{flex: 1}}>
                <HeaderView title="付款"
                />
                <View style={{backgroundColor: '#f6f6f6', padding: 20, flex: 1}}>
                    <TextInput style={styles.textInput}
                               placeholder="信用卡背面三个数字，如:208"
                               keyboardType="phone-pad"
                               underlineColorAndroid='transparent'
                               onChangeText={(cardNo) => this.setState({cardBackNo: cardNo})}
                    />
                    <View style={styles.backLine}/>

                    <TextInput style={styles.textInput}
                               placeholder="信用卡过期时间，如:0820"
                               keyboardType="phone-pad"
                               underlineColorAndroid='transparent'
                               onChangeText={(cardDate) => this.setState({creditCardDate: cardDate})}
                    />
                    <View style={styles.backLine}/>
                    <View style={styles.sendCode}>
                        <TextInput style={{width: win.width * 2 / 5, height: 40,}}
                                   placeholder="输入验证码"
                                   keyboardType="phone-pad"
                                   underlineColorAndroid='transparent'
                                   onChangeText={(smsCode) => this.setState({code: smsCode})}
                        />

                        {this.state.canClick ?
                            <TouchableOpacity activeOpacity={0.6}
                                              onPress={this.consumeSms.bind(this)}
                                              style={styles.btnCode}>
                                <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                                end={{x: 1, y: 0}} style={styles.btnGetCode}>
                                    <Text style={styles.textStyle}>{this.state.textCode}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity activeOpacity={1} style={styles.btnCode}>
                                <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                                end={{x: 1, y: 0}} style={styles.btnGetCode}>
                                    <Text style={styles.textCountDown}>{this.state.textCode}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{
                        width: win.width / 2,
                        height: 1,
                        backgroundColor: '#cccccc',
                        marginLeft: 5,
                        marginRight: 5,
                    }}/>
                    <TouchableOpacity activeOpacity={0.6} style={{marginTop: 30, width: win.width - 40, height: 40}}
                                      onPress={this.consume.bind(this)}>
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
        paddingLeft: 20,
        paddingRight: 10,
        marginTop: 8,
    },
    sendCode: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        width: win.width - 40,
        //内边距
        paddingLeft: 20,
        paddingRight: 10,
        marginTop: 8
    },
    backLine: {
        width: win.width - 50,
        height: 1,
        backgroundColor: '#cccccc',
        marginLeft: 5,
        marginRight: 5,
    },
    textStyle: {
        color: 'white',
        fontSize: 14
    },
    textCountDown: {
        color: '#cccccc',
        fontSize: 14
    },
    btnCode: {
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    btnGetCode: {
        height: 40,
        width: win.width / 3,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    }
})