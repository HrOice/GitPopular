/**
 * Created by macbook on 17/3/13.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ListView,
    Image,
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TrendingCell from '../component/common/TrendingCell';
import NavigationBar from '../component/common/NavigationBar';
import TimeSpan from '../model/TimeSpan';
var timeSpanTextArray = [new TimeSpan('Today', 'since=daily'), new TimeSpan('This Week', 'since=weekly'),
    new TimeSpan('This Month', 'since=monthly')];
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import FavoriteDao from '../expand/dao/FavoriteDao';
import ProjectModel from '../model/ProjectModel';
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
const API_URL = 'https://github.com/trending/'
var favoriteDao = new FavoriteDao('trending');
export var FLAG_TAB = {
  flag_popularTab: 'flag_popularTab', flag_trendingTab: 'flag_trendingTab',
  flag_favoriteTab: 'flag_favoriteTab', flag_myTab: 'flag_myTab'
}
export default class Trending extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            timeSpan: timeSpanTextArray[0]
        }
    }

    componentDidMount() {
        this.loadLanguages();
    }

    loadLanguages() {
        this.languageDao.fetch().then((languages) => {
            if (languages) {
                this.setState({languages: languages});
            }
        }).catch((e) => {
            console.error(e);
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <NavigationBar title='Trending'/>
                <ScrollableTabView 
                    tabBarBackgroundColor='red'
                    renderTabBar={() => <ScrollableTabBar 
                        style={{height: 40, borderWidth: 1, elevation: 2}}
                        tabStyle={{height: 39}}
                    />}
                    initialPage={0}
                >
                    {this.state.languages.map((language, i, a) => {
                        if (language && language.checked) {
                            return (
                                <TrendingTab key={i} {...this.props} tabLabel={language.name}
                                             timeSpan={this.state.timeSpan}/>
                            )
                        }
                    })}
                </ScrollableTabView>
            </View>
        )
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            dataSource: ds,
            favoriteKeys: []
        }
    }

    componentDidMount() {
        this.props.homeComponent.addSubcriber(this.onSubcribe);
        this.loadData();
    }

    componentWillUnmount() {
        this.props.homeComponent.removeSubcriber(this.onSubcribe);
    }

    onSubcribe = (preTab, currentTab) => {
        var changeValues = this.props.homeComponent.changeValues;
        if (currentTab !== FLAG_TAB.flag_trendingTab) return;
        if (preTab === FLAG_TAB.flag_favoriteTab && changeValues.favorite.trendingChange) {
            this.updateFavorite();
        }
    }

    componentWillReceiveProps(nextProp) {
        
    }

    updateFavorite() {
        this.getFavoriteKeys();
    }

    loadData() {
        let url = this.getFetchUrl(this.props.timeSpan, this.props.tabLabel);
        dataRepository.fetchRepository(url).then((wrapData) => {
            this.items = wrapData && wrapData.items ? wrapData.items : wrapData ? wrapData: [];
            console.log(wrapData);
            this.getFavoriteKeys();
        }).catch((e) => {
            console.error(e);
        })
    }

    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (var i = 0; i < items.length; i ++) {
            projectModels.push(new ProjectModel(items[i], this.checkFavorite(items[i])))
        }
        this.setState({dataSource: this.state.dataSource.cloneWithRows(projectModels)})

    }

    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys().then((keys) => {
            console.log(keys);
            if (keys) {
                this.setState({favoriteKeys: keys})
            } 
            this.flushFavoriteState();
        }).catch((e) => {
            this.flushFavoriteState();
            console.log(e);
        })
    }

    checkFavorite(item) {
        for (var i = 0; i < this.state.favoriteKeys.length; i++ ) {
            if (item.fullName === this.state.favoriteKeys[i]) {
                return true;
            }
        }
        return false;   
    }

    getFetchUrl(timeSpan, language) {
        return API_URL + language + this.props.timeSpan.searchText;
    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.fullName);
        }
    }

    _renderRow(row, sectionId, rowId) {
        return (
            <TrendingCell 
                projectModel={row}
                onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
            />
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView 
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    style={{flex: 1, marginBottom: 60}}
                    initialSize={10}
                    renderRow={(e) => this._renderRow(e)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({

})