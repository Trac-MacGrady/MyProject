/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Alert,
    BackHandler,
    Keyboard
} from 'react-native';
import Toast from '../widget/Toast';
import RNExitApp from 'react-native-exit-app';
import {Actions,} from 'react-native-router-flux';

import CardView from '../widget/CardView';
import CommonDataManager from "../manager/CommonDataManager";
import HttpClient from "../network/HttpClient";
import Path from "../const/Path";
import HttpCode from "../const/HttpCode";
import HeaderView from "../widget/HeaderView";
import _ from 'lodash';
import CheckUtil from "../util/CheckUtil";
import StorageUtil from '../util/StorageUtil';
import DataKeys from '../const/DataKeys';
import Host from "../conf/Config";
import DeviceUtil from "../util/DeviceUtil";

const win = Dimensions.get('window');
const smallCardViewWidth = win.width / 4;
const smallCardViewIconSize = 15;
const cardViewWidth = win.width / 3;
const cardViewIconSize = 20;

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderAmount: '',
            certificateProcess: '',
            payButtonIcon: require('../../image/iv_receipt_money.png'),
        };

        this.delayPay = _.debounce(this.pay, 500);
    }

    componentDidMount() {
        //获取通道信息
        BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBack)
    }

    static getEnableTunnelsInfo = () => {

        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            // 'version': CommonDataManager.getInstance().getVersion(),
            // 'client': DeviceUtil.getPlatform()
        };
        // let url = Path.tunnelInfo;
        let url = Path.enableTunnels;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        CommonDataManager.getInstance().setEnableTunnelInfo(response.data)
                        console.log("通道请求成功！");
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



    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack)
    }

    handleAndroidBack = () => {
        //Add desired function here (onBack in this case)
        console.log(Actions.currentScene);
        if (Actions.currentScene === '_home') {
            this.exitApp();
            return true;
        } else {
            return false;
        }
    };

    exitApp = () => {
        Alert.alert(
            '注意',
            '您确认要退出吗？',
            [{
                text: '取消', onPress: () => {
                }, style: 'cancel'
            },
                {
                    text: '确认', onPress: () => {
                    RNExitApp.exitApp();
                }
                },
            ],
        )
    };

    static onEnter = () => {
        Home.queryUserInfo();
        Home.getEnableTunnelsInfo();
    };

    onExit = () => {
        this.restore();
        // super.onExit();
    };

    restore = () => {
        this.setState({
            orderAmount: '',
            payButtonIcon: require('../../image/iv_receipt_money.png'),
        });
    };

    static queryUserInfo = () => {
        let data = {
            'token': CommonDataManager.getInstance().getToken()
        };
        let url = Path.userInfo;
        HttpClient.doPost(url, data, (code, response) => {
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        let user = response.data;
                        CommonDataManager.getInstance().setUser(user);
                        // FakeHome.alertRegister(status)
                        let status = user.certificateProcess;
                        if (status === 'FINISHED') {

                        } else {
                            Alert.alert(
                                '警告',
                                '您还没有实名认证',
                                [{
                                    text: '登出', onPress: () => {
                                        Home.logout();
                                    }
                                },
                                    {
                                        text: '认证', onPress: () => {
                                        if (status === 'WAIT') {
                                            Actions.merchantregister();
                                        } else {
                                            Actions.realnameauth();
                                        }
                                    }
                                    },
                                ],
                                {cancelable: false}
                            )
                        }
                    } else {
                        Toast.show(response.msg, Toast.SHORT);
                    }
                    break;
                case HttpCode.ERROR:
                    console.log("http请求失败");
                    break;
                default:
                    break;
            }
        })
    };

    static logout = () => {
        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.logout;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    Toast.show("登出成功", Toast.SHORT);
                    CommonDataManager.getInstance().setUser(null)
                    StorageUtil.set(DataKeys.userInfo, null)
                    Actions.replace('login')
                    break;
                case HttpCode.ERROR:
                    Toast.show("网络问题，请重试", Toast.SHORT);
                    console.log("http请求失败");
                    break;
                default:
                    break;
            }

        })
    };


    onPay = () => {
        if (!CheckUtil.checkMoney(this.state.orderAmount)) {
            Toast.show("请输入正确的金额", Toast.SHORT);
            return;
        }

        Keyboard.dismiss();
        this.setState({isLoading: true});
        this.pay();
    };

    pay = () => {
        let orderAmount = this.state.orderAmount;
        this.restore();
        this.setState({isLoading: false});
        Actions.receipt({orderAmount: orderAmount});
    };


    displayRatePage = () => {
        Actions.ratepage();
        Keyboard.dismiss();
    };

    onOrderAmountChanged = () => {
        this.setState({
            payButtonIcon: require('../../image/iv_receipt_money_blue.png')
        })
    };

    onPress = () => {
        Toast.show("敬请期待", Toast.SHORT);
        Keyboard.dismiss();
    };

    more = () => {
        Actions.shopping();
    };

    render() {

        return (
            <View style={styles.container}>
                <HeaderView
                    title="收款"
                    menuIcon={require('../../image/iv_rate.png')}
                    desc="费率"
                    onPress={this.displayRatePage}
                    back={false}
                />

                <Image
                    style={styles.banner}
                    source={require('../../image/ad_show.png')}
                />
                <ImageBackground style={styles.payContainer}
                                 source={require('../../image/receipt_money_back.png')}
                >

                    <Image style={styles.payIcon}
                           source={require('../../image/iv_money.png')}>
                    </Image>
                    <TextInput
                        refs="orderAmount"
                        underlineColorAndroid='transparent'
                        style={styles.payInput}
                        onChangeText={(orderAmount) => this.setState({orderAmount})}
                        placeholder='请输入金额'
                        keyboardType='numeric'
                        onChange={this.onOrderAmountChanged}
                        value={this.state.orderAmount}
                    >
                    </TextInput>
                    <TouchableOpacity onPress={this.onPay}>
                        <View style={{width: 30, marginRight: 10}}>
                            <Image style={styles.payAction}
                                   source={this.state.payButtonIcon}
                            >
                            </Image>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
                <View style={styles.creditContainer}>
                    <CardView
                        cardContainerBackgroundStyle={styles.subCreditCardContainer}
                        titleBarContainerStyle={[{width: cardViewWidth}, styles.subCreditTitleBar]}
                        creditIcon={[{width: cardViewIconSize, height: cardViewIconSize}, styles.creditIcon]}
                        creditTitle={styles.creditTitle}
                        creditDesc={styles.creditDesc}
                        backgroundImage={require('../../image/receipt_blue_back.png')}
                        icon={require('../../image/iv_credit_card.png')}
                        title={'信用卡'}
                        desc={'信用卡办理'}
                        onPress={this.onPress}
                    />

                    <View style={{width: 5}}/>
                    <CardView
                        cardContainerBackgroundStyle={styles.subCreditCardContainer}
                        titleBarContainerStyle={[{width: cardViewWidth}, styles.subCreditTitleBar]}
                        creditIcon={[{width: cardViewIconSize, height: cardViewIconSize}, styles.creditIcon]}
                        creditTitle={styles.creditTitle}
                        creditDesc={styles.creditDesc}
                        backgroundImage={require('../../image/receipt_blue_back.png')}
                        icon={require('../../image/iv_loan.png')}
                        title={'贷款'}
                        desc={'个人信贷'}
                        onPress={this.onPress}
                    />
                </View>
                <View style={{width: 10, height: 2}}>
                </View>
                <View style={styles.creditContainer}>

                    <CardView
                        cardContainerBackgroundStyle={styles.subCreditCardContainer}
                        titleBarContainerStyle={[{width: smallCardViewWidth}, styles.subCreditTitleBar]}
                        creditIcon={[{
                            width: smallCardViewIconSize,
                            height: smallCardViewIconSize
                        }, styles.creditIcon]}
                        creditTitle={styles.creditTitle}
                        creditDesc={styles.creditDesc}
                        backgroundImage={require('../../image/iv_receipt_recyc_back.png')}
                        icon={require('../../image/iv_call_charges.png')}
                        title={'话费'}
                        desc={'话费充值'}
                        onPress={this.onPress}
                    />

                    <View style={{width: 3}}/>
                    <CardView
                        cardContainerBackgroundStyle={styles.subCreditCardContainer}
                        titleBarContainerStyle={[{width: smallCardViewWidth}, styles.subCreditTitleBar]}
                        creditIcon={[{
                            width: smallCardViewIconSize,
                            height: smallCardViewIconSize
                        }, styles.creditIcon]}
                        creditTitle={styles.creditTitle}
                        creditDesc={styles.creditDesc}
                        backgroundImage={require('../../image/iv_receipt_recyc_back.png')}
                        icon={require('../../image/iv_gprs.png')}
                        title={'流量'}
                        desc={'手机流量包'}
                        onPress={this.onPress}
                    />
                    <View style={{width: 3}}/>
                    <CardView
                        cardContainerBackgroundStyle={styles.subCreditCardContainer}
                        titleBarContainerStyle={[{width: smallCardViewWidth}, styles.subCreditTitleBar]}
                        creditIcon={[{
                            width: smallCardViewIconSize,
                            height: smallCardViewIconSize
                        }, styles.creditIcon]}
                        creditTitle={styles.creditTitle}
                        creditDesc={styles.creditDesc}
                        backgroundImage={require('../../image/iv_receipt_recyc_back.png')}
                        icon={require('../../image/iv_oil.png')}
                        title={'汽油'}
                        desc={'加油站'}
                        onPress={this.onPress}
                    />
                </View>
                <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                  onPress={this.more}>
                    <ImageBackground style={styles.moreBar}
                                     imageStyle={{resizeMode: 'stretch'}}
                                     source={require('../../image/iv_more_back.png')}>
                        <Image style={styles.moreIcon}
                               source={require('../../image/iv_more.png')}/>
                        <Text style={styles.more}>
                            更多
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

            </View>
        );
    }
}


const
    styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
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
        banner: {
            width: win.width,
            height: win.width / 2.2
        },

        titleBarContainer: {
            width: win.width,
            height: 50,
            backgroundColor: '#1a55d1',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end'
        },

        title: {
            width: 100,
            height: 30,
            textAlign: 'center',
            fontSize: 20,
            color: '#ffffff',
            marginEnd: 90,
        },
        feeRatioContainer: {
            width: 50,
            height: 30,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
        },
        feeIcon: {
            width: 15,
            height: 15,
        },
        feeDesc: {
            flex: 1,
            fontSize: 15,
            color: '#ffffff',
            textAlign: 'center',
        },
        payContainer: {
            width: win.width * 0.9,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            // borderColor: '#000000',
            // backgroundColor: '#556677',
            marginTop: -25,
            marginBottom: 10,
        },
        payInput: {
            flex: 1,
            padding: 0,
        },
        payIcon: {
            width: 15,
            height: 15,
            resizeMode: Image.resizeMode.contain,
            marginLeft: 20,
            marginRight: 10,
        },
        payAction: {
            width: 20,
            height: 20,
            resizeMode: Image.resizeMode.contain,
            marginRight: 20,
        },
        creditContainer: {
            width: win.width,
            height: win.height / 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: win.height / 15,
            marginRight: 10,
            marginLeft: 10,
            marginBottom: 10,
            // backgroundColor: '#abc'
        },
        subCreditCardContainer: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            // backgroundColor: '#114455',
            borderRadius: 5,
        },
        subCreditTitleBar: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            margin: 15,
            marginTop: 25,
            // backgroundColor: '#ac78d1',
        },
        creditIcon: {
            width: 25,
            height: 25,
            resizeMode: 'contain',
            alignSelf: 'center',
        },
        loanIcon: {
            width: 22,
            height: 22,
            resizeMode: 'center',
            alignSelf: 'center',
        },
        creditTitle: {
            flex: 1,
            fontSize: 15,
            marginLeft: 5,
            color: '#ffffff',
            alignSelf: 'center'
        },
        creditDesc: {
            // backgroundColor: '#112233',
            height: 50,
            fontSize: 13,
            alignSelf: 'center',
            textAlign: 'center',
            color: '#ffffff'
        },
        line: {
            backgroundColor: '#334455',
            width: win.width * 0.8,
            height: 2,
        },
        moreBar: {
            width: win.width,
            height: 60,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        moreIcon: {
            width: 16,
            height: 16,
            resizeMode: 'stretch',
        },
        more: {
            marginLeft: 3,
            fontSize: 16,
            color: '#0073ff',
            textAlign: 'center',
            marginBottom: 1,
        }
    });

