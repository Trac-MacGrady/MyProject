import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ImageBackground, NativeModules,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from "react-native";
import Button from 'apsl-react-native-button'
import HeaderView from "../widget/HeaderView";
import {Actions} from 'react-native-router-flux';
import IDCardScan from '../native/IDCardScan';
import DataKeys from "../const/DataKeys";
import Toast from "../widget/Toast";
import StorageUtil from "../util/StorageUtil";
import BackInfo from "../const/BackInfo";
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


    complete = () => {
        const frontCardImage = this.state.frontCardImage? this.state.frontCardImage: this.props.frontCardImage;

        if (this.props.backCardImage === ''
            || frontCardImage === ''
            || this.state.holdCardImage === '') {
            Toast.show('身份证照片不能为空', Toast.SHORT);
            return;

        }
        if (this.state.idCardName === '') {
            Toast.show('姓名不能为空', Toast.SHORT);
            return;
        }

        if (this.state.idCardNo === '') {
            Toast.show('身份证号码不能为空', Toast.SHORT);
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

        StorageUtil.set(BackInfo.IDCARD_NUM, this.state.idCardNo);
        Toast.show("实名认证成功！", Toast.SHORT);
        Actions.replace('fakehome');
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