import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Sizes } from '../../environment/theme';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		width,
		height,
		justifyContent: 'flex-end',
		margin: 0,
	},
	innerContainer: {
		backgroundColor: Colors.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	row: {
		flexDirection: 'row',
		height: Sizes.smartVerticalScale(50),
		backgroundColor: Colors.white,
		borderRadius: 1,
	},
	first: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	separator: {
		borderBottomWidth: Sizes.smartHorizontalScale(1),
		borderColor: Colors.wildSand,
	},
	iconContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textContainer: {
		flex: 7,
		justifyContent: 'center',
	},
	icon: {
		color: Colors.cloudBurst,
		fontSize: Sizes.smartHorizontalScale(25),
	},
	oct: {
		color: Colors.cloudBurst,
		fontSize: Sizes.smartHorizontalScale(20),
	},
});
