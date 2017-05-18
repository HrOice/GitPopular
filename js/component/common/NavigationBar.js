/**
 * Created by macbook on 17/3/13.
 * 导航栏,视图的头部
 */
import React, {Component, PropTypes} from 'react';

import {
    StyleSheet,
    Navigator,
    Platform,
    TouchableOpacity,
    Image,
    StatusBar,
    Text,
    View
} from 'react-native'
const STATUS_BAR_HEIGHT = 20;

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);

  }

  getButtonElement(data = {}, style) {
    return (
        <View style={styles.navBarButton}>
            {(!!data.props) ? data : (
                <NavBarButton
                    title={data.title}
                    style={[data.style, style,]}
                    tintColor={data.tintColor}
                    handler={data.handler}/>
            )}
        </View>
    );
  }

  render() {
    let titleView = this.props.titleView ? this.props.titleView :
        <Text style={styles.title} ellipsizeMode="head" numberOfLines={1} >{this.props.title}</Text>;
    let content = <View style={styles.navBar}>
                    {this.getButtonElement(this.props.leftButton)}
                    <View>
                      {titleView}
                    </View>
                    {this.getButtonElement(this.props.rightButton)}
                  </View>;
    let statusBar = <View style={styles.statusBar}>
                      <StatusBar backgroundColor="blue"
                                 barStyle="light-content"
                      />
                    </View>
    return (
        <View style={[styles.container]}>
          {statusBar}
          {content}
        </View>
    )
  }

}

class NavBarButton extends Component {

  render () {
      const {style, tintColor, margin, title, handler} = this.props;
      return (
         <TouchableOpacity style={styles.navBarButton} onPress={handler}>
            <View style={style}>
                <Text style={[styles.title, {color: tintColor,},]}>{title}</Text>
            </View>
         </TouchableOpacity>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    // backgroundColor:'blue',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  navBarButton: {
    // alignItems: 'center'
    marginRight: 10
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT:0,

  },
});