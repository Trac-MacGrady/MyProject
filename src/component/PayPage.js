import React, {Component} from 'react'

import {StyleSheet, View, Text} from 'react-native';
import HeaderView from '../widget/HeaderView';

export default class PayPage extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={styles.root}>
                <HeaderView title="支付"
                            back={false}
                />
                <View style={styles.container}>
                <Text style={styles.content}>
                    敬请期待
                </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        fontSize: 30,
        textAlign: 'center'
    }
});