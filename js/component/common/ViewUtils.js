'use strict'

import React  from 'react';
import {
    TouchableHighlight,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from 'react-native';
export default class ViewUtils {
    static getItemView(onPress, titleIcon, text, tintColor, expandableIcon) {
        return (
            <TouchableHighlight onPress={onPress}>
                <View style={styles.list_container}>
                    <View style={{flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{width: 22, height: 22, marginLeft: 10, marginRight: 10, tintColor: 'red'}} source={titleIcon}/>
                        <Text>{text}</Text>
                    </View>
                    <View>
                        <Image  style={{width: 22, height: 22, marginRight: 10, tintColor: 'red'}}
                                source={expandableIcon ? expandableIcon: require('../../../res/images/ic_tiaozhuan.png')} />
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    static leftBackButton(callback) {
        return (
            <TouchableOpacity  style={{padding:8}} onPress={callback}>
                <Image style={{width: 26, height: 26, marginLeft: 10}} source={require('../../../res/images/ic_arrow_back_white_36pt.png')}/>
            </TouchableOpacity>
        )
        
    }
}

const styles = StyleSheet.create({
    list_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        padding: 10,
        backgroundColor: 'white',
    }
})