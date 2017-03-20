
import React,{Component} from 'react'
import {
    Navigator,
}from 'react-native';
import Home from './Home';
function setup(){ 

    class Root extends Component  {
        constructor(props) {
            super(props);
            this.state = {
            };
        }

        render() {
            return (
                <Navigator 
                    initialRoute={{
                        name: 'Home',
                        component: Home
                    }}
                    renderScene={(e, i) => {
                        let Component = e.component;
                        return (
                            <Component {...e.params} navigator={i}/>
                        )
                    }}
                />
                
            )
        }
    }

    return <Root/>
}

module.exports = setup;