import React, {Component} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import ModalSelector from 'react-native-modal-selector'
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';


import Toast from '../widget/Toast';
import {BankIcon} from "../const/BankList";
import Path from "../const/Path";
import CommonDataManager from "../manager/CommonDataManager";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import HeaderView from "../widget/HeaderView";
import ItemBar from "../widget/ItemBar";
import LoadingView from '../widget/LoadingView';


const win = Dimensions.get('window');


export default class Receipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payType: '',
            cardList: [],
            loading: false,
            cardId: '',
            tunnelInfo: [],
            tunnel: '',
        };
        this.onCheck.bind(this);
        // this.delayPay = _.debounce(this.pay, 200);
    }

    componentWillMount() {
        this.getCardList();
        this.getTunnelInfo();
    }

    init = (cardList) => {
        if (cardList !== '') {
            let data = cardList.map(item => false);
            this.setState({checked: data})
        }
    };


    startPay = () => {
        this.setState({loading: true});
        if (this.state.cardId === '') {
            this.setState({loading: false});
            Toast.show("请先选择一张付款卡", Toast.SHORT);
            return;
        }
        this.pay();
    };

    pay = () => {
        let payInfo = "payType: " + this.state.tunnel.key+ "; orderAmount: " + this.props.orderAmount;
        console.log(payInfo);
        //开始消费
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'cardId': this.state.cardId,
            'tunnel': this.state.tunnel.key,
            'amount': this.props.orderAmount,
            'type': 'UNIONPAY',
            'addon': {}
        };
        let url = Path.start;

        HttpClient.doPost(url, data, (code, response) => {
            this.setState({loading: false});
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;

                    if (codeStatus === 0) {
                        let orderData = response.data;
                        // let orderId = orderData.id;
                        let webTitle = orderData.title;
                        let requestUrl = orderData.url + "?code=" + (orderData.param).code
                            + "&appId=" + (orderData.param).appId
                            + "&time=" + (orderData.param).time;

                        console.log("result: " + requestUrl);
                        Actions.custompaypage({requestUrl: requestUrl, webTitle:webTitle});
                        // Actions.consume({orderId: orderId});
                    } else {
                        console.log("fail:" + codeStatus);
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

    getTunnelInfo = () => {
        let channelInfo = CommonDataManager.getInstance().getEnableTunnelInfo();
        if (channelInfo === null || channelInfo ==="") {
            Toast.show("返回通道信息有误", Toast.SHORT);
            return;
        }

        let tunnels = Array.from(channelInfo);
        let tunnelInfo = [];
        let id = 0;
        tunnels.map(function (tunnel) {
            tunnelInfo.push({
                id: id++,
                name: tunnel.name,
                rate: tunnel.rate,
                description: tunnel.description,
                key: tunnel.key,
            });
        });
        if (id >= 1) {
            this.setState({
                tunnel: tunnelInfo[0]
            })
        }

        // console.log("tunnelInfo: " + JSON.stringify(tunnelInfo));
        this.setState({tunnelInfo: tunnelInfo});
    };

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
                    // ToastAndroid.show(JSON.stringify(response.data), ToastAndroid.SHORT);
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
        // ToastAndroid.show(JSON.stringify(oldList), ToastAndroid.SHORT);
        oldList.map(function (cardData) {
            for (let bank of BankList) {
                if (bank.bankNo === cardData.bankNo) {
                    let dataItem = {
                        'abbrEN': bank.abbrEN,
                        'abbrCN': bank.abbrCN,
                        'bankName': bank.name,
                        'cardId': cardData.id,
                        'cardNo': cardData.cardNo,
                        'checked': false

                    };
                    data.push({key: dataItem})
                }
            }
        });
        this.setState({
            cardList: data,
        });
        this.init(data);
    };

    bindCard = () => {
        // Actions.replace('bindCard', {requestCode: 'receipt'});
        Actions.bindCard({requestCode: 'receipt'})
    };


    onCheck = (cardList, item) => {
        let key = item.key.cardId;
        console.log(key);
        let data = [];
        cardList.forEach((card) => {
            if (card.key.cardId === key) {
                card.key.checked = !card.key.checked;
                if (card.key.checked) {
                    // 选中
                    this.setState({cardId: key});
                } else {
                    // 取消
                    this.setState({cardId: ''});
                }
            } else {
                card.key.checked = false;
            }
            data.push({key: card.key});
        });
        this.setState({cardList: data});
    };

    labelExtractor = (item) => {
        return <Text>
            {`${item.name}  ${item.rate}\n`}
            <Text style={styles.tunnelDesc}>
                {item.description}
            </Text>
        </Text>
    };

    _renderItem = (cardList, {item}) => {
        let abbrEN = item.key.abbrEN;
        let abbrCN = item.key.abbrCN;
        let cardNo = item.key.cardNo;
        let checked = item.key.checked;
        let text = abbrCN + '(' + cardNo.slice(-4) + ')';

        let logo = "";
        if (Platform.OS === 'android') {
            logo = "asset:/bankLogo/default.png";
            if (BankIcon.includes(abbrEN)) {
                logo = "asset:/bankLogo/" + abbrEN + ".png";
            }
        } else {
            logo = "default";
            if (BankIcon.includes(abbrEN)) {
                logo = abbrEN;
            }
        }

        console.log("银行卡号：" + cardNo + "; 勾选状态: " + checked);
        return <TouchableOpacity onPress={() => this.onCheck(cardList, item)}>
            <ItemBar
                icon={logo}
                text={text}
                onCheck={() => this.onCheck(cardList, item)}
                checked={checked}
            />
        </TouchableOpacity>
    };

    _renderFooter = () => {
        return <TouchableOpacity onPress={this.bindCard}>
            <View style={styles.footer}>
                <View
                    style={{flex: 1, flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('../../image/iv_add.png')}
                           style={styles.addCardIcon}/>
                    <Text style={{fontSize: 15}}>
                        添加信用卡
                    </Text>
                </View>
                <Image
                    source={require('../../image/line_grey.png')}
                    style={{
                        width: win.width * 0.9, height: 1, marginTop: 2
                    }
                    }/>
            </View>
        </TouchableOpacity>
    };


    displayRatePage = () => {
        Actions.ratepage();
    };

    addCreditCard = () => {
        return <TouchableOpacity onPress={this.bindCard}>
            <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}} style={styles.btn}>
                <Image source={require('../../image/iv_add.png')}
                       style={styles.addCardIcon}/>
                <Text style={styles.addText}>
                    添加信用卡
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    };

    __keyExtractor = (item, index) => index.toString();

    onSelectTunnel = (tunnel) => {
        this.setState({
            tunnel: tunnel
        })
    };

    render() {
        let cardList = [];
        if (this.props.creditCardList.length > 0) {
            if (this.props.creditCardList.length === this.state.cardList.length) {
                console.log("state列表");
                cardList = this.state.cardList;
            } else {
                console.log("props列表");
                cardList = this.props.creditCardList;
            }
        } else {
            console.log("state列表");
            cardList = this.state.cardList;
        }

        return (
            <View style={styles.container}>
                <HeaderView title="收款"
                            backIcon={require("../../image/iv_back.png")}
                            menuIcon={require('../../image/iv_rate.png')}
                            onPress={this.displayRatePage}
                            desc="费率"
                />
                <View style={styles.receiptContainer}>
                    <View style={styles.receiptDescBar}>
                        <Image
                            style={styles.receiptIcon}
                            source={require('../../image/iv_receipt_default.png')}>
                        </Image>
                        <Text style={styles.receiptDescText}>
                            收款金额：
                        </Text>
                        <Text style={styles.orderAmountText}>
                            {this.props.orderAmount}
                        </Text>
                    </View>
                    <Text style={styles.payDescText}>
                        收款方式
                    </Text>
                    <ImageBackground
                        source={require('../../image/input_border.png')}
                        imageStyle={styles.inputBackgroundStyle}
                        style={styles.inputContainerStyle}
                    >
                        <ModalSelector
                            style={styles.payTypePicker}
                            optionTextStyle={styles.pickerItemStyle}
                            selectStyle={styles.selectItemStyle}
                            data={this.state.tunnelInfo}
                            keyExtractor={item => item.id}
                            labelExtractor={(item) => this.labelExtractor(item)}
                            initValue={this.state.tunnel.name}
                            cancelText="取消"
                            disabled={false}
                            onChange={this.onSelectTunnel}>
                            <Text style={{fontSize: 15, color: 'black'}}>
                                {`${this.state.tunnel.name} （${this.state.tunnel.rate}）`}
                            </Text>
                        </ModalSelector>
                    </ImageBackground>
                </View>
                <Text style={{marginBottom: 20}}>
                    请选择支付卡
                </Text>
                <View style={styles.cardContainer}>

                    {cardList.length > 0 ?
                        <FlatList
                            data={cardList}
                            keyExtractor={this.__keyExtractor}
                            renderItem={(item) => this._renderItem(cardList, item)}
                            ListFooterComponent={this._renderFooter}
                        >
                        </FlatList>
                        :
                        this.addCreditCard()
                    }
                </View>

                <TouchableOpacity onPress={this.startPay}>
                    <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}} style={styles.payBtn}>
                        <Text style={styles.addText}>
                            支付
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
                {this.state.loading && <LoadingView/>}
            </View>
        )
    }
}

Receipt.defaultProps = {
    creditCardList: []
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: win.width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    payContainer: {
        width: win.width,
        height: 200,
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 0,
        backgroundColor: 'yellow',
    },

    titleBarContainer: {
        width: win.width,
        height: 50,
        backgroundColor: '#1a55d1',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    title: {
        width: 100,
        height: 30,
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff',
    },
    receiptContainer: {
        flex: 3,
        width: win.width,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'green',
        // marginLeft: 30,
        // marginRight: 30,
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
    payDescText: {
        height: 22,
        fontSize: 18,
        color: 'black',
        alignSelf: 'flex-start',
        marginLeft: 20,
        // backgroundColor: '#f3e',
    },
    payTypePicker: {
        flex: 1,
        width: win.width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        // borderWidth: 1,
        // borderRadius: 3,
        // borderColor: 'blue',
        // backgroundColor: 'silver',
    },
    pickerItemStyle: {
        fontSize: 16,
        color: '#007bff',
        textAlign: 'left'
    },
    selectItemStyle: {
        flex: 1,
        width: win.width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        // borderColor: '#0073ff',

    },
    cardContainer: {
        flex: 7,
        width: win.width,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        margin: 10,
    },
    subCreditCardContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // backgroundColor: '#114455',
        borderRadius: 5,
        margin: 5,
    },
    subCreditCardContainerLarge: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // backgroundColor: '#114455',
        borderRadius: 5,
        margin: 1,
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
    addCardContainer: {
        width: win.width * 0.7,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addCardIcon: {
        width: 15,
        height: 15,
        resizeMode: 'stretch',
        marginRight: 3,
    },
    addText: {
        fontSize: 14,
        color: 'white',
    },
    textStyle: {
        color: 'white',
        fontSize: 16
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: win.width * 0.5,
        height: 40,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    payBtn: {
        width: win.width * 0.9,
        height: 40,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    tunnelDesc: {
        color: 'grey',
        fontSize: 14,
    }
});
