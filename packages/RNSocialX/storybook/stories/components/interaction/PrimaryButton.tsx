import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import * as React from 'react';

import { ButtonSizes, PrimaryButton } from '../../../../src/components';
import { Colors } from '../../../../src/environment/theme';
import CenterView from '../../../helpers/CenterView';

storiesOf('Components/interaction', module)
	.addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
	.add('PrimaryButton', () => (
		<PrimaryButton
			label="Button (Surprising, I know)"
			disabled={false}
			onPress={action('Pressed!')}
			size={ButtonSizes.Normal}
			autoWidth={true}
			borderColor={Colors.pink}
			textColor={Colors.pink}
			loading={false}
			containerStyle={{ backgroundColor: Colors.transparent, borderRadius: 10 }}
		/>
	));
