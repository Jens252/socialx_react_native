import * as React from 'react';
import { View } from 'react-native';

import { Colors, colorWithAlpha } from '../../environment/theme';

interface IActivityIndicatorModalProps {
	visible: boolean;
	alpha: number;
}

export const TransparentOverlayModal: React.SFC<
	IActivityIndicatorModalProps
> = ({ visible, alpha }) => (
	<View
		pointerEvents={visible ? 'auto' : 'none'}
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			backgroundColor: visible
				? colorWithAlpha(Colors.black, alpha)
				: Colors.transparent,
		}}
	/>
);

/**
 * Sample usage below:
 */

// private showAndHideTransparentOverlay = () => {
//   this.props.setGlobal({
//     transparentOverlay: {
//       visible: true,
//       alpha: 0.5,
//     },
//   });
//   setTimeout(
//     () =>
//       this.props.setGlobal({
//         transparentOverlay: {
//           visible: false,
//         },
//       }),
//     2000,
//   );
// };