import React, { Component } from 'react';

import {
    View,
    WebView,
    StyleSheet, Dimensions
} from 'react-native';

import HeaderView from "../widget/HeaderView";
import CommonDataManager from '../manager/CommonDataManager';

const win = Dimensions.get('window');
export default class RatePage extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <HeaderView title="帮助"
                            backIcon={require("../../image/iv_back.png")}
                />
            <WebView style={styles.webView} source={{uri: CommonDataManager.getInstance().getHelpUrl()}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    webview: {
        width: win.width,
        height: win.height
    },
});