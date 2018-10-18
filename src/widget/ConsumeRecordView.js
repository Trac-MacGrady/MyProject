import React from 'react';
import {Dimensions, Text, View, StyleSheet, Image} from 'react-native';

const win = Dimensions.get('window');

export default class ConsumeRecordView extends React.Component {
    render() {
            {/*<ImageBackground style={styles.root}*/}
                             {/*source={require('../../image/iv_blue_back.png')}*/}
                             {/*imageStyle={{resizeMode: 'stretch'}}*/}
            {/*>*/}

        return (
            <View style={styles.root}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    // width: 30,
                    justifyContent: 'space-between'
                }}>
                    <Text style={styles.text}>
                        金额：{this.props.amount}
                    </Text>
                    <Text style={styles.text}>
                        状态：{this.props.status}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    // width: 30,
                    justifyContent: 'center'
                }}>
                     <Text style={styles.text}>
                        时间：{this.props.consumeTime}
                    </Text>
                    <Text style={styles.text}>
                        支付卡号：{this.props.bankNo}
                    </Text>

                </View>

                <Image
                    source={require('../../image/line_grey.png')}
                    style={styles.separatorStyle}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        width: win.width * 0.9,
        height: 80,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        margin: 3,
        borderRadius:2,
        // justifyContent: 'center',
        // alignItems: 'center'

        // backgroundColor: 'grey',
   },
    text: {
        // color: '#009aff',
        color: 'black',
        fontSize: 14,
    },
    separatorStyle: {
        width: win.width, height: 1, marginTop: 2
    },
});
