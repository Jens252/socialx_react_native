import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes } from '../../../environment/theme';

const styles: any = {
	container: {
		position: 'absolute',
		flexDirection: 'row',
		backgroundColor: Colors.white,
		borderRadius: Sizes.smartHorizontalScale(15),
		borderColor: Colors.dustWhite,
		borderWidth: 1,
		paddingLeft: Sizes.smartHorizontalScale(4),
		paddingRight: Sizes.smartHorizontalScale(3),
		paddingVertical: Sizes.smartVerticalScale(2),
		alignItems: 'center',
	},
	numberOfLikes: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(12),
		color: Colors.cloudBurst,
		paddingLeft: Sizes.smartHorizontalScale(2),
	},
	iconContainer: {
		backgroundColor: Colors.pink,
		borderRadius: Sizes.smartHorizontalScale(50),
		paddingHorizontal: Sizes.smartHorizontalScale(4),
		paddingVertical: Sizes.smartHorizontalScale(1),
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		fontSize: Sizes.smartHorizontalScale(14),
		color: Colors.white,
	},
	defaultLikesPosition: {
		bottom: -18,
		right: 0,
	},
	altLikesPosition: {
		bottom: 10,
		right: -30,
	},
};

export default StyleSheet.create(styles);
