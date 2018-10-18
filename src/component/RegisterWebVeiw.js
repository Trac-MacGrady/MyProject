import React, {Component} from 'react';
import {View, WebView} from "react-native";
import CommonDataManager from "../manager/CommonDataManager";
import HeaderView from "../widget/HeaderView";

export default class RegisterWebVeiw extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <HeaderView title="注册"/>
            <View style={{backgroundColor: '#f6f6f6', flex: 1}}>
                <WebView
                    source={{uri:this.props.url}}
                    style={{width:'100%',height:'100%'}}/>
            </View>
            </View>
        )
    }
}