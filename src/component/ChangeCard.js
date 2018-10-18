import React, {Component} from 'react';
import {StyleSheet,Dimensions, Text, TextInput, TouchableOpacity, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import HeaderView from "../widget/HeaderView";
import CommonDataManager from "../manager/CommonDataManager";
const win = Dimensions.get('window');

export default class BindCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardNo: '',
            accountName: '',
            accountBank: '',
            idCardNum: '',
            mobileNo: ''
        }
    }

    bindCard = () => {
        let creditCardNum = this.state.cardId
        let accountName = this.state.accountName
        let accountBank = this.state.accountBank
        let idCardNum = this.state.idCardNum
        let phoneNum = this.state.mobileNo
        let token = CommonDataManager.getInstance().getToken()

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <HeaderView title="绑定银行卡"/>
            <View style={{backgroundColor: '#f6f6f6', padding: 20,flex:1}}>
                <TextInput style={styles.textInput}
                           placeholder="银行卡卡号"
                           underlineColorAndroid='transparent'
                           onChangeText={(creditCardNum) => this.setState({cardNo: creditCardNum})}
                />
                <View style={styles.backLine}/>
                <TextInput style={styles.textInput}
                           placeholder="持卡人姓名"
                           underlineColorAndroid='transparent'
                           onChangeText={(accountName) => this.setState({accountName})}
                />
                <View style={styles.backLine}/>
                <TextInput style={styles.textInput}
                           placeholder="开户行"
                           underlineColorAndroid='transparent'
                           onChangeText={(accountBank) => this.setState({accountBank})}
                />
                <View style={styles.backLine}/>
                <TextInput style={styles.textInput}
                           placeholder="身份证号码"
                           underlineColorAndroid='transparent'
                           onChangeText={(idCardNum) => this.setState({idCardNum})}
                />
                <View style={styles.backLine}/>
                <TextInput style={styles.textInput}
                           placeholder="银行预留手机号"
                           underlineColorAndroid='transparent'
                           onChangeText={(phoneNum) => this.setState({mobileNo: phoneNum})}
                />
                <View style={styles.backLine}/>
                <TouchableOpacity activeOpacity={0.6} style={{marginTop: 30,width:win.width-40,height:40}}
                                  onPress={this.bindCard.bind(this)}>
                    <LinearGradient colors={['#00bbff', '#009aff', '#0073ff']} start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}} style={styles.btn}>
                        <Text style={{color:'white',fontSize:16}}>完成</Text>
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
        width: win.width-40,
        //内边距
        paddingLeft: 10,
        paddingRight: 10,
    },
    backLine:{
        width: win.width-50,
        height: 1,
        backgroundColor: '#cccccc',
        marginLeft:5,
        marginRight:5,
    }
})