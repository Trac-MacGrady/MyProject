import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet, Dimensions,
    ActivityIndicator,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import LinearGradient from "react-native-linear-gradient";
import HeaderView from '../widget/HeaderView';
import CommonDataManager from '../manager/CommonDataManager';
import HttpClient from '../network/HttpClient';
import HttpCode from '../const/HttpCode';
import Path from '../const/Path';
import LoadingView from '../widget/LoadingView';
import WechatShare from '../native/WechatShare';
import { Actions } from 'react-native-router-flux';

const win = Dimensions.get('window');

export default class SharePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileUrl: '',
            promotionUrl: '',
            isLoading: false,
        }
    }

    componentWillMount() {
        this.getPromotionUrl()
    }

    // 分享给朋友
    shareWithSession = () => {
        if (this.state.promotionUrl!== '') {
            WechatShare.shareWithSession(this.state.promotionUrl);
        } else {
            console.log("文件路径为空");
        }
    };

    // 分享到朋友圈
    shareWithTimeline = () => {
        if (this.state.promotionUrl!== '') {
            WechatShare.shareWithTimeline(this.state.promotionUrl);
        } else {
            console.log("文件路径为空");
        }
    };

    shareWithWeb = () => {
        Actions.registerwebview({url: this.state.promotionUrl})
    };


    getPromotionUrl() {
        this.setState({isLoading: true});
        let data = {
            'token': CommonDataManager.getInstance().getToken(),
        };
        HttpClient.doPost(Path.promote, data, (code, response) => {
            this.setState({isLoading: false});
            console.log(response);
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    // ToastAndroid.show(JSON.stringify(response.data), ToastAndroid.SHORT);
                    if (codeStatus === 0) {
                        let result = response.data;
                        this.setState({
                            promotionUrl: result.url,
                        })
                    } else {
                    }
                    break;
                case HttpCode.ERROR:
                    break;
                default:
                    break;
            }
        });
    }

    backPress = () => {
        Actions.pop();
    };
    render() {
        return (
            <View style={styles.root}>
                <HeaderView title="分享"
                            backIcon={require("../../image/iv_back.png")}
                            // onBack={this.backPress}
                />
                <View style={styles.container}>
                    <View style={styles.qrcode}>
                    {this.state.promotionUrl ?
                        <QRCode
                            size={200}
                            // style={styles.qrcode}
                            value={this.state.promotionUrl}
                            logo={require('../../image/ic_logo.png')}
                        />
                        :
                        <LoadingView/>
                    }
                    </View>
                    <TouchableOpacity style={styles.itemContainer} onPress={this.shareWithSession}>
                        <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                        end={{x: 1, y: 0}} style={styles.btn}>

                        <View style={styles.button}>
                            <Image style={styles.icon}
                                   source={require('../../image/iv_share.png')}
                            />
                            <Text style={styles.text}>
                                分享给朋友
                            </Text>
                        </View>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={this.shareWithTimeline}>
                        <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                        end={{x: 1, y: 0}} style={styles.btn}>

                        <View style={styles.button}>
                            <Image style={styles.icon}
                                   source={require('../../image/share_with_timeline.png')}
                            />
                            <Text style={styles.text}>
                                分享到朋友圈
                            </Text>
                        </View>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={this.shareWithWeb}>
                        <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                        end={{x: 1, y: 0}} style={styles.btn}>

                            <View style={styles.button}>
                                <Image
                                    source={require('../../image/share_page.png')}
                                    style={styles.icon}/>
                                <Text style={styles.text}>
                                    页面分享
                                </Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {/*{this.isLoading && <LoadingView/>}*/}
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrcode: {
        marginBottom: 40,
    },

    button: {
        flex:1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    icon: {
        width: 15,
        height: 15,
        resizeMode: 'stretch',
        marginRight: 5,
    },
    text: {
        textAlign: 'center',
        width: win.width * 0.3,
        fontSize: 14,
        color: 'white',
        // backgroundColor: 'green'
    },
    btn: {
        width: win.width * 0.8,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        margin: 15,
    },
    itemContainer: {
        // backgroundColor: 'red',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});