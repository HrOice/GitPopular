/**
 *
 * Created by macbook on 17/3/13.
 */
import React, {Component} from 'react';
import {View, ListView, Text, StyleSheet} from 'react-native';
import DataRepository from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../component/common/NavigationBar';
import FavoriteDao from '../expand/dao/FavoriteDao';
import RepositoryCell from '../component/common/RepositoryCell';
import ProjectModel from '../model/ProjectModel';
import {FLAG_TAB} from './Home'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

var favoriteDao = new FavoriteDao('popular');
export default class Popular extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.state = {
      language: [],
    }
  }

  componentDidMount() {
    this.loadLanguage();
    this.props.homeComponent.addSubcriber(this.onSubcriber);
  }

  componentWillUnmount() {
    this.props.homeComponent.removeSubcriber(this.onSubcriber);
  }

  onSubcriber = (preTab, currentTab) => {
    let changeValues = this.props.homeComponent.changeValues;
    if (FLAG_TAB.flag_myTab === preTab && changeValues.my.keyChange) {
      this.props.homeComponent.onRestart(FLAG_TAB.flag_popularTab);
    }
  }

  loadLanguage() {
    this.languageDao.fetch().then((result) => {
      if (result) {
        this.setState({language: result});
      }
    }).catch((e) => {

    })
  }

  render() {
    let navigationBar = <NavigationBar title="Popular"/>
    return (
      <View style={styles.container}>
        {navigationBar}
        <ScrollableTabView
          tabBarBackgroundColor={"red"}
          initialPage={0}
          renderTabBar={() => <ScrollableTabBar
          style={{
          height: 40,
          borderWidth: 1,
          elevation: 2
        }}
          tabStyle={{
          height: 39
        }}
          underlineHeight={2}/>}>
          {this.state.language.map((item, i, array) => {
            return item && item.checked ? 
                    (<PopularTab {...this.props} key={i}
                                tabLabel={item.name}/>)
                                :null;

          })
          }
    
        </ScrollableTabView>
      </View>
    )
  }
}

class PopularTab extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      favoriteKeys: [],
      dataSource: ds
    }
  }
  componentDidMount() {
    this.props.homeComponent.addSubcriber(this.onSubcriber);
    this.loadData();
  }

  componentWillUnmount() {
    this.props.homeComponent.removeSubcriber(this.onSubcriber);
  }

  onSubcriber = (preTab, currentTab) => {
    var changeValues = this.props.homeComponent.changeValues;
    if (currentTab != FLAG_TAB.flag_popularTab)return;
    if (preTab === FLAG_TAB.flag_favoriteTab && changeValues.favorite.popularChange) {
      this.updateFavorite();
    }
  }

  updateFavorite() {
    this.getFavoriteKeys();
  }

  loadData() {
    new DataRepository()
      .fetchRepository(API_URL + this.props.tabLabel + QUERY_STR)
      .then((wrapData) => {
        this.items = wrapData && wrapData.items
          ? wrapData.items
          : wrapData
            ? wrapData
            : [];
        this.getFavoriteKeys();
      })
  }

  getFavoriteKeys() {
    favoriteDao
      .getFavoriteKeys()
      .then((keys) => {
        if (keys) {
          this.updateState({favoriteKeys: keys})
        }
        this.flushFavoriteState();
      })
      .catch((e) => {
        this.flushFavoriteState();
        console.log(e);
      })
  }

  flushFavoriteState() {
    let projectModels = [];
    let items = this.items;
    for (var i = 0; i < items.length; i++) {
      projectModels.push(new ProjectModel(items[i], this.checkFavorite(items[i], this.state.favoriteKeys)));
    }
    this.updateState({dataSource: this.getDataSource(projectModels)})
  }

  getDataSource(items) {
    return this
      .state
      .dataSource
      .cloneWithRows(items);
  }

  checkFavorite(item, itemKeys) {
    for (var i = 0; i < itemKeys.length; i++) {
      if (itemKeys[i] === item.id.toString()) {
        return true;
      }
    }
    return false;
  }

  updateState(dic) {
    if (!dic) 
      return;
    this.setState(dic);
  }

  _renderRow(rowData, sectionId, rowId) {
    // rowData.isFavorite= true;
    return (<RepositoryCell
      projectModel={rowData}
      onFavorite={(item, isFavorite) => {
      this.onFavorite(item, isFavorite)
    }}/>);
  }

  onFavorite(item, isFavorite) {
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
    } else {
      favoriteDao.removeFavoriteItem(item.id.toString());
    }
  }

  render() {
    let content = <ListView
      enableEmptySections={true}
      style={[styles.listView, {marginBottom: 60}]}
      renderRow={(e) => this._renderRow(e)}
      initialListSize={10}
      dataSource={this.state.dataSource}/>;
    return (
      <View style={{
        flex: 1
      }}>
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});