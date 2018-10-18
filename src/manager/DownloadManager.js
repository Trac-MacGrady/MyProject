import React, {Component} from 'react';
import {Alert, Platform, PermissionsAndroid, Modal} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'
import HttpClient from '../network/HttpClient';
import HttpCode from '../const/HttpCode';
import Host from '../conf/Config';
import Path from '../const/Path';
import CommonDataManager from "./CommonDataManager";
import Toast from '../widget/Toast';

export default class DownloadManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: '',
            granted: false,
            modalVisible: true,
        }
    }

    componentWillMount() {
        this.requestCameraPermission();
    }

    checkUpdate = () => {
        let os = Platform.OS === 'android' ? 'ANDROID' : 'IOS';
        let data = {
            'version': Host.version,
            'client': os,
        };

        HttpClient.doPost(Path.checkVersion, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    if (response.code === 0) {
                        let data = response.data;
                        dialog(data.force_update, data.download_url);
                    }
                    break;
                case HttpCode.FAIL:
                    this.setState({modalVisible: false});
                    break;
            }
        });
    };

    dialog = (forceUpdate, downloadUrl) => {
        let buttons = forceUpdate ?
            [{text: '立即更新', onPress: () => updateAPP(downloadUrl)}] :
            [
                {
                    text: '暂不更新', onPress: () => {
                        callback();
                    }
                },
                {text: '立即更新', onPress: () => updateAPP(downloadUrl)}
            ];
        if (Platform.OS === 'android') {
            Alert.alert(
                '温馨提示',
                '又推出新版本了~',
                buttons
            );
        }

    };

    async requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': '写入文件权限',
                    'message': '更新版本时需要此权限，否则无法执行更新'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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

    updateAPP = (downloadUrl) => {
        if (!this.state.granted) {
            Toast.show("没有写入文件权限，无法下载，请确认授权");
            this.setState({modalVisible: false});
            return;
        }
        if (Platform.OS === 'android') {
            // android 更新直接下载并自动安装
            let dirs = RNFetchBlob.fs.dirs;
            let splitStr = downloadUrl.split("/");
            let filename = splitStr.pop();
            const filePath = `${dirs.DownloadDir}/${filename}`;
            const android = RNFetchBlob.android;
            RNFetchBlob.config({
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
                .fetch('GET', downloadUrl)
                .progress((received: any, total: any) => {
                    // todo：貌似下载进度无法响应
                    let percent = Math.floor(received / total * 100);
                    this.setState({progress: percent});
                    console.log('下载进度：' + percent + '%');
                })
                .then((res: any) => {
                    // 下载完成之后自动切换到安装管理程序
                    android.actionViewIntent(res.path(), 'application/vnd.android.package-archive');
                    this.setState({modalVisible: false});
                })
                .catch((err: any) => {
                    console.warn('下载失败');
                    console.warn(err);
                    this.setState({modalVisible: false});
                });
        } else {
            // ios 更新，点击跳转到 APP_STORE 对应的 APP 页面
            // Linking.canOpenURL('https://itunes.apple.com/cn/app/你已上架的app对应的appid').then((supported: boolean) => {
            //     // 检测是否安装了对应的应用
            //     if (!supported) {
            //         console.warn('找不到对应的应用');
            //     } else {
            //         return Linking.openURL(LINKING.APP_STORE);
            //     }
            // }).catch((err: any) => {
            //     console.error('跳转到APP_STORE失败，失败原因：', err);
            // });
        }

    };
}

