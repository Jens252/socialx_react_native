import { Root } from 'native-base';
import React, { Component } from 'react';
import { getStorybookUI, configure } from '@storybook/react-native';
import SplashScreen from 'react-native-smart-splash-screen';

import './rn-addons';

// import stories (components or screens)
configure(() => {
  require('./stories');
}, module);

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// https://github.com/storybooks/storybook/issues/2081
// eslint-disable-next-line react/prefer-stateless-function
class StorybookUIHMRRoot extends Component {
  componentDidMount() {
		SplashScreen.close({
			animationType: SplashScreen.animationType.fade,
			duration: 1000,
			delay: 100,
		});
    console.disableYellowBox = true; // we should get this warning in debugger and not over the screen in the app.
	}


  render() {
    return (
      <Root>
        <StorybookUIRoot/>
      </Root>
    );
  }
}

export default StorybookUIHMRRoot;
