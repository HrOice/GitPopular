/**
 * Created by macbook on 17/3/13.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    View,
    Text,
    Navigator,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
export var FLAG_TAB = {
  flag_popularTab: 'flag_popularTab', flag_trendingTab: 'flag_trendingTab',
  flag_favoriteTab: 'flag_favoriteTab', flag_myTab: 'flag_myTab'
};
import Popular from './Popular';
import Favorite from './Favorite';
import Trending from './Trending';
import My from './my/My';
import ArrayUtil from '../util/ArrayUtil';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.subcribers = [];
    this.changeValues = {
      favorite: {popularChange: false, trendingChange: false},
      my: {languageChange: false, keyChange: false, themeChange: false}
    };
    this.state = {
      selectedTab: this.props.selectedTab? this.props.selectedTab :FLAG_TAB.flag_popularTab
    }
  }
  onRestart(tab) {
    this.props.navigator.resetTo({
      name: 'Home',
      component: Home,
      params: {
        ...this.props,
        selectedTab: tab
      }
    })
  }

  addSubcriber(subcriber) {
    ArrayUtil.add(this.subcribers, subcriber);
  }

  removeSubcriber(subcriber) {
    ArrayUtil.remove(this.subcribers, subcriber);
  }

  onSelected(selectedTab) {
    if (selectedTab !== this.state.selectedTab) {
      this.subcribers.forEach((item, i, subcribers) => {
        if (typeof(item) === 'function') item(this.state.selectedTab, selectedTab);
      }) 
    }
    if(selectedTab===FLAG_TAB.flag_popularTab)this.changeValues.favorite.popularChange=false;
    if(selectedTab===FLAG_TAB.flag_trendingTab)this.changeValues.favorite.trendingChange=false;
    this.setState({selectedTab: selectedTab})
  }

  _renderTab(Child, title, selectedTab, renderIcon) {
    return (
        <TabNavigator.Item title={title}
                           selected={this.state.selectedTab === selectedTab}
                           renderIcon={() => <Image style={styles.tabBarIcon}
                                                    source={renderIcon}/>}
                           renderSelectedIcon={() => <Image style={styles.tabBarSelectedIcon}
                                                            source={renderIcon}/>}
                           selectedTitleStyle={styles.selectedTitleStyle}
                           onPress={() => this.onSelected(selectedTab)}>
          <Child {...this.props} homeComponent={this}/>
        </TabNavigator.Item>
    )
  }

  render() {
    return (
        <View style={styles.container}>
          <TabNavigator tabBarStyle={{opacity: 0.9}}
                        sceneStyle={{paddingBottom: 0}}
          >
            {this._renderTab(Popular, 'Popular', FLAG_TAB.flag_popularTab, require('../../res/images/ic_polular.png'))}
            {this._renderTab(Trending, 'Trending', FLAG_TAB.flag_trendingTab, require('../../res/images/ic_trending.png'))}
            {this._renderTab(Favorite, 'Favorite', FLAG_TAB.flag_favoriteTab, require('../../res/images/ic_favorite.png'))}
            {this._renderTab(My, 'My', FLAG_TAB.flag_myTab, require('../../res/images/ic_my.png'))}
          </TabNavigator>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarIcon: {
    width: 26, height: 26,
    resizeMode: 'contain',
  },
  tabBarSelectedIcon: {
    width: 26, height: 26,
    resizeMode: 'contain',
    tintColor:'red'
  },
  selectedTitleStyle:{
    color: 'red'
  }
});