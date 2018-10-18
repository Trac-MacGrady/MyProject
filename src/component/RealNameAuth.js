import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    NativeModules,
    TouchableHighlight,
    KeyboardAvoidingView,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import HeaderView from '../widget/HeaderView';
import IDCardScan from '../native/IDCardScan';
import DataKeys from "../const/DataKeys";
import Button from 'apsl-react-native-button'
var ImagePicker = NativeModules.ImageCropPicker;

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');

export default class RealNameAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frontCardImage: '',
            backCardImage: '',
            idCardName: '',
            email: '',
            address: '',
            idCardNo: '',
            frontPhoto: '',
            backPhoto: '',
            isLoading: false,
        }
    }
    

    takeBackImage = async () => {
        // Actions.camera({requestFrom: DataKeys.BACK_ID_CARD});
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 300,
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.setState({
                backCardImage:image.path
            });
        }).catch(e => console.log(e));
    };

    onTakePicture = async () => {
        // this.setState({frontCardImage: ''});
        // Actions.camera({requestFrom: DataKeys.FRONT_ID_CARD})
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 300,
            includeExif: true,
        }).then(image => {
            console.log('received image', image);
            this.setState({
                frontCardImage:image.path
            });
        }).catch(e => console.log(e));
    };

    takeFrontImage = async () => {
        this.setState({isLoading: true});
        try {
            let {idCardFrontImage, idCardNo} = await IDCardScan.scanIdCard(DataKeys.FRONT_ID_CARD_CODE);
            console.log("card: " + idCardFrontImage + ';' + idCardNo);
            this.setState({
                frontCardImage: idCardFrontImage,
                idCardNo: idCardNo,
                isLoading: false,
            })

        } catch (e) {
            this.setState({isLoading: false});
        }
    };


    nextPage = () => {
        let idCardNo = this.state.idCardNo;
        console.log("=========" + this.props.backCardImage + "===" + this.state.frontCardImage + "===" + this.props.holdCardImage);
        Actions.realnameauth2({idCardNo: idCardNo, frontCardImage:this.state.frontCardImage,backCardImage:this.state.backCardImage, holdCardImage:this.props.holdCardImage});
    };

    renderContent = () => {
        const frontCardImage = this.state.frontCardImage;
        return (

            <View style={styles.container}>
                <HeaderView title="实名认证"
                            backIcon={require("../../image/iv_back.png")}
                />


                {frontCardImage ?
                    <TouchableHighlight onPress={this.onTakePicture}>
                        <Image style={styles.cardImage}
                               source={{uri: frontCardImage}}/>
                    </TouchableHighlight>
                    :
                    <TouchableHighlight onPress={this.takeFrontImage}>
                        <Image style={styles.cardImage}
                               source={require('../../image/qian.png')}/>
                    </TouchableHighlight>
                }

                {this.state.backCardImage ?
                    <TouchableHighlight onPress={this.takeBackImage}>
                        <Image style={styles.cardImage}
                               source={{uri: this.state.backCardImage}}/>
                    </TouchableHighlight>
                    :
                    <TouchableHighlight onPress={this.takeBackImage}>
                        <Image style={styles.cardImage}
                               source={require('../../image/back.png')}/>
                    </TouchableHighlight>
                }

                <Button
                    style={{ alignSelf: 'center',
                        fontSize: 18,
                        height:40,
                        width:width-80,
                        color:'#ffffff',
                        backgroundColor:'#0073ff',
                        borderColor:'#0073ff',
                        marginTop:25}}
                    styleDisabled={{ color: 'white' }}
                    containerStyle={{ padding: 10, color: '#ffffff', height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: 'aqua' }}
                    onPress={this.nextPage}
                >
                    <Text style={{color:'#ffffff'}}>
                        下一步
                    </Text>
                </Button>
            </View>
        )
    };

    render() {
        return (
            Platform.OS === 'ios' ?
                <KeyboardAvoidingView style={{flex: 1, alignItems: 'center'}} behavior="padding" enabled>
                    {this.renderContent()}
                </KeyboardAvoidingView>
                :
                this.renderContent()
        )
    }
}

RealNameAuth.defaultProps = {
    holdCardImage: '',
    backCardImage: '',
    frontCardImage: '',
};

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
});

