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
    ActivityIndicator,
    TouchableOpacity,
    Alert, ToastAndroid,
} from 'react-native';

import LinearGradient from "react-native-linear-gradient";
import BankCardView from '../widget/BankCardView';
import {BankColorList, BankList, BankIcon} from "../const/BankList";
import Path from "../const/Path";
import CommonDataManager from "../manager/CommonDataManager";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import {Actions} from 'react-native-router-flux';
import HeaderView from '../widget/HeaderView';
import Toast from '../widget/Toast';

const win = Dimensions.get('window');
const smallBankCardViewWidth = win.width * 0.8;


export default class CardManagerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creditCard: false,
            debitCardList: [],
            debitTabTitleColor: 'white',
            creditTabTitleColor: '#007bff',
            debitButtonColor: require('../../image/iv_blue_back.png'),
            creditButtonColor: require('../../image/iv_blue_back.png')
        };
    }

    componentWillMount() {
        if (this.state.creditCard) {
            this.getCreditCardList();
        } else {
            this.getDebitCardList();
        }
    }

    componentDidMount() {
        console.log("componentDidMount");
    }

    changeCard = () => {
        Actions.merchantregister({title: '绑定银行卡', opType: 'update'});
    };

    addCard = () => {
        Actions.bindCard({requestCode: 'cardmanager'});
    };

    onCreditSelect = () => {
        this.getCreditCardList();
        this.setState({
            creditCard: true,
            debitTabTitleColor: '#007bff',
            creditTabTitleColor: 'white',
            // creditButtonColor: require('../../image/iv_blue_back.png'),
            // debitButtonColor: require('../../image/iv_white_background.png'),
        })
    };

    onDebitSelect = () => {
        this.getDebitCardList();
        this.setState({
            creditCard: false,
            debitTabTitleColor: 'white',
            creditTabTitleColor: '#007bff',
            // debitButtonColor: require('../../image/iv_blue_back.png'),
            // creditButtonColor: require('../../image/iv_white_background.png'),
        })
    };

    getDebitCardList = () => {
        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.mine;
        HttpClient.doPost(url, data, (code, response) => {
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        this.transformDebitCardList(response.data);
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

    getCreditCardList = () => {
        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.cardList;
        HttpClient.doPost(url, data, (code, response) => {
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        // Toast.show(JSON.stringify(response.data), Toast.SHORT);
                        this.transformCreditCardList(response.data);
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

    transformDebitCardList = (info) => {
        let bankList = CommonDataManager.getInstance().getBankInfo();
        let data = [];

        for (let bank of bankList) {
            if (bank.bankId === info.bankId) {
                data.push({
                    key: {
                        'abbrEN': bank.abbrEN,
                        'abbrCN': bank.abbrCN,
                        'bankName': bank.name,
                        'bankId': bank.bankId,
                        'cardNo': info.bankAccountNo,
                    }
                });
                break;
            }
        }
        this.setState({
            debitCardList: data,
        })
    };


    transformCreditCardList = (oldList) => {
        // Toast.show(JSON.stringify(oldList), Toast.SHORT);
        let bankList = CommonDataManager.getInstance().getBankInfo();

        let data = oldList.map(cardData => {
            for (let bank of bankList) {
                if (bank.bankNo === cardData.bankNo) {
                    return {
                        key: {
                            'abbrEN': bank.abbrEN,
                            'abbrCN': bank.abbrCN,
                            'bankName': bank.name,
                            'cardId': cardData.id,
                            'cardNo': cardData.cardNo
                        }
                    }
                }
            }
        });
        Actions.refresh({creditCardList: data});
    };

    _renderItem = ({item}) => {
        let abbrEN = item.key.abbrEN;
        let abbrCN = item.key.abbrCN;
        let accountNO = item.key.cardNo;
        let cardId = item.key.cardId;
        let logo = "";
        if (Platform.OS === 'android'){
            logo = "asset:/bankLogo/default.png";
            if (BankIcon.includes(abbrEN)){
                logo = "asset:/bankLogo/" + abbrEN + ".png";
            }
        } else {
            logo = "default";
            if (BankIcon.includes(abbrEN)){
                logo = abbrEN;
            }
        }

        let background = '#007bff';
        if (BankColorList.hasOwnProperty(abbrEN)) {
            background = BankColorList[abbrEN];
        }
        let deleteIcon = '';
        if (this.state.creditCard) {
            deleteIcon = require('../../image/iv_delete.png')
        }
        return <BankCardView
            cardContainerBackgroundStyle={[{backgroundColor: background}, styles.subCreditCardContainer]}
            titleBarContainerStyle={[{width: smallBankCardViewWidth}, styles.subCreditTitleBar]}
            creditIcon={[{
                width: 15,
                height: 15
            }, styles.creditIcon]}
            creditTitle={styles.creditTitle}
            creditDesc={styles.creditDesc}
            // backgroundImage={background}
            icon={logo}
            title={abbrCN}
            desc={accountNO}
            deleteIcon={deleteIcon}
            deleteIconStyle={styles.deleteIconStyle}
            deleteContainterStyle={styles.deleteContainterStyle}
            onDelete={() => this.onDelete(cardId)}
        />
    };


    __keyExtractor = (item, index) => index.toString();

    onDelete = (cardId) => {
        Alert.alert(
            '注意',
            '您要删除该卡吗？',
            [
                {text: '取消', onPress: () => console.log('cancel'), style: 'cancel'},
                {
                    text: '确定', onPress: () => {
                        this.deleteCard(cardId)
                    }
                },
            ],
            // {cancelable: false}
        )

    };

    deleteCard = (cardId) => {
        console.log("要删除的银行卡id: " + cardId);
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'id': cardId,
        };
        let url = Path.deletecard;
        HttpClient.doPost(url, data, (code, response) => {
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        if (this.state.creditCard) {
                            this.getCreditCardList();
                        } else {
                            this.getDebitCardList();
                        }
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

    render() {
        return (
            <View style={styles.root}>
                <HeaderView title="银行卡管理"/>
                <ImageBackground
                    source={require('../../image/input_border.png')}
                    imageStyle={styles.inputBackgroundStyle}
                    style={styles.inputContainerStyle}
                >
                    <TouchableOpacity onPress={this.onDebitSelect}>
                        {!this.state.creditCard ?
                            <ImageBackground
                                imageStyle={styles.inputBackgroundStyle}
                                style={styles.tabBackgroundStyle}
                                source={this.state.debitButtonColor}>
                                <Text style={[{color: this.state.debitTabTitleColor}, styles.input]}>
                                    收款卡
                                </Text>
                            </ImageBackground>
                            :
                            <View style={styles.tabBackgroundStyle}>
                                <Text style={[{color: this.state.debitTabTitleColor}, styles.input]}>
                                    收款卡
                                </Text>
                            </View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onCreditSelect}>
                        {this.state.creditCard ?
                            <ImageBackground
                                source={this.state.creditButtonColor}
                                imageStyle={styles.inputBackgroundStyle}
                                style={styles.tabBackgroundStyle}
                            >
                                <Text style={[{color: this.state.creditTabTitleColor}, styles.input]}>
                                    付款卡
                                </Text>
                            </ImageBackground>
                            :

                            <View style={styles.tabBackgroundStyle}>
                                <Text style={[{color: this.state.creditTabTitleColor}, styles.input]}>
                                    付款卡
                                </Text>
                            </View>
                        }
                    </TouchableOpacity>
                </ImageBackground>
                {this.state.creditCard ?
                    <View style={styles.cardListContainer}>
                        <FlatList
                            data={this.props.creditCardList}
                            keyExtractor={this.__keyExtractor}
                            renderItem={this._renderItem}>
                        </FlatList>

                        <TouchableOpacity activeOpacity={0.6}
                                          style={{alignSelf: 'flex-end', width: win.width - 40, height: 40}}
                                          onPress={this.addCard}>
                            <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}} style={styles.btn}>
                                <Text style={styles.textStyle}>添加</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cardListContainer}>
                        <FlatList
                            data={this.state.debitCardList}
                            keyExtractor={this.__keyExtractor}
                            renderItem={this._renderItem}>
                        </FlatList>
                        <TouchableOpacity activeOpacity={0.6}
                                          style={{alignSelf: 'flex-end', width: win.width - 40, height: 40}}
                                          onPress={this.changeCard}>
                            <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}} style={styles.btn}>
                                <Text style={styles.textStyle}>更换收款卡</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    };


};

CardManagerPage.defaultProps = {
    creditCardList: ''
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center'
        // backgroundColor: '#f6f6f6',
    },
    tabContainer: {
        width: win.width * 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        // backgroundColor: '#f6f6f6',
    },
    tabStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardListContainer: {
        flex: 1,
        padding: 20,
    },
    btn: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textStyle: {
        color: 'white',
        fontSize: 16
    },
    subCreditCardContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // backgroundColor: '#114455',
        borderRadius: 5,
        margin: 5,
    },
    creditIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    subCreditTitleBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 15,
        marginTop: 25,
        marginLeft: 20,
        // backgroundColor: '#ac78d1',
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
    deleteContainterStyle: {
        flex: 1,
        // backgroundColor: '#3344ff',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        // alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 20,
    },
    deleteIconStyle: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    inputContainerStyle: {
        width: win.width * 0.9,
        height: 40,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    inputBackgroundStyle: {
        resizeMode: Image.resizeMode.contain,
    },
    tabBackgroundStyle: {
        flex: 1,
        width: win.width * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    input: {
        width: win.width * 0.2,
        height: 20,
        textAlign: 'center',
        // color: 'white',
        // backgroundColor: '#ee11dd',

    },
});