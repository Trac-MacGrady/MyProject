import {Platform} from 'react-native';

export default class DeviceUtil {

    static getPlatform(){
        if (Platform.OS === 'android'){
            return 'ANDROID'
        }else {
            return 'IOS'
        }
    }
}