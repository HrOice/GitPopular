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
    TouchableHighlight
} from 'react-native'

export default class TrendingCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../../res/images/ic_star.png') : require('../../../res/images/ic_unstar_transparent.png')
        }
    }

    componentWillReceiveProps(nextProp) {
        this.setFavorite(nextProp.projectModel.isFavorite);
    }
    

    onPressFavorite() {
        this.setFavorite(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    }

    setFavorite(isFavorite) {
        this.setState({isFavorite: isFavorite, favoriteIcon: isFavorite ? require('../../../res/images/ic_star.png') : require('../../../res/images/ic_unstar_transparent.png')})
    }

    onPress() {

    }

    render() {
        let projectModel = this.props.projectModel.item;
        if (!projectModel) return null;
        return (
            <TouchableHighlight underlayColor='rgba(38, 26, 34, 0.1)'
                                onPress={() => this.onPress()}>
                <View style={styles.cell_container}>
                    <View style={styles.titleView}>
                        <Text>{projectModel.fullName}</Text>
                    </View>
                    <View style={styles.infoView}> 
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.author}>Built by  </Text>
                        {projectModel.contributors && projectModel.contributors.map((uri, i, array) => {
                            return (
                                <Image key={i} source={{uri: uri}} style={styles.avator}/>
                            )
                        })}
                        </View>
                        <TouchableHighlight style={{padding: 6}}
                                            underlayColor='transparent'
                                            onPress={() => this.onPressFavorite()}>
                            <Image source={this.state.favoriteIcon} style={[styles.favoriteIcon, {tintColor: 'red'}]}/>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

var styles = StyleSheet.create({
    cell_container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#dddddd',
        borderRadius: 2,
        marginVertical: 3,
        marginLeft: 5,
        marginRight: 5,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    infoView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        marginBottom: 10
    },
    avator: {
        width: 22,
        height: 22,
        margin: 2
    },
    author: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 10
    },
    favoriteIcon: {
        width: 22,
        height: 22,
    },
})