import React from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';

export default class CardView extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
            <ImageBackground style={this.props.cardContainerBackgroundStyle}
                             imageStyle={{resizeMode: Image.resizeMode.stretch}}
                             source={this.props.backgroundImage}
            >
                <View style={this.props.titleBarContainerStyle}>
                    <Image style={this.props.creditIcon}
                           source={this.props.icon}>
                    </Image>
                    <Text style={this.props.creditTitle}>
                        {this.props.title}
                    </Text>
                </View>
                <Text style={this.props.creditDesc}>
                    {this.props.desc}
                </Text>
            </ImageBackground>
            </TouchableOpacity>
        )
    }
}


