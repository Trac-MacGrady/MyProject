import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ImageBackground,
    TextInput,
    FlatList,
    Picker,
    Button,
    WebView,
    TouchableOpacity,
    Keyboard
} from 'react-native';

import Path from "../const/Path";
import CommonDataManager from "../manager/CommonDataManager";
import LinearGradient from "react-native-linear-gradient";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import {Actions} from 'react-native-router-flux';
import Toast from '../widget/Toast';

const win = Dimensions.get('window')

import HeaderView from '../widget/HeaderView';
import CheckUtil from "../util/CheckUtil";

export default class TakeMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
        }
    }

    displayRate = () => {
        Actions.ratepage();
        Keyboard.dismiss();
    };

    takeAll = () => {
        this.setState({
            amount: this.props.orderAmount
        })
    };

    confirm = () => {
        if (!CheckUtil.checkMoney(this.state.amount)){
            Toast.show("请输入正确的金额", Toast.SHORT);
            return;
        }
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'amount': this.state.amount,
            'type': 'INCOME'
        };
        let url = Path.takeMoney;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    if (response.code === 0){
                        Toast.show("正在提现", Toast.SHORT);
                    } else {
                        Toast.show(response.msg, Toast.SHORT);
                    }
                    break;
                case HttpCode.FAIL:
                    let msg = "服务器异常";
                    if (response.hasOwnProperty('msg')){
                        msg = response.msg;
                    }
                    Toast.show(msg, Toast.SHORT);
                    break;
                case HttpCode.ERROR:
                    Toast.show("网络故障，请重试", Toast.SHORT);
                    break;
                default:
                    Toast.show(response.msg, Toast.SHORT);
                    break;
            }
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <HeaderView title="提现"
                            menuIcon={require('../../image/iv_rate.png')}
                            desc="费率"
                            onPress={this.displayRate}
                />
                <View style={styles.receiptContainer}>
                    <View style={styles.receiptDescBar}>
                        <Image
                            style={styles.receiptIcon}
                            source={require('../../image/iv_take_money.png')}>
                        </Image>
                        <Text style={styles.receiptDescText}>
                            可提现
                        </Text>
                        <Text style={styles.orderAmountText}>
                            {this.props.orderAmount}
                        </Text>
                        <Text style={styles.receiptDescText}>
                            元
                        </Text>
                    </View>
                    <ImageBackground
                        source={require('../../image/input_border.png')}
                        imageStyle={styles.inputBackgroundStyle}
                        style={styles.inputContainerStyle}
                    >
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.input}
                            placeholder="请输入金额"
                            keyboardType='numeric'
                            value={this.state.amount}
                            onChangeText={(amount) => this.setState({
                                amount: amount,
                            })}
                        />
                    </ImageBackground>
                    <TouchableOpacity style={styles.allMoney} onPress={this.takeAll}>
                    <Text style={styles.moneyHint}>
                        全部提现
                    </Text>
                    </TouchableOpacity>
                </View>
                    <TouchableOpacity activeOpacity={0.6} style={{marginTop: 30, width: win.width - 40, height: 40}}
                                      onPress={this.confirm}>
                        <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                        end={{x: 1, y: 0}} style={styles.btn}>
                            <Text style={{color: 'white', fontSize: 16}}>提现</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                <Text style={styles.timeHint}>
                    一个工作日到账
                </Text>
            </View>
        )
    }
}

TakeMoney.defaultProps = {
    orderAmount: '0'
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: win.width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    receiptContainer: {
        // flex: 3,
        width: win.width,
        height: win.height * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    receiptDescBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginLeft: 20,
        // backgroundColor: '#ddd',
    },
    receiptIcon: {
        width: 20,
        height: 20,
        resizeMode: Image.resizeMode.contain
    },
    receiptDescText: {
        fontSize: 18,
        color: 'black',
    },
    orderAmountText: {
        fontSize: 18,
        color: 'red',
    },


    inputContainerStyle: {
        width: win.width * 0.9,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    inputBackgroundStyle: {
        resizeMode: Image.resizeMode.stretch,
    },

    input: {
        width: win.width * 0.8,
        // textAlign: 'center',
        // backgroundColor: '#ee11dd',

    },
    confirm: {
        width: win.width * 0.9,
        height: 40,
        marginTop: 20,
        borderRadius: 2,
    },
    touchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    allMoney: {
        alignSelf: 'flex-end',
        marginRight: 18,
    },

    moneyHint: {
         color: '#0073ff',
        fontSize: 12,
    },
    timeHint: {
        color: '#0073ff',
        fontSize: 12,
    },
     btn: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
});