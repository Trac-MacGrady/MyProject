import React, {Component} from 'react';
import {View, WebView} from "react-native";
import CommonDataManager from "../manager/CommonDataManager";
import HeaderView from "../widget/HeaderView";
import { Actions } from 'react-native-router-flux';

export default class GrowUp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            promotionUrl:CommonDataManager.getInstance().getGrowUpUrl(),
        }
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <HeaderView title="成长体系"
                />
                <WebView
                    source={{uri:this.state.promotionUrl}}/>
            </View>
        )
    }
}