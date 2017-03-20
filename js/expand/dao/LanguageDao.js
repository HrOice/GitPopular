import {AsyncStorage} from 'react-native';
import langsData from '../../../res/data/langs.json'
import keysData from '../../../res/data/keys.json'

export var FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'}

export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    var data = this.flag === FLAG_LANGUAGE.flag_language ? langsData : keysData;
                    this.save(data);
                } else {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                }
            })
        })
    }

    save(object) {
        var dataStr ;
        try {
            dataStr = JSON.stringify(object);
            AsyncStorage.setItem(this.flag, dataStr);
        } catch (e) {
            console.error(e);
        }
    }
}