import React, { Component } from 'react';
import { Image, View } from "react-native"
import { ic_home, ic_home_s, ic_recentcall, ic_recentcall_s, ic_dialpad,ic_contact,ic_contact_s,ic_livechat, ic_chat} from '../routes/imageRoutes';
import colors from '../../assets/colors';
class IconTab extends Component {
    render() {
        let icon = ic_home;
        let iconType = 'material'
        let { focused, index } = this.props;
        if (index === 0) {
            icon = focused ? ic_home : ic_home 
            iconType = 'material'
        }
        else if (index === 1) {
            icon = focused ? ic_recentcall : ic_recentcall 
            iconType = 'material'
        } else if (index === 2) {
            icon = focused ? ic_dialpad : ic_dialpad 
            iconType = 'ionicon'
        }else if (index === 3) {
            icon = focused ? ic_contact : ic_contact 
            iconType = 'ionicon'
        } else if (index === 4) {
            icon = focused ? ic_chat : ic_chat 
            iconType = 'ionicon'
        }
        
        return (
            <View style={{}} >
                <Image source={icon} />
            </View>

        );
    }
}

export default IconTab