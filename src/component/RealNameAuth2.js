import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ImageBackground, NativeModules,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import Button from 'apsl-react-native-button'
import HeaderView from "../widget/HeaderView";
import {Actions} from 'react-native-router-flux';
import DataKeys from "../const/DataKeys";
import Toast from "../widget/Toast";
import HttpClient from "../network/HttpClient";
import UriToPhoto from "../util/UriToPhoto";
import Path from "../const/Path";
import CommonDataManager from "../manager/CommonDataManager";
import HttpCode from "../const/HttpCode";
import TextInput from '../widget/TextInput';
var ImagePicker = NativeModules.ImageCropPicker;

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');

export default class FakeIdCardInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holdCardImage: '',
            idCardName: '',
            idCardNo:'',
            email: '',
            address: '',
            isLoading: false,
        }
    }

    componentWillMount() {
        this.setState({idCardNo:this.props.idCardNo});
    }


    holdCardImage = async () => {
        // Actions.camera({requestFrom: DataKeys.HOLD_ID_CARD});
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 300,
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.setState({
                holdCardImage:image.path
            });
        }).catch(e => console.log(e));
    };

    gotoRegister = () => {
        Actions.replace('merchantregister', {refresh: {type: 'register'}});
    };

    complete = () => {
        const frontCardImage = this.state.frontCardImage? this.state.frontCardImage: this.props.frontCardImage;

        console.log("=========" + this.props.backCardImage + "===" + frontCardImage + "===" + this.state.holdCardImage);

        if (this.props.backCardImage === ''
            || frontCardImage === ''
            || this.state.holdCardImage === '') {
            Toast.show('身份证照片不能为空', Toast.SHORT);
            return;

        }

        if (this.state.idCardNo === '') {
            Toast.show('身份证号码不能为空', Toast.SHORT);
            return;
        }

        if (this.state.idCardName === '') {
            Toast.show('姓名不能为空', Toast.SHORT);
            return;
        }

        if (this.state.email === '') {
            Toast.show('邮箱不能为空', Toast.SHORT);
            return;
        }
        if (this.state.address === '') {
            Toast.show('地址不能为空', Toast.SHORT);
            return;
        }

        this.setState({isLoading: true});

        let values = {
            'token': CommonDataManager.getInstance().getToken(),
            'name': this.state.idCardName,
            'idNo': this.state.idCardNo,
            'email': this.state.email,
            'address': this.state.address,
        };

        let files = [
            UriToPhoto(frontCardImage, "idCardPhoto"),
            UriToPhoto(this.props.backCardImage, "idCardBackPhoto"),
            UriToPhoto(this.state.holdCardImage, "idCardHoldPhoto")
        ];

        HttpClient.doPostForm(Path.certificate, values, files, (code, response) => {
            this.setState({isLoading: false});
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        let result = response.data;
                        console.log(result);
                        // Toast.show("注册成功", Toast.SHORT);
                        this.gotoRegister();
                    } else {
                        let result = response.msg;
                        Toast.show(result + '', Toast.SHORT);
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
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent={false}/>
                <HeaderView
                    title="实名认证"
                    back={true}
                />

                {this.state.holdCardImage ?
                <TouchableHighlight onPress={this.holdCardImage}>
                    <Image style={styles.cardImage}
                           source={{uri: this.state.holdCardImage}}/>
                </TouchableHighlight>
                :
                    <TouchableHighlight onPress={this.holdCardImage}>
                        <Image style={styles.cardImage}
                               source={require('../../image/hand.png')}/>
                    </TouchableHighlight>
                 }

                <ImageBackground
                    source={require('../../image/input_border.png')}
                    imageStyle={styles.inputBackgroundStyle}
                    style={styles.inputContainerStyle}
                >
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.input}
                        placeholder="身份证号码"
                        keyboardType='numeric'
                        value={this.state.idCardNo}
                        onChangeText={(cardNo) => this.setState({
                            idCardNo: cardNo
                        })}
                    />
                </ImageBackground>
                <ImageBackground
                    source={require('../../image/input_border.png')}
                    imageStyle={styles.inputBackgroundStyle}
                    style={styles.inputContainerStyle}
                >
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.input}
                        placeholder="姓名"
                        value={this.state.idCardName}
                        onChangeText={(name) => this.setState({
                            idCardName: name
                        })}
                    />
                </ImageBackground>
                <ImageBackground
                    source={require('../../image/input_border.png')}
                    imageStyle={styles.inputBackgroundStyle}
                    style={styles.inputContainerStyle}
                >
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.input}
                        placeholder="邮箱"
                        keyboardType='email-address'
                        value={this.state.email}
                        onChangeText={(email) => this.setState({
                            email: email
                        })}
                    />
                </ImageBackground>
                <ImageBackground
                    source={require('../../image/input_border.png')}
                    imageStyle={styles.inputBackgroundStyle}
                    style={styles.inputContainerStyle}
                >
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.input}
                        placeholder="地址"
                        value={this.state.address}
                        onChangeText={(address) => this.setState({
                            address: address
                        })}
                    />
                </ImageBackground>
                 
                <Button
                    style={{ alignSelf: 'center',
                        fontSize: 18,
                        height:40,
                        width:width-80,
                        color: 'white',
                        backgroundColor:'#0073ff',
                        borderColor:'#0073ff',
                        marginTop:25}}
                    styleDisabled={{ color: 'white' }}
                    containerStyle={{ padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: 'aqua' }}
                    onPress={this.complete}
                >
                    <Text style={{color:'#ffffff'}}>
                        完成
                    </Text>
                </Button>

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

    idcard: {
        alignSelf: 'center',
        fontSize: 20,
        height:150,
        width:width-100,
        color: 'white',
        marginTop:40
    },

    cardImage: {
        width: width - 100,
        height: 150,
        alignSelf: 'center',
        marginTop:40,
        resizeMode: Image.resizeMode.stretch,
    },

    inputContainerStyle: {
        width: width -100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    inputBackgroundStyle: {
        resizeMode: Image.resizeMode.stretch,
    },

    input: {
        width: width -100,
        height: 40,
    },
});