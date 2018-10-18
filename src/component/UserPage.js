import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {Actions} from "react-native-router-flux";


import CommonDataManager from "../manager/CommonDataManager";
import Path from "../const/Path";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import Toast from '../widget/Toast';
import HeaderView from "../widget/HeaderView";
import UserPageItem from "../widget/UserPageItem";

import StorageUtil from "../util/StorageUtil";
import DataKeys from "../const/DataKeys";
import Pie from "../widget/Pie";
import BackInfo from "../const/BackInfo";

const win = Dimensions.get('window');
const colorScale = ['#ff65a4', '#2397ee', '#7ed4ff', '#418faa'];
const defaultColor = ['#999999']

export default class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            takeCash: '',
            promotionList: [],
            level: ''
        }
    }

    //控件加载前
    componentWillMount() {
        let user = CommonDataManager.getInstance().getUser();
        this.state.username = user.username;
        //获取可提现金额
        this.getCash();
        //获取用户是否是VIP
        this.getMine()
        this.getPromotion()
    }

    getMine = () => {
        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.mine;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        let level = response.data.level
                        this.setState({level: level})
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

    getPromotion = () => {
        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.belonged;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        let directNormal = 0;
                        let directVip = 0;
                        let indirectNormal = 0;
                        let indirectVip = 0;
                        //直接推广
                        let directionList = Array.from(response.data.direction);
                        //间接推广
                        let indirectionList = Array.from(response.data.indirection);
                        directionList.map(function (direction) {
                            if (direction.level === 'FIRST') {
                                directNormal++
                            } else if (direction.level === 'SECOND') {
                                directVip++
                            }
                        });

                        indirectionList.map(function (indirection) {
                            if (indirection.level === 'FIRST') {
                                indirectNormal++
                            } else if (indirection.level === 'SECOND') {
                                indirectVip++
                            }
                        });
                        let promotions = [
                            directNormal,
                            directVip,
                            indirectNormal,
                            indirectVip
                        ];
                        // promotions = [1, 0, 0, 0];
                        this.setState({promotionList: promotions});
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
    };


    getCash = () => {
        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.income;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        //可提现金额
                        let depositWithdraw = parseFloat(response.data.depositWithdraw);
                        let incomeWithdraw = parseFloat(response.data.incomeWithdraw);
                        let total = depositWithdraw + incomeWithdraw;
                        this.setState({takeCash: total.toString()})
                        // this.state.takeCash = response.data.withdrawing
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
    };

    cardManager = () => {
        Actions.cardmanager()
    };

    consumeRecord = () => {
        Actions.consumeRecord()
    };

    takeMoney = (amount) => {
        Actions.takemoney({orderAmount: amount})
    };

    growUp = () => {
        Actions.growUp()
    };


    changePsw = () => {
        Actions.changePsw();
    };


    help = () => {
        Actions.help();
    };

    share = () => {
        Actions.share();
    };

    customerService = () => {
        Actions.customerService();
    };

    promotionDetail = () => {
        Actions.promotionDetail()
    };

    logout = () => {
        StorageUtil.delete(BackInfo.USER_LOGIN); // 清除假数据缓存
        CommonDataManager.getInstance().setLogin('');

        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.logout;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    // 直接登出，防止token失效导致无法调用登出接口，死循环
                    Toast.show("注销成功", Toast.SHORT);
                    CommonDataManager.getInstance().setUser(null);
                    StorageUtil.set(DataKeys.userInfo, null);
                    Actions.replace('login');
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


    render() {
        const directNormal = '普通商户(' + this.state.promotionList[0] + ')';
        const directVip = 'VIP商户(' + this.state.promotionList[1] + ')';
        const indirectNormal = '普通商户(' + this.state.promotionList[2] + ')';
        const indirectVip = 'VIP商户(' + this.state.promotionList[3] + ')';
        // const chart_wh = 100;
        // const series = this.state.promotionList;
        let pieSeries = []
        let promotionAll = this.state.promotionList[0] + this.state.promotionList[1] + this.state.promotionList[2] +
            this.state.promotionList[3]
        if (promotionAll === 0) {
            pieSeries = [100]
        } else {
            this.state.promotionList.map(function (prom) {
                pieSeries.push(100 * prom / promotionAll)
            })
        }
        return (
            <View style={styles.root}>
                <HeaderView title="用户中心"
                            menuIcon={require("../../image/iv_share.png")}
                            desc="分享"
                            onPress={this.share}
                            back={false}
                />
                <ScrollView style={styles.container}>

                    <ImageBackground
                        source={require('../../image/iv_user_back.png')}
                        resizeMode='stretch'
                        style={styles.imgStyle}>
                        <Image
                            source={require('../../image/iv_default_head.png')}
                            style={styles.ivHeader}/>
                        {this.state.level === 'SECOND' ?
                            <Image
                                source={require('../../image/iv_vip.png')}
                                style={styles.ivVip}/>
                            :
                            <View/>
                        }
                        <Text style={styles.textNumber}>
                            {this.state.username}
                        </Text>
                    </ImageBackground>
                    <ImageBackground
                        source={require('../../image/iv_distribution_back.png')}
                        resizeMode='stretch'
                        style={styles.distributionBack}>
                        <View style={{flex: 1,}}>
                            <View style={styles.promotionRoot}>
                                <View style={styles.promotionContainer}>
                                    <Text style={styles.promotionCategory}>
                                        直接推广
                                    </Text>
                                    <Image source={(require('../../image/line_grey.png'))}
                                           style={styles.promotionTitleLine}/>
                                    <View style={styles.directPromotionBar}>
                                        <Image
                                            source={require('../../image/iv_direct_normal.png')}
                                            style={styles.promotionIcon}/>
                                        <Text style={styles.promotionText}>
                                            {directNormal}
                                        </Text>
                                    </View>
                                    <View style={styles.directPromotionBar}>
                                        <Image
                                            source={require('../../image/iv_direct_vip.png')}
                                            style={styles.promotionIcon}/>
                                        <Text style={styles.promotionText}>
                                            {directVip}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.promotionContainer}>
                                    <Text style={styles.promotionCategory}>
                                        间接推广
                                    </Text>
                                    <Image source={(require('../../image/line_grey.png'))}
                                           style={styles.promotionTitleLine}/>

                                    <View style={styles.indirectPromotionBar}>
                                        <Image
                                            source={require('../../image/iv_indirect_normal.png')}
                                            style={styles.promotionIcon}/>
                                        <Text style={styles.promotionText}>
                                            {indirectNormal}
                                        </Text>
                                    </View>
                                    <View style={styles.indirectPromotionBar}>
                                        <Image
                                            source={require('../../image/iv_indirect_vip.png')}
                                            style={styles.promotionIcon}/>
                                        <Text style={styles.promotionText}>
                                            {indirectVip}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                {/*<PieChart*/}
                                {/*chart_wh={chart_wh}*/}
                                {/*series={series}*/}
                                {/*sliceColor={colorScale}*/}
                                {/*/>*/}
                                {promotionAll === 0 ?
                                    <Pie series={pieSeries}
                                         colors={defaultColor}
                                         radius={win.width / 6.8}
                                         innerRadius={win.width / 12}/>
                                    :
                                    <Pie series={pieSeries}
                                         colors={colorScale}
                                         radius={win.width / 6.8}
                                         innerRadius={win.width / 12}/>
                                }
                            </View>

                            <TouchableOpacity style={styles.promotionDetailButton} onPress={this.promotionDetail}>
                                <Text style={{color: '#459fff'}}>
                                    详情
                                </Text>
                                <Image
                                    source={require('../../image/promotion_detail.png')}
                                    style={{width: 16, height: 18, marginLeft: 2, resizeMode: 'contain'}}/>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    <ImageBackground
                        source={require('../../image/login_back.png')}
                        resizeMode='stretch'
                        style={styles.userInfoBack}>
                        <UserPageItem
                            icon={require('../../image/iv_card_manager.png')}
                            text="银行卡管理"
                            onPress={this.cardManager}
                        />
                        <UserPageItem
                            icon={require('../../image/iv_take_cash.png')}
                            text={`提现（可提现${this.state.takeCash}元）`}
                            onPress={() => this.takeMoney(this.state.takeCash)}
                        />
                        <UserPageItem
                            icon={require('../../image/iv_transaction_detail.png')}
                            text="交易记录"
                            onPress={this.consumeRecord}
                        />
                        <UserPageItem
                            icon={require('../../image/iv_grow_up.png')}
                            text="成长体系"
                            onPress={this.growUp}
                        />
                        <UserPageItem
                            icon={require('../../image/iv_change_psw.png')}
                            text="修改密码"
                            onPress={this.changePsw}
                        />
                         <UserPageItem
                            icon={require('../../image/iv_user_select.png')}
                            text="客服"
                            onPress={this.customerService}
                        />
                        <UserPageItem
                            icon={require('../../image/iv_help.png')}
                            text="帮助"
                            onPress={this.help}
                        />
                    </ImageBackground>

                    <TouchableOpacity activeOpacity={0.6} style={styles.logoutBack}
                                      onPress={this.logout}
                    >
                        <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                        end={{x: 1, y: 0}} style={styles.logout}>
                            <Text style={{color: 'white', fontSize: 16}}>登出</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    imgStyle: {
        flexDirection: 'row',
        width: win.width,
        height: 150,
    },
    distributionBack: {
        justifyContent: 'space-between',
        marginTop: -30,
        width: win.width * 0.9,
        height: 200,
        alignSelf: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 15,
        // backgroundColor: 'yellow',

    },
    userInfoBack: {
        flex: 6,
        marginTop: 20,
        width: win.width * 0.9,
        height: 300,
        alignSelf: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    logoutBack: {
        marginTop: 12,
        marginBottom: 20,
        width: win.width * 0.9,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ivHeader: {
        width: 60,
        height: 60,
        marginTop: 30,
        marginLeft: 20,
    },
    ivVip: {
        width: 40,
        height: 16,
        marginTop: 70,
        resizeMode: 'contain'
    },
    textNumber: {
        width: 100,
        height: 20,
        marginTop: 70,
        color: '#ffffff'
    },
    logout: {
        flex: 1,
        flexDirection: 'row',
        width: win.width * 0.8,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    promotionContainer: {
        width: 130,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directPromotionBar: {
        width: 120,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    indirectPromotionBar: {
        width: 120,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    promotionIcon: {
        width: 16,
        height: 8,
    },
    promotionText: {
        width: 90,
        height: 20,
        color: '#459fff',
        textAlign: 'center'
    },
    promotionSpace: {
        width: 60,
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
        backgroundColor: 'yellow'
    },
    promotionRoot: {
        flexDirection: 'row', justifyContent: 'space-between',
    },
    promotionCategory: {
        color: '#459fff',
    },
    promotionDetailButton: {
        height: 20,
        alignSelf: 'flex-end',
        flexDirection: 'row'
    },
    promotionTitleLine: {
        width: 120,
        height: 2,
    }

});