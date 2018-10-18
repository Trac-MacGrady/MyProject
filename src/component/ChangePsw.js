import React, {Component} from 'react';
import {Text, TextInput, TouchableOpacity, View,StyleSheet,Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import LinearGradient from "react-native-linear-gradient";
import CommonDataManager from "../manager/CommonDataManager";
import Path from "../const/Path";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import Toast from '../widget/Toast';
import StorageUtil from "../util/StorageUtil";
import DataKeys from "../const/DataKeys";
import HeaderView from "../widget/HeaderView";

const win = Dimensions.get('window');
export default class ChangePsw extends Component{
    constructor(props) {
        super(props);
        this.state = {
            oldPsw: '',
            newPsw: '',
        }
    }

    changePsw = () =>{
        let token = CommonDataManager.getInstance().getToken();
        let data = {
            'token': token,
            "password": this.state.oldPsw,
            "newPassword": this.state.newPsw,
        };
        let url = Path.change_psw;
        HttpClient.doPost(url,data,(code,response)=>{
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        let user = response.data;
                        Toast.show("修改密码成功", Toast.SHORT);
                        CommonDataManager.getInstance().setUser(user)
                        //保存密码
                        StorageUtil.set(DataKeys.userInfo, user)
                        Actions.pop();
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
            <View style={{flex: 1}}>
                <HeaderView title="修改密码"
                />
            <View style={{backgroundColor: '#f6f6f6', padding: 20, flex: 1}}>
                <TextInput style={styles.textInput}
                           placeholder="旧密码"
                           underlineColorAndroid='transparent'
                           onChangeText={(oldPassword) => this.setState({oldPsw: oldPassword})}
                />
                <View style={styles.backLine}/>

                <TextInput style={styles.textInput}
                           placeholder="新密码"
                           underlineColorAndroid='transparent'
                           onChangeText={(newPassword) => this.setState({newPsw: newPassword})}
                />
                <View style={styles.backLine}/>
                <TouchableOpacity activeOpacity={0.6} style={{marginTop: 30, width: win.width - 40, height: 40}}
                                  onPress={this.changePsw.bind(this)}>
                    <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}} style={styles.btn}>
                        <Text style={{color: 'white', fontSize: 16}}>修改密码</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {

        height: 40,
        width: win.width - 40,
        //内边距
        paddingLeft: 10,
        paddingRight: 10,
    },
    backLine: {
        width: win.width - 50,
        height: 1,
        backgroundColor: '#cccccc',
        marginLeft: 5,
        marginRight: 5,
    }
})