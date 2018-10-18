import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View,
    PermissionsAndroid, Platform, Alert, Modal} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import {Actions, } from "react-native-router-flux";
import StorageUtil from '../util/StorageUtil'
import CommonDataManager from "../manager/CommonDataManager";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import Path from "../const/Path";
import DataKeys from "../const/DataKeys";
import LoadingView from "../widget/LoadingView";
import Toast from '../widget/Toast';
import CheckUtil from "../util/CheckUtil";
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'react-native-fetch-blob';
import codePush from 'react-native-code-push'
import ImageResizer from "../native/ImageResizer";
import XGPush from "../native/XGPush";
import BackInfo from "../const/BackInfo";


const win = Dimensions.get('window');


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            loginaccout:'',
            isLoading: false,
            granted: false,
            percent: 0,
            modalVisible: false,
            forceUpdate: false,
            cancelUpdate: false,
            deviceToken:''
        }
    }

    componentWillMount(){
        this.requestPermission();
    }

    componentDidMount(){
        this.checkUpdate();
        Login.checkByCodepush();
        // 获取推送XG token
        this.getDeviceToken();

        StorageUtil.get(BackInfo.USER_LOGIN).then((loginaccout) => {
            this.setState({loginaccout:loginaccout});
            console.log("loginaccout:" + this.state.loginaccout);
            if (this.state.loginaccout !== null) {
                Actions.replace('fakehome');
            }
        });

    }

    static checkByCodepush() {
        if(Platform.OS === 'android') {
            console.log("android");
            codePush.checkForUpdate()
                .then( (update) =>{
                    if( !update ){
                        console.log("app是最新版了");
                    }else {
                        console.log("有更新哦");
                        codePush.sync({
                            // updateDialog: {
                            //     appendReleaseDescription: true,
                            //     title:'版本更新',
                            //     // 非强制更新
                            //     optionalIgnoreButtonLabel:"取消",
                            //     optionalInstallButtonLabel:"安装",
                            //     optionalUpdateMessage:"有新版本，是否安装？",
                            //     // 强制更新
                            //     // mandatoryContinueButtonLabel:"更新",
                            //     // mandatoryUpdateMessage:"有新版本，需要安装!",
                            //
                            // },
                            InstallMode:codePush.InstallMode.ON_NEXT_RESUME,
                            // deploymentKey:"OGlTV2WbHwRx-tG8tR-BL7-6UDwQ02509156-6c58-4470-8fee-cac07564fb03",
                            deploymentKey:"tEoAwzTSwzTdXgKkBmU1yVDCXd1n02509156-6c58-4470-8fee-cac07564fb03",
                        });
                    }
                });
        } else {
            console.log("有更新哦");
            codePush.sync({
                // updateDialog: {
                //     appendReleaseDescription: true,
                //     title:'版本更新',
                //     // 非强制更新
                //     optionalIgnoreButtonLabel:"取消",
                //     optionalInstallButtonLabel:"安装",
                //     optionalUpdateMessage:"有新版本，是否安装？",
                //     // 强制更新
                //     // mandatoryContinueButtonLabel:"更新",
                //     // mandatoryUpdateMessage:"有新版本，需要安装!",
                //
                // },
                InstallMode:codePush.InstallMode.ON_NEXT_RESUME,
                deploymentKey:"GfYUHbOQHf4xilEt4JCKfmjUuAcH02509156-6c58-4470-8fee-cac07564fb03",
            });
        }


    }

    async requestPermission() {
        try {
            const permissionGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': '写入文件权限',
                    'message': '更新版本时需要此权限，否则无法执行更新'
                }
            );
            if (permissionGranted === PermissionsAndroid.RESULTS.GRANTED
            || permissionGranted === true) {
                this.setState({granted: true});
                console.log("permission granted")
            } else {
                this.setState({granted: false});
                console.log("permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    autoLogin = () => {
        //检测本地是否有登录信息
        StorageUtil.get(DataKeys.userInfo)
            .then((userInfo) => {
                if (userInfo === null) {
                } else {
                    let data = {
                        'token': userInfo.token,
                    };
                    let url = Path.userInfo;
                    HttpClient.doPost(url, data, (code, response) => {
                        console.log(response);
                        switch (code) {
                            case HttpCode.SUCCESS:
                                let codeStatus = response.code;
                                if (codeStatus === 0) {
                                    this.saveUser(response.data);
                                    this.goHome();
                                } else {
                                    this.clearUserInfo();
                                }
                                break;
                            case HttpCode.FAIL:
                                this.clearUserInfo();
                                break;
                            case HttpCode.ERROR:
                                this.clearUserInfo();
                                break;
                            default:
                                break;
                        }
                    })
                }
            });
    }

    clearUserInfo = () => {
        CommonDataManager.getInstance().setUser(null);
        StorageUtil.set(DataKeys.userInfo, null);
    };

    getDeviceToken = async () => {
         let cardImage = await XGPush.getDeviceToken();
         console.log("token:" + cardImage.device_token);
         this.setState({deviceToken:cardImage.device_token});
    };


    login = () => {
        if(!CheckUtil.checkPhone(this.state.account)){
            Toast.show('请输入正确的手机号',Toast.SHORT);
            return;
        }
        if(CheckUtil.isStrEmpty(this.state.password)){
            Toast.show('请输入密码',Toast.SHORT);
            return;
        }

        // 判断是否为假数据账号
        if(this.state.account === '18209297209' && this.state.password === 'password') {
            StorageUtil.set(BackInfo.USER_LOGIN, this.state.account);
            CommonDataManager.getInstance().setLogin('true');
            Actions.replace('fakehome');
            return
        }


        this.setState({isLoading: true});
        let data = {"username": this.state.account, "password": this.state.password, "deviceToken":this.state.deviceToken};
        console.log("deviceToken: " + this.state.deviceToken);

        let path = Path.login;
        HttpClient.doPost(path, data, (code, response) => {
            this.setState({isLoading: false});
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        let user = response.data;
                        Toast.show("登录成功", Toast.SHORT);
                        // console.log("login successful");
                        this.saveUser(user);
                        this.goHome();
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

    saveUser(user) {
        CommonDataManager.getInstance().setUser(user);
        StorageUtil.set(DataKeys.userInfo, user);
    }

    goHome = () => {
        Actions.replace('home');
    };

    switchToForgetPassword = () => {
        Actions.forget();
    };

    checkUpdate = () => {
        let version = CommonDataManager.getInstance().getVersion();
        let os = Platform.OS === 'android' ? 'ANDROID' : 'IOS';
        let data = {
            'version': version,
            'client': os,
        };

        HttpClient.doPost(Path.checkVersion, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    if (response.code === 0) {
                        let data = response.data;
                        if (version < data.version) {
                            console.log("需要升级，最新版本为：" + data.version);
                            this.setState({forceUpdate: data.force_update});
                            this.dialog(data.version, data.download_url);
                        } else {
                            this.autoLogin();
                            console.log("本地version: " + version + "; 线上版本: " + data.version);
                        }
                    }
                    break;
                case HttpCode.FAIL:
                    console.log("检查版本更新异常");
                    this.autoLogin();
                    break;
            }
        });
    };

    dialog = (version, downloadUrl) => {
        let buttons = this.state.forceUpdate?
            [{text: '立即更新', onPress: () => this.updateAPP(version, downloadUrl)}] :
            [
                {
                    text: '暂不更新', onPress: () => {
                    }
                },
                {text: '立即更新', onPress: () => this.updateAPP(version, downloadUrl)}
            ];
        if (Platform.OS === 'android') {
            Alert.alert(
                '温馨提示',
                '又推出新版本了~',
                buttons,
            { cancelable: false }
            );
        }

    };

     updateAPP = (version, downloadUrl) => {
        if (!this.state.granted) {
            Toast.show("没有写入文件权限，无法下载，请确认授权", Toast.SHORT);
            return;
        }
        this.setState({ modalVisible: true});
        if (Platform.OS === 'android') {
            // android 更新直接下载并自动安装
            let dirs = RNFetchBlob.fs.dirs;
            let splitStr = downloadUrl.split("/");
            let filename = splitStr.pop();
            const filePath = `${dirs.DownloadDir}/${filename}`;
            const android = RNFetchBlob.android;
            this.task = RNFetchBlob.config({
                path: filePath,
                // addAndroidDownloads: {
                //     // 调起原生下载管理
                //     useDownloadManager: true,
                //     // 你想要设置的下载的安装包保存的名字
                //     title: filename,
                //     // 下载时候顶部通知栏的描述
                //     description: '下载完成之后将会自动安装',
                //     // 下载的文件格式
                //     mime: 'application/vnd.android.package-archive',
                //     // 下载完成之后扫描下载的文件
                //     mediaScannable: true,
                //     // 通知栏显示下载情况
                //     notification: true,
                //     // 文件下载的同时缓存起来，提高操作效率
                //     fileCache: true,
                //     path: filePath,
                // }
            })
                .fetch('GET', downloadUrl);

                this.task.progress((received: any, total: any) => {
                    // todo：貌似下载进度无法响应
                    let percent = received / total;
                    this.setState({percent: percent});
                    console.log('下载进度：' + Math.floor(percent * 100) + '%');
                })
                .then((res: any) => {
                    // 下载完成之后自动切换到安装管理程序，并关闭升级进度条弹窗
                    // 如果取消升级，则不进行安装
                    this.setState({modalVisible: false});
                    if (!this.state.cancelUpdate){
                        android.actionViewIntent(res.path(), 'application/vnd.android.package-archive');
                    }
                })
                .catch((err: any) => {
                    console.warn('下载失败');
                    console.warn(err);
                    this.setState({modalVisible: false});
                    Toast.show("下载失败", Toast.SHORT);
                });

        }
    };

     onCloseDialog = () => {
         // 如果是强制更新，则返回键不能关闭更新进度框
         if (this.state.forceUpdate){
             return;
         }
         if (this.task !== undefined && this.task !== null){
             this.task.cancel((err, taskId) => {
                 console.log("下载任务： " + taskId + ' 取消');
             });
         }
         this.setState({modalVisible: false, cancelUpdate: true})
     };

    render() {

        return (
            <View style={styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={this.onCloseDialog}
                >
                    <View style={styles.dialog}>
                        <View style={styles.progress}>
                            <Progress.Circle progress={this.state.percent} size={80}
                            showsText={true}/>
                        </View>
                    </View>
                </Modal>

                <LinearGradient colors={['#00e9ff', '#00a9ff', '#005eff']}
                                style={styles.backgroundGradient}>
                    <Image
                        source={require('../../image/ic_logo.png')}
                        style={styles.imgStyle}/>
                </LinearGradient>

                <View style={styles.loginBack}>
                    <ImageBackground
                        source={require('../../image/login_back.png')}
                        resizeMode='stretch'
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20,
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                source={require('../../image/iv_username.png')}
                                style={{width: 20, height: 20, marginLeft: 25, resizeMode: 'stretch'}}/>
                            <TextInput style={styles.textInput}
                                       placeholder="请输入手机号"
                                       keyboardType="phone-pad"
                                       maxLength={11}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(account) => this.setState({account:account})}
                            />
                        </View>
                        <View style={{width: 240, height: 1, backgroundColor: '#cccccc'}}/>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <Image
                                source={require('../../image/iv_password.png')}
                                style={{width: 22, height: 22, marginLeft: 25, resizeMode: 'stretch'}}/>
                            <TextInput style={styles.textInput}
                                       placeholder="请输入密码"
                                       secureTextEntry={true}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(password) => this.setState({password:password})}
                            />
                        </View>
                        <View style={{width: 240, height: 1, backgroundColor: '#cccccc'}}/>
                        <TouchableOpacity activeOpacity={0.6} style={{marginTop: 30,}}
                                          onPress={this.login}>
                            <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}} style={styles.btn}>
                                <Text style={styles.textStyle}>登录</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ImageBackground>
                    <Text onPress={() => {

                        this.switchToForgetPassword()

                    }} style={styles.textForgetPsw}>
                        忘记密码
                    </Text>
                </View>

                {this.state.isLoading && <LoadingView/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f6f6f6',
    },
    backgroundGradient: {
        alignItems: 'center',
        width: win.width,
        height: win.height / 2,
    },
    imgStyle: {
        width: 70,
        height: 70,
        marginTop: 100,
    },
    loginBack: {
        alignSelf: 'center',
        width: win.width * 0.8,
        height: 250,
        marginTop: -100,
    },
    textInput: {

        height: 40,
        width: 200,
        //内边距
        paddingLeft: 10,
        paddingRight: 10,
        //外边距
        marginLeft: 10,
        marginRight: 20,
        //设置相对父控件居中
    },
    btn: {
        flexDirection: 'row',
        width: 130,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textStyle: {
        color: 'white',
        fontSize: 16
    },
    textForgetPsw: {
        color: '#b7b5b5',
        fontSize: 15,
        alignSelf: 'flex-end',
        marginTop: 8,
        marginRight: 14,
    },
    dialog: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    progress: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20

    },
});