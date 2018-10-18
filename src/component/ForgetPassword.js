import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Path from "../const/Path";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import Toast from '../widget/Toast';
import CommonDataManager from "../manager/CommonDataManager";
import StorageUtil from "../util/StorageUtil";
import {Actions} from "react-native-router-flux";
import DataKeys from "../const/DataKeys";
import CheckUtil from "../util/CheckUtil";
import HeaderView from '../widget/HeaderView';


const win = Dimensions.get('window');

export default class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            msgId: '',//短信验证码的消息ID，由发送短信接口返回
            code: '',
            textCode: '获取验证码',
            canClick: true,
        }
    }

    pressConfirm = () => {
        if (!CheckUtil.checkPhone(this.state.account)) {
            Toast.show('请输入正确的手机号', Toast.SHORT);
            return;
        }
        if (CheckUtil.isStrEmpty(this.state.password)) {
            Toast.show('请输入新密码', Toast.SHORT);
            return;
        }
        if (CheckUtil.isStrEmpty(this.state.code)) {
            Toast.show('请输入验证码', Toast.SHORT);
            return;
        }
        let data = {
            'username': this.state.account,
            'password': this.state.password,
            'msgId': this.state.msgId,
            'code': this.state.code
        };
        HttpClient.doPost(Path.forget_psw, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        Toast.show("修改成功", Toast.SHORT);
                        CommonDataManager.getInstance().setUser(null);
                        StorageUtil.set(DataKeys.userInfo, null);
                        Actions.replace('login');
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

    sendCode = () => {
        if (!CheckUtil.checkPhone(this.state.account)) {
            Toast.show('请输入正确的手机号', Toast.SHORT);
            return;
        }
        let data = {
            'mobile': this.state.account,
        };
        let url = Path.code
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        Toast.show("获取验证码成功", Toast.SHORT);
                        let msg = response.data
                        this.state.msgId = msg.msgId
                        //倒计时
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
        })

    }

    countDownTimer = () => {
        this.setState({canClick: false})
        const now = Date.now()
        /*过期时间戳（毫秒） +100 毫秒容错*/
        const overTimeStamp = now + 60 * 1000 + 100
        this.interval = setInterval(() => {
            /* 切换到后台不受影响*/
            const nowStamp = Date.now()
            if (nowStamp >= overTimeStamp) {
                /* 倒计时结束*/
                this.interval && clearInterval(this.interval);
                this.setState({
                    canClick: true,
                    textCode: '获取验证码',
                })
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

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView title="忘记密码"/>
                <LinearGradient colors={['#00e9ff', '#00a9ff', '#005eff']}
                                style={styles.backgroundGradient}>
                    <Image
                        source={require('../../image/ic_logo.png')}
                        style={styles.imgStyle}/>
                </LinearGradient>

                <View style={styles.loginBack}>
                    <ImageBackground
                        source={require('../../image/login_back.png')}
                        resizeMode='stretch'
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20,
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                source={require('../../image/iv_username.png')}
                                style={{width: 20, height: 20, marginLeft: 25, resizeMode: 'stretch'}}/>
                            <TextInput style={styles.textInput}
                                       placeholder="请输入手机号"
                                       keyboardType="phone-pad"
                                       maxLength={11}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(account) => this.setState({account: account})}
                            />
                        </View>
                        <View style={{width: 240, height: 1, backgroundColor: '#cccccc'}}/>
                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                            <Image
                                source={require('../../image/iv_password.png')}
                                style={{width: 22, height: 22, marginLeft: 25, resizeMode: 'stretch'}}/>
                            <TextInput style={styles.textInput}
                                       placeholder="请输入新密码"
                                       secureTextEntry={true}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(password) => this.setState({password: password})}
                            />
                        </View>
                        <View style={{width: 240, height: 1, backgroundColor: '#cccccc'}}/>
                        <View
                            style={{width: 240, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                            <View style={{flexDirection: 'column'}}>
                                <TextInput style={styles.textCode}
                                           placeholder="验证码"
                                           keyboardType="numeric"
                                           underlineColorAndroid='transparent'
                                           onChangeText={(code) => this.setState({code: code})}
                                />
                                <View style={{width: 110, height: 1, backgroundColor: '#cccccc'}}/>
                            </View>

                            {this.state.canClick ?
                                <TouchableOpacity activeOpacity={0.6}
                                                  onPress={this.sendCode.bind(this)}>
                                    <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 0}} style={styles.btnSendCode}>
                                        <Text style={styles.textStyle}>{this.state.textCode}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={1}>
                                    <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 0}} style={styles.btnSendCode}>
                                        <Text style={styles.textCountDown}>{this.state.textCode}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            }
                        </View>

                        <TouchableOpacity activeOpacity={0.6} style={{marginTop: 20}}
                                          onPress={this.pressConfirm.bind(this)}>
                            <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}} style={styles.btn}>
                                <Text style={styles.textStyle}>修改密码</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f6f6f6',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    backgroundGradient: {
        alignItems: 'center',
        width: win.width,
        height: win.height / 2-50,
    },
    imgStyle: {
        width: 70,
        height: 70,
        marginTop: 70,
    },
    loginBack: {
        alignSelf: 'center',
        width: win.width * 0.8,
        height: 320,
        marginTop: -90,
    },
    textInput: {

        height: 40,
        width: 200,
        //内边距
        paddingLeft: 10,
        paddingRight: 10,
        //外边距
        marginLeft: 10,
        marginRight: 20,
        //设置相对父控件居中
    },
    textCode: {
        height: 40,
        width: 100,
        //内边距
        paddingLeft: 5,
        //外边距
        marginLeft: 10,
    },
    btn: {
        flexDirection: 'row',
        width: 130,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    btnSendCode: {
        width: 110,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textStyle: {
        color: 'white',
        fontSize: 14
    },
    textCountDown: {
        color: '#cccccc',
        fontSize: 14
    },
});