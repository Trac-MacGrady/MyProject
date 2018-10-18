import React, {Component} from 'react';
import CommonDataManager from "../manager/CommonDataManager";
import Path from "../const/Path";
import HttpClient from "../network/HttpClient";
import HttpCode from "../const/HttpCode";
import TimeUtil from "../util/TimeUtil";
import {StyleSheet, View} from "react-native";
import ConsumeRecordView from "../widget/ConsumeRecordView";
import HeaderView from "../widget/HeaderView";
import Toast from '../widget/Toast';
import ArrayUtil from "../util/ArrayUtil";
import RefreshListView, {RefreshState} from "../widget/RefreshListView";

const status_map = {
    'NEW': '新订单',
    'SUCCESS': '成功',
    'WAITING': '处理中',
}

let pageItem = 15;//每次加载的item的个数，15

export default class ConsumeRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            consumeRecord: '',
            //列表刷新状态：1、Idle（普通状态）2、HeaderRefreshing（头部菊花转圈圈中）3、FooterRefreshing（底部菊花转圈圈中）
            //4、NoMoreData（已加载全部数据）
            //5、Failure（加载失败）
            refreshState: RefreshState.Idle,
            itemNo:0,
        }
    }

    componentDidMount() {
        //获取消费记录
        this.getRecordList()
    }

    getRecordList = () => {
        let token = CommonDataManager.getInstance().getToken();
        let data = {
            'token': token,
            'start': 'ignore',
            'end': 'ignore',
            'type': 'ignore',
            'status': 'ignore',
            'first': this.state.itemNo.toString(),
            'limit': pageItem.toString()
        };
        let url = Path.consumeList;
        HttpClient.doPost(url, data, this.recordResponse)
    };

    recordResponse = (code, response) => {
        switch (code) {
            case HttpCode.SUCCESS:
                let codeStatus = response.code;
                if (codeStatus === 0) {
                    let state = RefreshState.Idle
                    let count = ArrayUtil.getLength(response.data)
                    if (count < 1) {
                        state = RefreshState.EmptyData
                    } else if (count >= 1 && count < pageItem) {
                        state = RefreshState.NoMoreData
                    }

                    if (count >=1) {
                        this.setState({
                            consumeRecord: response.data,
                        })
                    }
                    this.setState({
                        refreshState: state,
                    })
                } else {
                    Toast.show(response.msg, Toast.SHORT);
                    this.setState({refreshState: RefreshState.Failure})
                }
                break;
            case HttpCode.ERROR:
                Toast.show("网络问题，请重试", Toast.SHORT);
                console.log("http请求失败");
                this.setState({refreshState: RefreshState.Failure})
                break;
            default:
                break;
        }
    };

    __keyExtractor = (item, index) => index.toString();

    _renderItem = ({item}) => {
        let status = '';
        switch (item.key.status) {
            case 'NEW':
                status = '新订单';
                break;
            case 'SUCCESS':
                status = '成功';
                break;
            case 'FAILED':
                status = '失败';
                break;
            default:
                status = '处理中';
                break;
        }
        return <ConsumeRecordView
            amount={item.key.amount}
            status={status}
            bankNo={item.key.cardNo}
            consumeTime={item.key.consumeTime}
        />
    };

    //上拉加载
    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.state.itemNo = this.state.itemNo + pageItem
        this.getRecordList()
    }

    //下拉刷新
    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        //获取数据
        this.state.itemNo = 0
        this.getRecordList()
    }

    render() {
        let consumeRecordList = Array.from(this.state.consumeRecord).sort((a, b) => a.created < b.created);
        let data = [];
        consumeRecordList.map(function (consumeItem) {
            let consumeTime = TimeUtil.formatTime(consumeItem.created);
            let card = consumeItem.card;
            let dataItem = {
                'amount': consumeItem.amount,
                'status': consumeItem.status,
                'consumeTime': consumeTime,
                "cardNo": card.cardNo,
            };
            data.push({key: dataItem})
        });


        return (
            <View style={styles.root}>
                <HeaderView title="消费记录"
                />
                <RefreshListView
                    data={data}
                    keyExtractor={this.__keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        // padding: 15,
        margin: 15,
        marginBottom: 60,
    },
    loading: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
});

