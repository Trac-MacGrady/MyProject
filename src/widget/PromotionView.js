import React from 'react';
import {Dimensions, Text, View, StyleSheet} from 'react-native';

const win = Dimensions.get('window');

export default class PromotionView extends React.Component {
    render() {
        return (
            <View style={styles.root}
            >

                <Text style={styles.text}>
                    {this.props.name}
                </Text>
                <Text style={styles.text}>
                    {this.props.level}
                </Text>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        padding: 10,
        width: win.width* 0.9,
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#f6f6f6',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 14, color: 'black'
    }
});


