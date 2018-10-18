import React, {Component} from 'react';
import {View, WebView} from "react-native";
import HeaderView from "../widget/HeaderView";

export default class NewPayPage extends Component {
    constructor(props) {
        super(props);
        console.log("title :" + this.props.requestUrl);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <HeaderView title={this.props.webTitle}/>
                <WebView
                    source={{uri: this.props.requestUrl}}/>
            </View>
        )
    }
}