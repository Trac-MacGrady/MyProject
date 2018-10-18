/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
    Picker,
    Button,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';

import Path from "../const/Path";
import CommonDataManager from "../manager/CommonDataManager";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import LoadingView from "../widget/LoadingView";
import HeaderView from "../widget/HeaderView";
import {Actions} from 'react-native-router-flux';
import CompleteFlatList from 'react-native-complete-flatlist';
import Toast from '../widget/Toast';

const win = Dimensions.get('window');


export default class AreaPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areaList: '',
            isLoading: false,
            selectProvince: false,
            selectCity: false,
            selectRegion: false,
            selectBank: false,
            searchKeywords: "",
            cityId: '',
        }
    }

    componentWillMount() {
        this.setState({areaList: CommonDataManager.getInstance().getCityInfo()});
    }

    onClick = (item) => {
        let key = item.name;
        if (!this.state.selectProvince) {
            this.state.selectProvince = true;
            let newArea = [];
            this.state.areaList.forEach((city) => {
                if (city.name === key) {
                    console.log(key);
                    city.area.forEach((area) => {
                        newArea.push(area);
                    });
                }
            });
            this.setState({areaList: newArea});
            console.log(this.state.areaList);
        } else if (!this.state.selectCity) {
            this.state.selectCity = true;
            let newArea = [];
            this.state.areaList.forEach((city) => {
                if (city.name === key) {
                    console.log(key);
                    city.area.forEach((area) => {
                        newArea.push(area);
                    });
                }
            });
            this.setState({areaList: newArea});
            console.log(this.state.areaList);
        } else if (!this.state.selectRegion) {
            this.state.selectRegion = true;
            this.getBankList(item);
            this.setState({cityId: item.id});
        } else if (!this.state.selectBank) {
            this.state.selectBank = true;
            console.log("支行是：" + item.subbranchName);
            Actions.pop({refresh: {subBankName: item.subbranchName, unionNo: item.unionNo, cityId: this.state.cityId}});
        }
        // this.setState({isLoading: true});
    };


    _renderItem = (item) => {
        // this.setState({isLoading: false});
        let name = item.name;
        if (this.state.selectRegion) {
            name = item.subbranchName;
        }
        return <View style={styles.itemContainer}>
            <TouchableOpacity
                style={styles.areaItem}
                onPress={() => this.onClick(item)}>
                <Text>
                    {name}
                </Text>
            </TouchableOpacity>
            <Image
                source={require('../../image/line_grey.png')}
                style={styles.separatorStyle}/>
        </View>

    };

    __keyExtractor = (item, index) => index.toString();

    getBankList = (item) => {
        let token = CommonDataManager.getInstance().getToken();
        let data = {
            "token": token,
            "bankId": this.props.bankId,
            "cityId": item.id,
        };
        let url = Path.subbranch;
        this.state.loading = true;
        HttpClient.doPost(url, data, (code, response) => {
            this.state.loading = false;
            switch (code) {
                case HttpCode.SUCCESS:
                    let codeStatus = response.code;
                    if (codeStatus === 0) {
                        let areaList = response.data;
                        this.setState({
                            areaList: areaList,
                        });
                        console.log(this.state.areaList);
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
        });
    };


    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    title="选择地区"
                />

                <View style={styles.cardContainer}>
                    {this.state.areaList ?
                        <CompleteFlatList
                            style={styles.areaContainer}
                            // searchKey={['name']}
                            data={this.state.areaList}
                            keyExtractor={this.__keyExtractor}
                            highlightColor="yellow"
                            renderItem={this._renderItem}
                            renderSeparator={null}
                        />
                        :
                        <Text>
                            加载中
                        </Text>
                    }
                </View>
                {this.state.isLoading && <LoadingView/>}
            </View>
        )
    }
}

AreaPicker.defaultProps = {
    bankId: '',
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: win.width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    payContainer: {
        width: win.width,
        height: 200,
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 0,
        backgroundColor: 'yellow',
    },

    titleBarContainer: {
        width: win.width,
        height: 50,
        backgroundColor: '#1a55d1',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    title: {
        width: 100,
        height: 30,
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff',
    },
    receiptContainer: {
        flex: 3,
        width: win.width,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'green',
        marginLeft: 30,
    },
    receiptDescBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
        // backgroundColor: '#ddd',
    },
    receiptIcon: {
        width: 20,
        height: 20,
        resizeMode: Image.resizeMode.contain
    },
    receiptDescText: {
        fontSize: 18,
        color: 'black',
    },
    orderAmountText: {
        fontSize: 18,
        color: 'red',
    },
    payDescText: {
        height: 22,
        fontSize: 18,
        color: 'black',
        alignSelf: 'flex-start',
        // backgroundColor: '#f3e',
    },
    payTypePicker: {
        flex: 1,
        width: win.width,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'blue',
        // backgroundColor: 'silver',
    },
    pickerItemStyle: {
        fontSize: 18,
        color: 'blue',
    },
    payButton: {
        flex: 1,
        width: win.width * 0.9,
        // backgroundColor: '#841584',
        justifyContent: 'center',
        borderRadius: 3,
        padding: 0,
        margin: 10,
        // alignItems: 'center',
    },
    cardContainer: {
        flex: 8,
        width: win.width,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        margin: 10,
    },
    subCreditCardContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // backgroundColor: '#114455',
        borderRadius: 5,
        margin: 5,
    },
    subCreditTitleBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 15,
        marginTop: 25,
        // backgroundColor: '#ac78d1',
    },
    creditIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    loanIcon: {
        width: 22,
        height: 22,
        resizeMode: 'center',
        alignSelf: 'center',
    },
    creditTitle: {
        flex: 1,
        fontSize: 15,
        marginLeft: 5,
        color: '#ffffff',
        alignSelf: 'center'
    },
    creditDesc: {
        // backgroundColor: '#112233',
        height: 50,
        fontSize: 13,
        alignSelf: 'center',
        textAlign: 'center',
        color: '#ffffff'
    },

    searchBar: {
        width: win.width * 0.7,
    },
    areaContainer: {
        width: win.width,
        height: win.height,
    },
    areaItem: {
        width: win.width * 0.9,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
    },
    separatorStyle: {
        width: win.width * 0.8, height: 1, marginTop: 2
    },
    itemContainer: {
        flex: 1, width: win.width, justifyContent: 'center', alignItems: 'center'
    }

});
