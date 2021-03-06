import * as React from 'react';

import { ITranslatedProps } from '../../../types';
import { WithI18n } from '../../connectors/app/WithI18n';

const mock: IWithAdsManagementEnhancedProps = {
	data: {
		fullName: 'Alex Sirbu',
		alias: 'alexsirbu',
		avatar: 'https://www.seoclerk.com/pics/319222-1IvI0s1421931178.png',
	},
	actions: {
		getText: (value: string, ...args: any[]) => value,
	},
};

export interface IWithAdsManagementEnhancedData {
	fullName: string;
	alias: string;
	avatar: string;
}

export interface IWithAdsManagementEnhancedActions extends ITranslatedProps {}

interface IWithAdsManagementEnhancedProps {
	data: IWithAdsManagementEnhancedData;
	actions: IWithAdsManagementEnhancedActions;
}

interface IWithAdsManagementProps {
	children(props: IWithAdsManagementEnhancedProps): JSX.Element;
}

interface IWithAdsManagementState {}

export class WithAdsManagement extends React.Component<
	IWithAdsManagementProps,
	IWithAdsManagementState
> {
	render() {
		return (
			<WithI18n>
				{(i18nProps) =>
					this.props.children({
						data: {
							...mock.data,
						},
						actions: {
							getText: i18nProps.getText,
						},
					})
				}
			</WithI18n>
		);
	}
}
