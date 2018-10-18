import React, {Component} from 'react'

import {StyleSheet, View, Text} from 'react-native';

class TabView extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.content}>
                    敬请期待
                </Text>
            </View>
        )
    }
}

export default TabView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        fontSize: 30,
        textAlign: 'center'
    }
})