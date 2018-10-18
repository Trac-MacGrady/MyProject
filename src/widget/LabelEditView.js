import React, {Component} from 'react';

import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ImageBackground,
    TextInput,
    FlatList,
    Button,
    TouchableHighlight,
} from 'react-native';

export default class LabelEditView extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={this.props.rootStyle}>
                <Text style={this.props.labelStyle}>
                    {this.props.label}
                </Text>
                <TextInput style={this.props.editStyle}
                           underlineColorAndroid='transparent'
                           value={this.props.value}
                           placeHolder={this.props.placeHolder}
                           onChangeText={this.props.onChange}
                />
            </View>)
    }
}
