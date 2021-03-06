import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import * as React from 'react';

import { PostText } from '../../../../../src/components/displayers/WallPost';
import { getTextMock } from '../../../../../src/mocks';
import CenterView from '../../../../helpers/CenterView';

storiesOf('Components/displayers', module)
	.addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
	.addDecorator(withKnobs)
	.add('PostText', () => {
		const fullTextVisible = boolean('fullTextVisible', false);

		return (
			<PostText
				getText={getTextMock}
				text={
					'Here Ionut testing wall post card component in a Storybook' +
					'\nMonday morning with 18 deg.' +
					'\nAnd this is the third line of the post. Next with an URL' +
					'\nhttps://socialx.network @user11 #hashTagText'
				}
				fullTextVisible={fullTextVisible}
				onShowFullText={action('onShowFullText')}
				handleHashTag={action('handleHashTag')}
				handleUserTag={action('handleUserTag')}
				handleUrls={action('handleUrls')}
			/>
		);
	});
