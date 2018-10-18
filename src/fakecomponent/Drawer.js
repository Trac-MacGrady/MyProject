import React, {Component} from 'react'
import {Button, Text, SafeAreaView, Image, StyleSheet, View, TouchableOpacity} from 'react-native'
import Toast from '../widget/Toast';
import {Actions} from "react-native-router-flux";
export default class Drawer extends Component {

checkUpdate = () => {
    Toast.show("已经是最新版本！", Toast.SHORT);
};

goUserPage = () => {
    Actions.fakeuserpage();
};

techSupport = () => {
    Toast.show("抱歉，此功能暂未开放！", Toast.SHORT);
};

    render() {
        return (

            <SafeAreaView style={{flex: 1, backgroundColor: '#22000000'}}>
                <Image source={require('../../image/ic_nav_image_person.png')} style={styles.image} />
                <Text style={styles.user_number}>
                    18209297209
                </Text>
                <Image
                    source={require('../../image/ic_content_line.png')}
                    style={styles.lineStyle}/>
                <TouchableOpacity onPress={this.checkUpdate}>
                    <View style={styles.descStyle}>
                        <Image
                            source={require('../../image/ic_setting_update.png')}
                            style={styles.icon}/>
                        <Text style={styles.text}>
                            检测更新
                        </Text>

                        <Image
                            source={require('../../image/ic_setting_arrow.png')}
                            style={{width:15, height:15, marginLeft:60}}/>
                    </View>
                    </TouchableOpacity>

                <Image
                    source={require('../../image/ic_content_line.png')}
                    style={styles.lineStyle}/>
                <TouchableOpacity onPress={this.goUserPage}>
                    <View style={styles.descStyle}>
                        <Image
                            source={require('../../image/ic_settings_account.png')}
                            style={styles.icon}/>
                        <Text style={styles.text}>
                            个人中心
                        </Text>

                        <Image
                            source={require('../../image/ic_setting_arrow.png')}
                            style={{width:15, height:15, marginLeft:60}}/>
                    </View>
                </TouchableOpacity>
                <Image
                    source={require('../../image/ic_content_line.png')}
                    style={styles.lineStyle}/>
                <TouchableOpacity onPress={this.techSupport}>
                    <View style={styles.descStyle}>
                        <Image
                            source={require('../../image/ic_settings_email.png')}
                            style={styles.icon}/>
                        <Text style={styles.text}>
                            技术支持
                        </Text>

                        <Image
                            source={require('../../image/ic_setting_arrow.png')}
                            style={{width:15, height:15, marginLeft:60}}/>
                    </View>
                </TouchableOpacity>

                <Image
                    source={require('../../image/ic_content_line.png')}
                    style={styles.lineStyle}/>
               
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    image: {
        width:70,
        height:70,
        alignItems:'center',
        justifyContent:'center',
        alignSelf: 'center',
        marginTop:30
    },

    user_number: {
        alignItems:'center',
        justifyContent:'center',
        alignSelf: 'center',
        marginTop:15,
        marginBottom:15
    },

    descStyle: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        alignSelf: 'center',
        marginTop:15
    },

    lineStyle: {
        alignItems: 'center',
        justifyContent:'center',
        alignSelf: 'center',
        marginTop:15,
        height:1,
        width: 180
    },
    icon: {
        width: 15, height: 15, resizeMode: 'stretch'
    },
    text: {
        marginLeft: 10
    },
});
