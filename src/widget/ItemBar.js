import React, {Component} from 'react';
import {
    // CheckBox,
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

import CheckBox from 'react-native-check-box'

const win = Dimensions.get('window');
export default class itemBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.itemContainer}>
                    <View style={styles.descContainer}>
                        <Image
                            style={styles.icon}
                            source={{uri: this.props.icon}}
                        />
                        <Text style={styles.text}>
                            {this.props.text}
                        </Text>
                    </View>
                    <CheckBox
                        style={styles.checkbox}
                        onClick={this.props.onCheck}
                        isChecked={this.props.checked}
                        checkedImage={<Image source={require('../../image/ic_check_box.png')}/>}
                        unCheckedImage={<Image source={require('../../image/ic_check_box_outline_blank.png')}/>}
                    />
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainer: {
        width: win.width * 0.9,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
     descContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 5,
        width: 17,
        height: 17,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 15,
        color: '#000000',
    },

    checkbox: {
        width: 25,
        marginRight: 5,
    },
    separatorStyle: {
        width: win.width * 0.9, height: 1, marginTop: 2, marginBottom: 5
    },
    checked: {

    },
    unchecked: {

    }


});
