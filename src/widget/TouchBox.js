import React ,{ Component } from 'react'
import {TouchableOpacity} from 'react-native'
import * as _ from 'lodash'
const debounceMillisecond = 3000;

export default class TouchBox extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.debouncePress(this.props.onPress)}>
                {this.props.children}
            </TouchableOpacity>
        )
    }
    debouncePress = onPress => {
        return _.throttle(onPress, debounceMillisecond, {leading: true, trailing: false})
    }
}
