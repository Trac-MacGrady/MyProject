import React, {Component} from 'react';
import {Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import Path from "../const/Path";
import CommonDataManager from "../manager/CommonDataManager";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import HeaderView from '../widget/HeaderView';
import PromotionView from "../widget/PromotionView";
import Toast from '../widget/Toast';

const win = Dimensions.get('window')


export default class PromotionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isIndirect: false,
            directList: [],
            directShowList: [],
            indirectList: [],
            indirectShowList: [],
            directTabTitleColor: 'white',
            indirectTabTitleColor: '#007bff',
            directButtonColor: require('../../image/iv_blue_back.png'),
            indirectButtonColor: require('../../image/iv_blue_back.png')
        };
    }

    componentWillMount() {
        this.getPromotion();
    }

    getPromotion = () => {
        let data = {"token": CommonDataManager.getInstance().getToken()};
        let url = Path.belonged;
        HttpClient.doPost(url, data, (code, response) => {
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {

                        //直接推广
                        this.state.directList = Array.from(response.data.direction)
                        //间接推广
                        this.state.indirectList = Array.from(response.data.indirection)

                        this.onDirectSelect()
                    } else {
                        Toast.show(response.msg, Toast.SHORT);
                    }

                    break;
                case HttpCode.ERROR:
                    Toast.show("网络问题，请重试", Toast.SHORT);
                    console.log("http请求失败");
                    break;
                default:
                    break;
            }

        })
    }

    onDirectSelect = () => {
        let data = [];
        this.state.directList.map(function (direct) {
            data.push({
                key: {
                    'name': direct.name,
                    'level': direct.level === 'FIRST'? '普通商户': "VIP商户",
                }
            });
        });
        this.setState({
            isIndirect: false,
            directTabTitleColor: 'white',
            indirectTabTitleColor: '#007bff',
            directShowList: data,
        })
    };

    onIndirectSelect = () => {
        let data = [];
        this.state.indirectList.map(function (indirect) {
            data.push({
                key: {
                    'name': indirect.name,
                    'level': indirect.level,
                }
            });
        });
        this.setState({
            isIndirect: true,
            directTabTitleColor: '#007bff',
            indirectTabTitleColor: 'white',
            indirectShowList: data,
        })
    };


    _renderItem = ({item}) => {
        let name = item.key.name;
        let level = item.key.level;

        return <PromotionView
            name={name}
            level={level}
        />
    };


    __keyExtractor = (item, index) => index.toString();


    render() {

        return (
            <View style={styles.root}>
                <HeaderView title="推广详情"
                            backIcon={require("../../image/iv_back.png")}
                />
                <ImageBackground
                    source={require('../../image/input_border.png')}
                    imageStyle={styles.inputBackgroundStyle}
                    style={styles.inputContainerStyle}
                >
                    <TouchableOpacity onPress={this.onDirectSelect}>
                        {!this.state.isIndirect ?
                            <ImageBackground
                                imageStyle={styles.inputBackgroundStyle}
                                style={styles.tabBackgroundStyle}
                                source={this.state.directButtonColor}>
                                <Text style={[{color: this.state.directTabTitleColor}, styles.input]}>
                                    直接推广
                                </Text>
                            </ImageBackground>
                            :
                            <View style={styles.tabBackgroundStyle}>
                                <Text style={[{color: this.state.directTabTitleColor}, styles.input]}>
                                    直接推广
                                </Text>
                            </View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onIndirectSelect}>
                        {this.state.isIndirect ?
                            <ImageBackground
                                source={this.state.indirectButtonColor}
                                imageStyle={styles.inputBackgroundStyle}
                                style={styles.tabBackgroundStyle}
                            >
                                <Text style={[{color: this.state.indirectTabTitleColor}, styles.input]}>
                                    间接推广
                                </Text>
                            </ImageBackground>
                            :

                            <View style={styles.tabBackgroundStyle}>
                                <Text style={[{color: this.state.indirectTabTitleColor}, styles.input]}>
                                    间接推广
                                </Text>
                            </View>
                        }
                    </TouchableOpacity>
                </ImageBackground>
                {this.state.isIndirect ?
                    <View style={styles.promotionListContainer}>
                        <FlatList
                            data={this.state.indirectShowList}
                            keyExtractor={this.__keyExtractor}
                            renderItem={this._renderItem}>
                        </FlatList>

                    </View>
                    :
                    <View style={styles.promotionListContainer}>
                        <FlatList
                            data={this.state.directShowList}
                            keyExtractor={this.__keyExtractor}
                            renderItem={this._renderItem}>
                        </FlatList>
                    </View>
                }
            </View>
        )
    };


};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center'
        // backgroundColor: '#f6f6f6',
    },
    tabContainer: {
        width: win.width * 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        // backgroundColor: '#f6f6f6',
    },
    tabStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    promotionListContainer: {
        flex: 1,
        padding: 20,
    },
    btn: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textStyle: {
        color: 'white',
        fontSize: 16
    },
    inputContainerStyle: {
        width: win.width * 0.9,
        height: 40,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    inputBackgroundStyle: {
        resizeMode: Image.resizeMode.contain,
    },
    tabBackgroundStyle: {
        flex: 1,
        width: win.width * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    input: {
        width: win.width * 0.2,
        height: 20,
        textAlign: 'center',
        // color: 'white',
        // backgroundColor: '#ee11dd',

    },
});