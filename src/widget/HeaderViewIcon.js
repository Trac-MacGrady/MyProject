import React, {Component} from 'react'
import {StyleSheet, View, Text, Dimensions, TouchableOpacity, Image} from 'react-native';

const win = Dimensions.get('window');
export default class HeaderViewIcon extends Component {
    render() {
        return (
            <View style={styles.titleBarContainer}>
                <Text style={styles.title}>
                    {this.props.title}
                </Text>
                {this.props.desc && this.props.menuIcon ?
                    <TouchableOpacity onPress={this.props.onPress}>
                        <View style={styles.menuStyle}>
                            <Image style={styles.menuIconStyle}
                                   source={this.props.menuIcon}/>
                            <Text style={styles.text}>
                                {this.props.desc}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    titleBarContainer: {
        flexDirection: 'row',
        width: win.width,
        height: 50,
        backgroundColor: '#0073ff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        flex: 5,
        height: 30,
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff',
        alignSelf: 'center',
        marginLeft: 25,
    },
    menuStyle: {
        flex: 2,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        // backgroundColor: 'red',
        marginRight: 10,
    },
    menuIconStyle: {
        width: 15,
        height: 15,
    },
    text: {
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'center',
    },
});
