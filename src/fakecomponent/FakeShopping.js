import React, {Component} from 'react';
import {
    Dimensions, Image,
    StatusBar,
    StyleSheet, Text,
    View,
} from "react-native";


import HeaderView from "../widget/HeaderView";
import Button from 'apsl-react-native-button'
import {Actions} from 'react-native-router-flux';
import StorageUtil from "../util/StorageUtil";
import BackInfo from "../const/BackInfo";
import Toast from "../widget/Toast";
import FakeHeaderView from "./FakeHeaderView";
const { width, height } = Dimensions.get('window');

export default class FakeShopping extends Component {

    openLeftDrawer = () => {
        Actions.drawerOpen();
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent={false}/>
                <FakeHeaderView
                    title="商城"
                    onBack={this.openLeftDrawer}
                    backIcon={require('../../image/ic_home_nearby.png')}
                />

                <Image source={require('../../image/ic_mirror_dten_empty.png')} style={styles.empty_image}/>
                <Text style={styles.content}>
                    敬请期待
                </Text>
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
        flexDirection: 'column',
    },

    content: {
        fontSize: 30,
        // textAlign: 'center'
        justifyContent:'center',
        alignSelf: 'center',
    },

    empty_image: {
        width: width-100,
        height:300,
        marginBottom:50,
        marginTop:30,
        alignItems:'center',
        justifyContent:'center',
        alignSelf: 'center',
}

});