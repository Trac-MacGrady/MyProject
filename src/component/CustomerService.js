import React, {Component} from 'react';
import {View, WebView} from "react-native";
import HeaderView from "../widget/HeaderView";

export default class CustomerService extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url:'http://free.weikefu.net/AppKeFu/weikefu/wap/chat.php?wg=customer_service&robot=false&hidenav=true',
        }
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <HeaderView title="客服"
                />
                <WebView
                    source={{uri:this.state.url}}/>
            </View>
        )
    }
}