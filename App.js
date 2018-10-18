import React, {Component} from 'react';
import {StyleSheet} from 'react-native'
import {ActionConst, Router, Scene, Tabs, Drawer} from 'react-native-router-flux';


import Home from './src/component/Home';
import Receipt from "./src/component/Receipt";
import Login from "./src/component/Login";
import UserPage from "./src/component/UserPage";
import ConsumeRecord from "./src/component/ConsumeRecord";
import BindCard from "./src/component/BindCard";
import Consume from "./src/component/Consume";
import ChangeCard from "./src/component/ChangeCard";
import ChangePsw from "./src/component/ChangePsw";
import PromotionDetail from "./src/component/PromotionDetail";
import GrowUp from "./src/component/GrowUp";
import ForgetPassword from "./src/component/ForgetPassword";
import Splash from "./src/component/Splash";
import TabIcon from "./src/widget/TabIcon";
import RealNameAuth from "./src/component/RealNameAuth";
import RealNameAuth2 from "./src/component/RealNameAuth2";
import MerchantRegister from "./src/component/MerchantRegister";
import AreaPicker from "./src/component/AreaPicker";
import BankPicker from "./src/component/BankPicker";
import TakeMoney from "./src/component/TakeMoney";
import CardManagerPage from "./src/component/CardManagerPage";
import CommonDataManager from "./src/manager/CommonDataManager";
import RatePage from './src/component/RatePage';
import SharePage from './src/component/SharePage';
import RegisterWebView from './src/component/RegisterWebVeiw';
import PayPage from './src/component/PayPage';
import ShoppingPage from './src/component/ShoppingPage';
import CameraPage from './src/component/CameraPage';
import CustomerService from './src/component/CustomerService';
import HelpPage from './src/component/HelpPage';
import NewPayPage from './src/component/NewPayPage';
import DownloadManager from './src/manager/DownloadManager';

import FakeHome from './src/fakecomponent/FakeHome';
import FakeBindCard from "./src/fakecomponent/FakeBindCard";
import FakeCreditCardPage from "./src/fakecomponent/FakeCreditCardPage";
import FakeIdCardInfo from "./src/fakecomponent/FakeIdCardInfo";
import FakeModifyCreditInfo from "./src/fakecomponent/FakeModifyCreditInfo";
import FakeRealnameInfo from "./src/fakecomponent/FakeRealnameInfo";
import FakeUserPage from "./src/fakecomponent/FakeUserPage";
import DrawerComp from "./src/fakecomponent/Drawer";
import FakeShopping from "./src/fakecomponent/FakeShopping";

class App extends Component {
    componentDidMount() {
        CommonDataManager.getInstance().init();
    }

    render() {

        return (
            <Router>
                <Scene  key={'root'}>
                    <Scene key="camera" component={CameraPage} hideNavBar={true}/>
                    <Scene key="splash" component={Splash} hideNavBar={true}
                           initial={true}
                    />
                    <Scene key="custompaypage" component={NewPayPage} hideNavBar={true}/>
                    <Scene key="forget" component={ForgetPassword} hideNavBar={true}/>
                    <Scene key="login" component={Login} hideNavBar={true}
                    />
                    <Scene key="consumeRecord" component={ConsumeRecord} hideNavBar={true}/>
                    <Scene key="help" component={ HelpPage } hideNavBar={true}/>
                    <Scene key="download" component={ DownloadManager } hideNavBar={true}/>
                    <Scene key="customerService" component={ CustomerService } hideNavBar={true}/>
                    <Scene key="bindCard" component={BindCard} hideNavBar={true}/>
                    <Scene key="consume" component={Consume} hideNavBar={true}/>
                    <Scene key="changeCard" component={ChangeCard} hideNavBar={true}/>
                    <Scene key="changePsw" component={ChangePsw} hideNavBar={true}/>
                    <Scene key="promotionDetail" component={PromotionDetail} hideNavBar={true}/>
                    <Scene key="growUp" component={GrowUp} hideNavBar={true}/>
                    <Scene key="areapicker" component={AreaPicker} hideNavBar={true}/>
                    <Scene key="bankpicker" component={BankPicker} hideNavBar={true}/>
                    <Scene key="receipt" component={Receipt} hideNavBar={true}/>
                    <Scene key="realnameauth" component={RealNameAuth} hideNavBar={true} title="绑身份证"/>
                    <Scene key="realnameauth2" component={RealNameAuth2} hideNavBar={true} title="绑身份证"/>
                    <Scene key="merchantregister" component={MerchantRegister} hideNavBar={true} title="实名认证"/>
                    <Scene key="takemoney" component={TakeMoney} hideNavBar={true}/>
                    <Scene key="cardmanager" component={CardManagerPage} hideNavBar={true}/>
                    <Scene key="ratepage" component={RatePage} hideNavBar={true}/>
                    <Scene key="share" component={SharePage} hideNavBar={true}/>
                    <Scene key="registerwebview" component={RegisterWebView} hideNavBar={true}/>
                    <Scene key="fakebindcard" component={FakeBindCard} hideNavBar={true}/>
                    <Scene key="fakecardidinfo" component={FakeIdCardInfo} hideNavBar={true}/>
                    <Scene key="fakemodify" component={FakeModifyCreditInfo} hideNavBar={true}/>
                    <Scene key="fakerealname" component={FakeRealnameInfo} hideNavBar={true}/>
                    <Scene key="fakeuserpage" component={FakeUserPage} hideNavBar={true}/>
                    <Drawer key={'Drawer'} hideNavBar={true} contentComponent={DrawerComp} drawerWidth={250} drawerPosition={'left'}>
                        <Tabs key="faketabbar" swipeEnabled tabBarPosition="bottom" showLabel={false}
                              tabBarStyle={styles.tabBarStyle}
                        >
                            <Scene key="fakehome" component={FakeHome} hideNavBar={true} title="首页"
                                   icon={TabIcon}
                                   iconDefaultImage={require('./image/iv_receipt_default.png')}
                                   iconSelectImage={require('./image/iv_receipt_select.png')}
                                   type={ActionConst.RESET}
                                   panHandlers={null}
                            />

                            <Scene key="fakeshopping" component={FakeShopping} hideNavBar={true} title="商城"
                                   iconDefaultImage={require('./image/iv_mall_default.png')}
                                   iconSelectImage={require('./image/iv_mall_select.png')}
                                   icon={TabIcon}
                            />

                            <Scene key="fakecredit" component={FakeCreditCardPage} hideNavBar={true} title="信用卡"
                                   iconDefaultImage={require('./image/iv_user_default.png')}
                                   iconSelectImage={require('./image/iv_user_select.png')}
                                   icon={TabIcon}
                            />

                        </Tabs>
                    </Drawer>
                    <Tabs key="tabbar" swipeEnabled tabBarPosition="bottom" showLabel={false}
                          tabBarStyle={styles.tabBarStyle}
                    >
                        <Scene key="home" component={Home} hideNavBar={true} title="收款"
                               icon={TabIcon}
                               iconDefaultImage={require('./image/iv_receipt_default.png')}
                               iconSelectImage={require('./image/iv_receipt_select.png')}
                               type={ActionConst.RESET}
                               panHandlers={null}
                        />
                        <Scene key="pay" component={ PayPage } hideNavBar={true} title="支付"
                               iconDefaultImage={require('./image/iv_pay_default.png')}
                               iconSelectImage={require('./image/iv_pay_select.png')}
                               icon={TabIcon}/>
                        <Scene key="shopping" component={ShoppingPage} hideNavBar={true} title="商城"
                               iconDefaultImage={require('./image/iv_mall_default.png')}
                               iconSelectImage={require('./image/iv_mall_select.png')}
                               icon={TabIcon}
                        />
                        <Scene key="user" component={UserPage} hideNavBar={true} title="用户"
                               iconDefaultImage={require('./image/iv_user_default.png')}                                      
                               iconSelectImage={require('./image/iv_user_select.png')}
                               icon={TabIcon}
                        />

                    </Tabs>


                </Scene>
            </Router>
        );
    }
}


export default App;

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabStyle: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center'
    }
})

