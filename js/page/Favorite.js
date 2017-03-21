/**
 * Created by macbook on 17/3/13.
 */
import React, {Component} from 'react';
import {
    Text,
    ListView,
    View,
    StyleSheet,
} from 'react-native';

import RepositoryCell from '../component/common/RepositoryCell';
import ProjectModel from '../model/ProjectModel';
import FavoriteDao from '../expand/dao/FavoriteDao';
import NavigationBar from '../component/common/NavigationBar';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DataRepository from '../expand/dao/DataRepository';
import ArrayUtil from '../util/ArrayUtil';
import TrendingCell from '../component/common/TrendingCell';

var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}
export default class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let navigationBar = <NavigationBar title="Favorite"/>
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollableTabView
                    tabBarBackgroundColor={"red"}
                    initialPage={0}
                    renderTabBar={() => <ScrollableTabBar
                    style={{height: 40, borderWidth: 1, elevation: 2}}
                    tabStyle={{height: 39}}
                    underlineHeight={2}
                    />}
                >
                <FavoriteTab {...this.props} flag={FLAG_STORAGE.flag_popular} tabLabel={"Popular"}/>
                <FavoriteTab {...this.props} flag={FLAG_STORAGE.flag_trending} tabLabel={"Trending"}/>
                </ScrollableTabView>
            </View>
        )
    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.unFavoriteItems = [];
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.loadData();
    }

    loadData() {
        this.favoriteDao.getAllItems()
        .then((items) => {
            var resultData = [];
            for (var i=0; i<items.length;i++) {
                resultData.push(new ProjectModel(items[i], true));
            }
            this.setState({
                dataSource: this.getDataSource(resultData)
            })
        })
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    _renderRow(rowData, sectionId, rowId) {
        let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
        return (
            <CellComponent
                projectModel={rowData}
                onFavorite={(item, isFavorite) => {
                    this.onFavorite(item, isFavorite);
                }}
            />
        )
    }

    onFavorite(item, isFavorite) {
        let key = this.props.flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName;
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
        ArrayUtil.update(this.unFavoriteItems, item);
        if (this.unFavoriteItems.length > 0) {
            if(this.props.flag === FLAG_STORAGE.flag_popular) {
                this.props.homeComponent.changeValues.favorite.popularChange = true;
            } else {
                this.props.homeComponent.changeValues.favorite.trendingChange = true;
            }
        } else {
            if(this.props.flag === FLAG_STORAGE.flag_popular) {
                this.props.homeComponent.changeValues.favorite.popularChange = false;
            } else {
                this.props.homeComponent.changeValues.favorite.trendingChange = false;
            }            
        }
    }

    render() {
        let content = <ListView
            enableEmptySections={true}
            style={styles.ListView}
            initialListsize={10}
            dataSource={this.state.dataSource}
            renderRow={(e) => this._renderRow(e)}
        />
        return (
            <View style={{flex: 1}}>
                {content}
            </View>  
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    }
})