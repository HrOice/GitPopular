import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Image,
    StyleSheet,
    Alert
} from 'react-native';
import SortableListView from 'react-native-sortable-listview'

import NavigationBar from '../../component/common/NavigationBar';
import LanguageDao from '../../expand/dao/LanguageDao';
import ViewUtils from '../../component/common/ViewUtils';
import ArrayUtil from '../../util/ArrayUtil';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

export default class SortKey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch().then((items) => {
            this.getCheckedItems(items);
        }).catch((e) => {
            console.error(e);
        })
    }

    getCheckedItems(items) {
        this.dataArray = items;
        let checkedArray = [];
        for (var i = 0; i < this.dataArray.length; i++ ) {
            if (this.dataArray[i].checked) checkedArray.push(this.dataArray[i]);
        }
        this.setState({
            checkedArray: checkedArray
        })
        this.originCheckedArray = ArrayUtil.clone(checkedArray);
    }

    onBack() {
        if (!ArrayUtil.isEquals(this.originCheckedArray, this.state.checkedArray)) {
            Alert.alert(
                'Comfirm Exit',
                'Do you want to save your changes before exitting?',
                [
                    {
                        text: 'No', onPress: () => {
                            this.props.navigator.pop();
                        }
                    },
                    {
                        text: 'Yes', onPress: () => {
                            this.onSave(true);
                        }
                    }
                ]
            )
        } else {
            this.props.navigator.pop();
        }
    }

    getResultArray() {
        this.sortResultArray = ArrayUtil.clone(this.dataArray);
        for (let i = 0; i < this.originCheckedArray.length; i++ ) {
            let item = this.originCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    onSave(hasChecked) {
        if (!hasChecked) {
            if (ArrayUtil.isEquals(this.originCheckedArray, this.state.checkedArray)) {
                this.props.navigator.pop();
                return;
            }
        }
        this.getResultArray();
        this.languageDao.save(this.sortResultArray);
        if (FLAG_LANGUAGE.flag_key === this.props.flag) {
            this.props.homeComponent.changeValues.my.keyChange = true;
        } else {
            this.props.homeComponent.changeValues.my.languageChange = true;
        }
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#f3f2f2'}}>
                <NavigationBar title={this.props.menuType}
                               leftButton={ViewUtils.leftBackButton(()=>this.onBack())} 
                               rightButton={{
                                   title: 'Save',
                                   tintColor: 'white',
                                   handler: () => this.onSave()
                               }}
                />
                <SortableListView 
                                  data={this.state.checkedArray}
                                  order={Object.keys(this.state.checkedArray)}
                                  renderRow={row => <SortCell data={row} {...this.props}/>}
                                  onRowMoved={(e) => {
                                      this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);  
                                      this.forceUpdate();
                                  }}
                />
            </View>
        )
    }
}

class SortCell extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableHighlight underLayColor='#eee' style={this.props.data.checked? styles.item : styles.item} 
                                {...this.props.sortHandlers}>
                <View style={{marginLeft: 10, flexDirection: 'row'}} >
                    <Image source={require('./img/ic_sort.png')} resizeMode='stretch'
                            style={{width: 16, height: 16, opacity: 1, marginRight: 10}}
                    />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        borderBottomWidth: 0.5,
        borderColor: '#eee',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'white'
    },
    hidden: {
        height: 0
    }
})