/**
 * Created by macbook on 17/3/13.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
    StyleSheet,

} from 'react-native';
import NavigationBar from '../../component/common/NavigationBar';
import ViewUtils from '../../component/common/ViewUtils';
import {MORE_MENU} from '../../component/common/MoreMenu';
import CustomKeyPage from './CustomKeyPage';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import SortKey from './SortKey';

export default class My extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    getItemView(tag, icon, text) {
        return ViewUtils.getItemView(() =>this.onPress(tag), icon, text, 'red')
    }

    onPress(tag) {
        let TargetComponent, params = {...this.props, menuType: tag}
        switch(tag) {
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKey;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKey;
                params.flag = FLAG_LANGUAGE.flag_key;
                break            
        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params
            })
        }
    }

    render() {
        return (
            <View style={styles.listView_container}>
                <NavigationBar title="My"/>
                <ScrollView >
                    <TouchableHighlight onPress={this.onPress('github')}
                                        underlayColor={'transparent'}
                    >
                        <View style={styles.gitHubPopular}>
                            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                <Image style={{width: 40, height: 40, marginRight: 10, tintColor: 'red'}} source={require('../../../res/images/ic_trending.png')}/>
                                <Text>GitHub Popular</Text>
                            </View>
                            <View>
                                <Image style={{marginRight: 10, height: 22, width: 22, alignSelf: 'center', opacity: 1,
                                               tintColor: 'red'}}
                                    source={require('../../../res/images/ic_tiaozhuan.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.line}/>
                    <Text style={styles.groupTitle}>Custom trending language</Text>
                    <View style={styles.line}/>
                    {this.getItemView(MORE_MENU.Custom_Language, require('./img/ic_custom_language.png'), 'Custom Language')}
                    {this.getItemView(MORE_MENU.Sort_Language, require('./img/ic_swap_vert.png'), 'Sort Language')}
                    <View style={styles.line}/>
                    <Text style={styles.groupTitle}>Custom popular key</Text>
                    <View style={styles.line}/>
                    {this.getItemView(MORE_MENU.Custom_Key, require('./img/ic_custom_language.png'), MORE_MENU.Custom_Key)}
                    <View style={styles.line}/>
                    {this.getItemView(MORE_MENU.Sort_Key, require('./img/ic_swap_vert.png'), MORE_MENU.Sort_Key)}
                    <View style={styles.line}/>
                    {this.getItemView(MORE_MENU.Remove_Key, require('./img/ic_remove.png'), MORE_MENU.Remove_Key)}

                    <View style={styles.line}/>
                    <Text style={styles.groupTitle}>Setting</Text>
                    <View style={styles.line}/>   
                    {this.getItemView(MORE_MENU.Custom_Theme, require('./img/ic_view_quilt.png'), MORE_MENU.Custom_Theme)}
                    <View style={styles.line}/>   
                    {this.getItemView(MORE_MENU.NightMode, require('./img/ic_brightness.png'), MORE_MENU.NightMode)}
                    <View style={styles.line}/>
                    {this.getItemView(MORE_MENU.About_Author, require('./img/ic_insert_emoticon.png'), MORE_MENU.About_Author)}
                    <View style={styles.line}/>
                    <View style={[{marginBottom: 60}]}/>
                                     
                </ScrollView>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    gitHubPopular: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 80,
        padding: 10,
        backgroundColor: 'white',
    },
    listView_container:{
        flex: 1,
        backgroundColor: '#f3f3f4',
    },
    groupTitle: {
        // fontWeight:'500',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'

    },
    line: {
        flex: 1,
        height: 0.4,
        opacity: 0.5,
        backgroundColor: 'darkgray'
    }
})