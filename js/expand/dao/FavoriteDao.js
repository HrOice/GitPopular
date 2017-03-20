import {AsyncStorage} from 'react-native';
const FAVORITE_KEY_PREFIX = 'favorite_'

export default class FavoriteDao {
    constructor(flag) {
        this.flag = flag;
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }

    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error, resurt) => {
            if (!error) {
                this.updateFavoriteKeys(key,true);
            }
        })
    }

    removeFavoriteItem(key, value, callback) {
        AsyncStorage.removeItem(key, (error, resurt) => {
            if (!error) {
                this.updateFavoriteKeys(key,false);
            }
        })
    }

    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (err, result) => {
            if (!err) {
                var favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }
                var index = favoriteKeys.indexOf(key);
                if (isAdd) {
                    if (index === -1) favoriteKeys.push(key);
                } else {
                    if (index !== -1) favoriteKeys.splice(index, 1);
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
            }
        })
    }

    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (err, res) => {
                if (!err) {
                    try {
                        resolve(JSON.parse(res));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(err);
                }
            })
        })
    }

    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then((keys) => {
                var items = [];
                if (keys) {
                    AsyncStorage.multiGet(keys, (err, stores) => {
                        try {
                            stores.map((resule, i, stores) => {
                                let key = stores[i][0];
                                let value = stores[i][1];
                                if (value) items.push(JSON.parse(value));
                            })
                            resolve(items);
                        } catch (e) {
                            reject(e);
                        }
                    })
                } else {
                    resolve(items);
                }
            }).catch((e) => {
                reject(e);
            })
        })
    }

}