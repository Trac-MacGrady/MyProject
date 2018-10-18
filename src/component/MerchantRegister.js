import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ImageBackground,
    FlatList,
    Button,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView, NativeModules,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import BankCardScan from '../native/BankCardScan';
import HeaderView from "../widget/HeaderView";
import HttpClient from "../network/HttpClient";
import VerifyCard from "../util/VerifyCard";
import UriToPhoto from "../util/UriToPhoto";
import LoadingView from "../widget/LoadingView";
import CommonDataManager from "../manager/CommonDataManager";
import Path from "../const/Path";
import HttpCode from "../const/HttpCode";
import {CardType} from "../const/BankList";
import Toast from '../widget/Toast';
import DataKeys from '../const/DataKeys';
import TextInput from '../widget/TextInput';
import _ from 'lodash';
import CheckUtil from "../util/CheckUtil";

const win = Dimensions.get('window');
var ImagePicker = NativeModules.ImageCropPicker;

export default class MerchantRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankCardFrontImage: '',  // 银行卡照片
            bankCardBackImage: '',  // 银行卡照片
            bankCardNo: '', // 银行卡卡号
            supportBank: CommonDataManager.getInstance().getSupportBankInfo(), // 支持的银行卡
            // bankName: '选择银行', // 开户行名称
            // subBankName: '选择开户行支行', // 开户行支行
            mobile: '',  // 银行卡关联手机号
            tunnel: 'EPAY', // 支付通道标识
            channel: '3008', // 支付通道下的费率渠道
            isLoading: false,
        };
        this.delayRegister = _.debounce(this.register, 500)
    }

    takeCardFrontImage = async () => {
        this.setState({isLoading: true});
        try {
            let {bankCardImage, bankCardNo} = await BankCardScan.scanBankCard();
            console.log("card: " + bankCardImage + ';' + bankCardNo);
            this.setState({
                bankCardFrontImage: bankCardImage,
                bankCardNo: bankCardNo,
                isLoading: false,
            })

        } catch (e) {
            this.setState({isLoading: false});
            console.log(e);
        }
    };

    takeCardBackImage = () => {
        // Actions.camera({requestFrom: DataKeys.BACK_BANK_CARD});
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 300,
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.setState({
                bankCardBackImage:image.path
            });
        }).catch(e => console.log(e));
    };


    onTakePicture = () => {
        // this.setState({
        //     bankCardFrontImage: '',
        // });
        // Actions.camera({requestFrom: DataKeys.FRONT_BANK_CARD});
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 300,
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.setState({
                bankCardFrontImage:image.path
            });
        }).catch(e => console.log(e));
    };

    verifyCard = (cardNo, bankCardFrontImage) => {
        this.setState({isLoading: true});
        VerifyCard(cardNo, (code, response) => {
            if (response.hasOwnProperty("validated")) {
                if (response.validated) {
                    let abbrEN = response.bank;
                    let cardType = response.cardType;
                    if (cardType !== CardType.Debit) {
                        this.setState({isLoading: false});
                        Toast.show("只能绑定储蓄卡", Toast.SHORT);
                    } else {
                        this.delayRegister(cardNo, bankCardFrontImage);
                    }
                } else {
                    this.setState({isLoading: false});
                    Toast.show("无效的银行卡号", Toast.SHORT);
                }
            }
            console.log(response);
        });
    };

    getSubBankName = () => {
        if (this.props.bankName === '银行名称') {
            Toast.show('银行名称不能为空', Toast.SHORT);
            return;
        }

        Actions.areapicker({bankId: this.props.bankId});
    };

    getBankName = () => {
        Actions.bankpicker();
    };

    gotoHome = () => {
        Actions.pop();
    };

    confirm = () => {
        const bankCardFrontImage = this.state.bankCardFrontImage ? this.state.bankCardFrontImage : this.props.bankCardFrontImage;
        if (this.state.bankCardBackImage === ''
            || bankCardFrontImage === '') {
            Toast.show('银行卡照片不能为空', Toast.SHORT);
            return;
        }
        if (this.state.bankAccountNo === '') {
            Toast.show('银行卡号码不能为空', Toast.SHORT);
            return;
        }
        if (this.state.mobile === ''){
            Toast.show('手机号码不能为空', Toast.SHORT);
            return;
        }
        if (!CheckUtil.checkPhone(this.state.mobile)) {
            Toast.show('请输入正确的手机号', Toast.SHORT);
            return;
        }
        if (this.props.bankName === '银行名称') {
            Toast.show('银行名称不能为空', Toast.SHORT);
            return;

        }
        if (this.props.subBankName === '开户行支行名称') {
            Toast.show('支行名称不能为空', Toast.SHORT);
            return;
        }

        if (Platform.OS === 'android') {
            if (!this.state.supportBank.contains(this.props.bankName)) {
                Toast.show("抱歉，暂不支持该银行卡绑定", Toast.SHORT);
                return;
            }
        }

        this.verifyCard(this.state.bankCardNo, bankCardFrontImage);
    };

    register = (cardNo, bankCardFrontImage) => {
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'bankAccountNo': cardNo,
            'bankMobileNo': this.state.mobile,
            "unionNo": this.props.unionNo,
            "cityNo": this.props.cityId,
            "channel": this.state.channel,
            "tunnel": this.state.tunnel,
            "addon": {}
        };
        let files = [
            UriToPhoto(bankCardFrontImage, "cardPhoto"),
            UriToPhoto(this.state.bankCardBackImage, "cardBackPhoto")
        ];
        // Toast.show(JSON.stringify(data), Toast.SHORT);

        let url = Path.merchantRegister;
        if (this.props.opType === 'update') {
            url = Path.update;
        }
        this.setState({isLoading: true});
        HttpClient.doPostForm(url, data, files, (code, response) => {
            this.setState({isLoading: false});
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    // Toast.show(JSON.stringify(response.data), Toast.SHORT);

                    if (codeStatus === 0) {
                        let result = response.data;
                        console.log(result);

                        // Toast.show(JSON.stringify(response.data), Toast.SHORT);
                        Toast.show("绑卡成功", Toast.SHORT);
                        this.gotoHome();
                    } else {
                        Toast.show(response.msg, Toast.SHORT);
                    }
                    break;
                case HttpCode.ERROR:
                    let responseMessage = response.data;
                    if ("请求超时，请稍后重试" === response.data) {
                        Toast.show(responseMessage, Toast.SHORT);
                        console.log("==== + " + responseMessage);
                        return;
                    }

                    Toast.show("网络问题，请重试", Toast.SHORT);
                    console.log("http请求失败");
                    break;
                default:
                    break;
            }
            console.log(response);
        })
    };

    openChannel = () => {
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
            'tunnel': 'EPAY',
            'channel': '3008',
            'addon': {}
        };
        Toast.show(JSON.stringify(data), Toast.SHORT);
        let url = Path.openChannel;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    Toast.show(JSON.stringify(response.data), Toast.SHORT);
                    if (codeStatus === 0) {
                        Toast.show('通道开通成功', Toast.SHORT);
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

    renderContent = () => {
        const bankCardFrontImage = this.state.bankCardFrontImage ? this.state.bankCardFrontImage : this.props.bankCardFrontImage;
        const bankName = this.props.bankName;
        const subBankName = this.props.subBankName;
        const supportBankInfo = this.state.subBankName;
        const title = this.props.title;
        return <View style={styles.root}>
            <HeaderView title={title}
                        backIcon={require("../../image/iv_back.png")}
            />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.scrollView}>
                    <Text style={styles.takePictureHint}>
                        如果要重新扫描，点击下面的图片即可
                    </Text>
                    <View style={styles.cardContainer}>
                        {bankCardFrontImage ?
                            <TouchableOpacity onPress={this.takeCardFrontImage}>
                                <Image style={styles.cardImage}
                                       source={{uri: bankCardFrontImage}}/>
                            </TouchableOpacity>
                            :
                            <View style={styles.scanButton}>
                                <Button title="点击扫描银行卡正面" onPress={this.takeCardFrontImage}/>
                            </View>
                        }
                        {this.state.bankCardBackImage ?
                            <TouchableOpacity onPress={this.takeCardBackImage}>
                                <Image style={styles.cardImage}
                                       source={{uri: this.state.bankCardBackImage}}/>
                            </TouchableOpacity>
                            :
                            <View style={styles.scanButton}>
                                <Button title="点击扫描银行卡背面" onPress={this.takeCardBackImage}/>
                            </View>
                        }
                    </View>
                    <Text style={{width: win.width * 0.9, fontSize: 13, marginBottom:10, color: "#000000"}}>
                        提示，支持的银行卡有：{this.state.supportBank}
                    </Text>
                    <Text style={styles.takePictureHint}>
                        如果无法识别卡号，请点击此处仅拍照，手动输入卡号
                    </Text>
                    <View style={styles.onlyTakePictureButton}>
                        <Button title="拍照" onPress={this.onTakePicture}/>
                    </View>
                    <ImageBackground
                        source={require('../../image/input_border.png')}
                        imageStyle={styles.inputBackgroundStyle}
                        style={styles.inputContainerStyle}
                    >
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.input}
                            placeholder="银行卡卡号"
                            keyboardType='numeric'
                            value={this.state.bankCardNo}
                            onChangeText={(cardNo) => this.setState({bankCardNo: cardNo})}
                        />
                    </ImageBackground>
                    <ImageBackground
                        source={require('../../image/input_border.png')}
                        imageStyle={styles.inputBackgroundStyle}
                        style={styles.inputContainerStyle}
                    >
                        <TouchableOpacity style={styles.touchContainer} onPress={this.getBankName}>
                            <Text style={styles.input}>
                                {bankName}
                            </Text>
                        </TouchableOpacity>
                    </ImageBackground>

                    <ImageBackground
                        source={require('../../image/input_border.png')}
                        imageStyle={styles.inputBackgroundStyle}
                        style={styles.inputContainerStyle}
                    >
                        <TouchableOpacity style={styles.touchContainer} onPress={this.getSubBankName}>
                            <Text style={styles.input}>
                                {subBankName}
                            </Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <ImageBackground
                        source={require('../../image/input_border.png')}
                        imageStyle={styles.inputBackgroundStyle}
                        style={styles.inputContainerStyle}
                    >
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.input}
                            placeholder="银行卡关联手机号"
                            keyboardType='phone-pad'
                            value={this.state.mobile}
                            onChangeText={(mobileNo) => this.setState({
                                mobile: mobileNo,
                            })}
                        />
                    </ImageBackground>

                    <View style={styles.confirm}>
                        <Button title="确定" onPress={this.confirm}/>
                    </View>
                </View>
            </ScrollView>
            {this.state.isLoading && <LoadingView/>}
        </View>
    };

    render() {

        return (
            Platform.OS === 'ios' ?
                <KeyboardAvoidingView style={styles.root} behavior="padding" enabled>
                    {this.renderContent()}
                </KeyboardAvoidingView>
                :
                this.renderContent()
        )
    }
}

MerchantRegister.defaultProps = {
    bankName: '银行名称',
    subBankName: '开户行支行名称',
    unionNo: '',
    bankId: '',
    title: '绑定银行卡',
    opType: '',
    bankCardFrontImage: '',
    bankCardBackImage: '',
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    scrollView: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cardContainer: {
        width: win.width,
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        width: win.width * 0.4,
        height: win.width * 0.4 * 0.63,
        marginRight:5,
        marginLeft:5,
        resizeMode: Image.resizeMode.stretch,
    },
    scanButton: {
        width: win.width * 0.3,
        margin: 2,
    },
    takePictureHint: {
        width: win.width * 0.9,
        fontSize: 13,
    },
    onlyTakePictureButton: {
        width: win.width * 0.4,
        margin: 3,
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
        width: win.width * 0.5,
        height: 40,
        margin: 20,
        borderRadius: 2,
    },
    touchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

