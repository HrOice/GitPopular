import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import CheckBox from 'react-native-check-box';
import NavigationBar from '../../component/common/NavigationBar';
import ViewUtils from '../../component/common/ViewUtils';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import ArrayUtil from '../../util/ArrayUtil';

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.changeValues = [];
        this.state = {
            dataArray: []
        }
    }

    onBack() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
        } else {
            Alert.alert('Confirm Exit', 
                'Do you want to save your changes before exitting?',
                [{text: 'No', onPress: () => {this.props.navigator.pop()}},
                 {text: 'Yes', onPress: () => this.onSave()}   
                ]
            )
        }
    }

    onSave() {
        if (this.changeValues.length === 0) this.props.navigator.pop();
        this.languageDao.save(this.state.dataArray);
        if (this.props.flag === FLAG_LANGUAGE.flag_language) {
            this.props.homeComponent.changeValues.my.languageChange=true;
        } else {
            this.props.homeComponent.changeValues.my.keyChange=true;
        }
        this.props.navigator.pop();
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch().then((result) => {
            this.setState({dataArray: result});
        }).catch((e)=> {
            console.error(e);
        })
    }

    renderView() {
        var dataArray = this.state.dataArray;
        // if (!dataArray || dataArray.length === 0) return;
        var len = dataArray.length;
        var views = [];
        for (var i = 0; i < len ; i+=2) {
            views.push(
                <View key={i}>
                    <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
                        {this.renderCheckBox(dataArray[i])}
                        {this.renderCheckBox(dataArray[i+1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        return views;
    }

    renderCheckBox(data) {
        if (!data) return;
        let leftText = data.name;
        let isChecked = data.checked;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                isChecked={isChecked}
                onClick={() => this.checkboxClick(data)}
                leftText={leftText}
                checkedImage={<Image source={require('../../page/my/img/ic_check_box.png')} />}
                unCheckedImage={<Image source={require('../../page/my/img/ic_check_box_outline_blank.png')} />}
            />
        )
    }

    checkboxClick(data) {
        data.checked = !data.checked;
        ArrayUtil.update(this.changeValues, data);
    }

    render() {
        let navigationBar = (
            <NavigationBar title={this.props.menuType}
                           leftButton={ViewUtils.leftBackButton(()=>this.onBack())}
                           rightButton={{
                                title: 'Save',
                                handler:()=>this.onSave(),
                                tintColor:'white',
                            }}
                           />
        )
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>    
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2'
    },
    line: {
        borderWidth: 0.5,
        height: 0.4,
        borderColor: '#eeeeee'
    }
})