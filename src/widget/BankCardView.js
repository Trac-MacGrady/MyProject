import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

export default class BankCardView extends React.Component {
    render() {
        return (
            <View style={this.props.cardContainerBackgroundStyle}
            >
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>

                <View style={this.props.titleBarContainerStyle}>
                    <Image style={this.props.creditIcon}
                           source={{uri: this.props.icon}}>
                    </Image>
                    <Text style={this.props.creditTitle}>
                        {this.props.title}
                    </Text>
                </View>
                 {this.props.deleteIcon ?
                    <View style={this.props.deleteContainterStyle}>
                    <TouchableOpacity onPress={this.props.onDelete}>
                        <Image style={this.props.deleteIconStyle}
                               source={this.props.deleteIcon}
                        />
                    </TouchableOpacity>
                    </View>
                    :
                    <View/>
                }
                </View>

                <Text style={this.props.creditDesc}>
                    {this.props.desc}
                </Text>
            </View>
        )
    }
}


