import React, {Component} from 'react';
import {Dimensions, Image, ToastAndroid, BackHandler, StatusBar, Alert, View, Text, Keyboard} from "react-native";
import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux';
import RNExitApp from "react-native-exit-app";
import FakeHeaderView from "./FakeHeaderView";
import CardView from "../widget/CardView";
import Toast from "../widget/Toast";

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
const win = Dimensions.get('window');
const smallCardViewWidth = win.width / 4;
const smallCardViewIconSize = 15;
const cardViewWidth = win.width / 3;
const cardViewIconSize = 20;

export default class FakeHome extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("componentDidMount");
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    onBackAndroid = () => {
        console.log("onBackAndroid" + Actions.currentScene);
        if (Actions.currentScene === '_fakehome') {
            this.onBackExitAPP();
            return true;
        }
    };

    static onEnter = () => {
        console.log("HOme");
    };


    onBackExitAPP = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {

            //最近2秒内按过back键，可以退出应用。

            RNExitApp.exitApp();
            return true;

        }

        this.lastBackPressed = Date.now();

        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);

        return false;
    };

    openLeftDrawer = () => {
        Actions.drawerOpen();
    };

    onPress = () => {
        Toast.show("敬请期待", Toast.SHORT);
    };

    // swip 需要外面包裹一层再设置高度，要不高度会失效，沾满整个屏幕
    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent={false}/>
                <FakeHeaderView
                    title="首页"
                    onBack={this.openLeftDrawer}
                    backIcon = {require('../../image/ic_home_nearby.png')}
                />
                <View style={{flexDirection: 'column', height:height}}>
                    <View style={{height:width * 40 / 75}}>
                        <Image source={require('../../image/1.jpg')} style={styles.bannerImg} />
                    </View>
                    <View style={styles.creditContainer}>
                        <CardView
                            cardContainerBackgroundStyle={styles.subCreditCardContainer}
                            titleBarContainerStyle={[{width: cardViewWidth}, styles.subCreditTitleBar]}
                            creditIcon={[{width: cardViewIconSize, height: cardViewIconSize}, styles.creditIcon]}
                            creditTitle={styles.creditTitle}
                            creditDesc={styles.creditDesc}
                            backgroundImage={require('../../image/receipt_blue_back.png')}
                            icon={require('../../image/iv_credit_card.png')}
                            title={'生活'}
                            desc={'生活缴费'}
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
                            title={'购物'}
                            desc={'购物体验'}
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
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
        container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    wrpaper: {
        width: width,
        height:width * 40 / 75,

    },


    bannerImg: {
        height: width*40/75,
        width: width,
    },
    paginationStyle: {
        bottom: 6,
    },
    dotStyle: {
        width: 22,
        height: 3,
        backgroundColor:'#fff',
        opacity: 0.4,
        borderRadius: 0,
    },
    activeDotStyle: {
        width: 22,
        height: 3,
        backgroundColor:'#fff',
        borderRadius: 0,
    },
    creditContainer: {
        width: win.width,
        height: win.height / 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: win.height / 15,
        // marginRight: 10,
        // marginLeft: 10,
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
});
