/**
 * Created by macbook on 17/3/13.
 * 列表单元,popular&trending
 * 事件:收藏功能
 * ListView会进行遍历调用此组件
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';

//其实这里面的收藏动作,不仅仅是在当前操作中存在,也要存入缓存,以便在下次打开应用保持,所以传进来的模型应该带有isFavorite字段,
//并且在切换页面时进行同步,这个同步是怎么来的? 1.通过listView渲染规则。2。componentWillReceiveProps()方法
export default class RepositoryCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
      favoriteIcon: this.props.projectModel.isFavorite ? require('../../../res/images/ic_star.png') : require('../../../res/images/ic_unstar_transparent.png'),
    }
  }

  componentWillReceiveProps(nextProp) {
    this.setFavoriteState(nextProp.projectModel.isFavorite);
  }

  _renderTitleRow(title) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  _renderDescriptionRow() {
    return (
        <View></View>
    )
  }

  _renderInfoRow(item) {
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.author}>Author: </Text>
            <Image
                style={{width: 22, height: 22,}}
                source={{uri: item.owner.avatar_url}}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.author}>Stars: </Text>
            <Text style={styles.author}>
              {item.stargazers_count}
            </Text>
          </View>
          {this._renderFavoriteButton()}
        </View>
    )
  }

  _renderFavoriteButton() {
    return this.props.projectModel ?
        <TouchableHighlight style={{padding: 6}}
                            onPress={() => this.onPressFavorite()}
                            underlayColor='transparent'>
          <Image style={[styles.favoriteIcon,{tintColor: 'red'}]}
                 source={this.state.favoriteIcon}>
          </Image>
        </TouchableHighlight> :
        null;
  }

  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
  }

  setFavoriteState(favorite) {
    this.setState({
      isFavorite: favorite,
      favoriteIcon: favorite ? require('../../../res/images/ic_star.png') : require('../../../res/images/ic_unstar_transparent.png'),
    })
  }
  onPress = () => {
    // setTimeout(()=> {
    //   alert('点击了按钮');
    // }, 1000);
  };

  render() {
    let item = this.props.projectModel.item;
    let titleRow = this._renderTitleRow(item.full_name);
    let descriptionRow = this._renderDescriptionRow();
    let infoRow = this._renderInfoRow(item);
    let container = <View style={styles.cell_container}>
      {titleRow}
      {descriptionRow}
      {infoRow}
    </View>;
    return (
        <TouchableHighlight underlayColor='rgba(38, 26, 34, 0.1)'
                            onPress={this.onPress}>
          {container}
        </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
    flex:1
  },
  author: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  },
  favoriteIcon: {
    width: 22,
    height: 22,
  },
  cell_container: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#dddddd',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width:0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation:2,
  }
});