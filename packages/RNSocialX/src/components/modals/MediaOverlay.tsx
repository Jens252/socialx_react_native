import { throttle } from 'lodash';
import * as React from 'react';
import { Animated, Dimensions, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-navigation';

import {
	IWithMediaOverlayEnhancedActions,
	IWithMediaOverlayEnhancedData,
	WithMediaOverlay,
} from '../../enhancers/components';
import {
	IWithLikingEnhancedActions,
	WithLiking,
	WithNavigationHandlers,
} from '../../enhancers/intermediary';

import { MediaInfo, MediaInteractionButtons, MediaObjectViewer } from '../../components';
import { IOnMove, MediaTypeImage } from '../../types';

import styles from './MediaOverlay.style';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THROTTLE_TIME = 300;

interface IProps
	extends IWithMediaOverlayEnhancedActions,
		IWithMediaOverlayEnhancedData,
		IWithLikingEnhancedActions {
	onViewComments: (postId: string, keyboardRaised: boolean) => void;
}

interface IState {
	activeSlide: number;
	isOverlayVisible: boolean;
	isInfoVisible: boolean;
	defaultScale: boolean;
}

class Component extends React.Component<IProps, IState> {
	public state = {
		activeSlide: this.props.media.startIndex || 0,
		isOverlayVisible: true,
		isInfoVisible: false,
		defaultScale: true,
	};

	private opacity = new Animated.Value(1);
	private toggleOverlay = throttle((state: boolean) => {
		this.onOverlayToggleHandler(state);
	}, THROTTLE_TIME);

	public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
		return (
			this.props.media.items.length !== nextProps.media.items.length ||
			this.props.likedByCurrentUser !== nextProps.likedByCurrentUser ||
			this.state !== nextState
		);
	}

	public render() {
		const {
			media: { items, startIndex, postId },
			likedByCurrentUser,
			onLikePost,
			onViewComments,
			hideMedia,
			dictionary,
		} = this.props;
		const { activeSlide, isInfoVisible, isOverlayVisible, defaultScale } = this.state;

		const data = items.filter((obj) => obj.type.category === MediaTypeImage.category);
		const currentMedia = data[activeSlide];

		return (
			<Modal
				isVisible={items.length > 0}
				animationIn="fadeIn"
				animationOut="fadeOut"
				swipeDirection="down"
				hideModalContentWhileAnimating={true}
				onBackButtonPress={this.onCloseModalHandler}
				onSwipe={this.onCloseModalHandler}
				style={styles.modal}
			>
				<StatusBar barStyle="light-content" />
				<SafeAreaView style={styles.container}>
					{currentMedia && (
						<MediaInfo
							visible={isInfoVisible}
							hash={currentMedia.hash}
							size={currentMedia.size}
							type={currentMedia.type}
							dictionary={dictionary}
							onClose={() => this.toggleInfo(false)}
						/>
					)}
					<Animated.View style={[styles.controls, { opacity: this.opacity }]}>
						<View style={styles.buttons}>
							<TouchableOpacity
								disabled={!isOverlayVisible}
								onPress={hideMedia}
								style={styles.button}
							>
								<Icon name="md-close" style={styles.icon} />
							</TouchableOpacity>
							<TouchableOpacity
								disabled={!isOverlayVisible}
								onPress={() => this.toggleInfo(true)}
								style={[styles.button, styles.right]}
							>
								<Icon name="ios-information-circle-outline" style={styles.icon} />
							</TouchableOpacity>
						</View>
					</Animated.View>
					{currentMedia && postId && (
						<Animated.View style={[styles.interaction, { opacity: this.opacity }]}>
							<MediaInteractionButtons
								postId={postId}
								likedByCurrentUser={likedByCurrentUser}
								disabled={!isOverlayVisible}
								onCommentPress={() => {
									hideMedia();
									onViewComments(postId, false);
								}}
								onLikePress={() => onLikePost(postId)}
							/>
						</Animated.View>
					)}
					{data.length === 1 && (
						<MediaObjectViewer
							type={currentMedia.type}
							hash={currentMedia.hash}
							resizeMode="contain"
							fullscreen={true}
							defaultScale={defaultScale}
							onMove={this.onMoveHandler}
							onPress={this.onImagePressHandler}
							style={[styles.media, { width: SCREEN_WIDTH }]}
						/>
					)}
					{data.length > 1 && (
						<View style={styles.carousel}>
							<Carousel
								data={data}
								renderItem={({ item }) => (
									<MediaObjectViewer
										type={item.type}
										hash={item.hash}
										resizeMode="contain"
										fullscreen={true}
										defaultScale={defaultScale}
										onMove={this.onMoveHandler}
										onPress={this.onImagePressHandler}
										style={[styles.media, { width: SCREEN_WIDTH }]}
									/>
								)}
								sliderWidth={SCREEN_WIDTH}
								itemWidth={SCREEN_WIDTH}
								firstItem={startIndex}
								scrollEnabled={defaultScale}
								lockScrollWhileSnapping={true}
								onSnapToItem={this.onSnapHandler}
								{...Platform.select({
									android: {
										windowSize: 5,
										initialNumToRender: 5,
									},
									ios: {
										windowSize: 3,
										initialNumToRender: 3,
									},
								})}
							/>
						</View>
					)}
				</SafeAreaView>
			</Modal>
		);
	}

	private onMoveHandler = (position?: IOnMove) => {
		if (position) {
			const { scale } = position;

			if (scale === 1 && !this.state.defaultScale) {
				this.setState({ defaultScale: true });
				this.toggleOverlay(true);
			} else if (scale !== 1 && this.state.defaultScale) {
				this.setState({ defaultScale: false });
				this.toggleOverlay(false);
			}
		}
	};

	private onImagePressHandler = () => {
		if (!this.state.defaultScale) {
			this.toggleOverlay(true);
			this.setState({ defaultScale: true });
		} else {
			if (this.state.isOverlayVisible) {
				this.toggleOverlay(false);
			} else {
				this.toggleOverlay(true);
			}
		}
	};

	private onSnapHandler = (index: number) => {
		this.setState({ activeSlide: index });
	};

	private onOverlayToggleHandler = (state: boolean) => {
		this.setState({ isOverlayVisible: state });
		Animated.timing(this.opacity, {
			toValue: state ? 1 : 0,
			duration: THROTTLE_TIME - 50,
			useNativeDriver: true,
		}).start();
	};

	private onCloseModalHandler = () => {
		this.props.hideMedia();
	};

	private toggleInfo = (state: boolean) => {
		this.setState({
			isInfoVisible: state,
		});
	};
}

export const MediaOverlay = () => (
	<WithMediaOverlay>
		{(media) => (
			<WithLiking likedByCurrentUser={media.data.likedByCurrentUser || false}>
				{(likes) => (
					<WithNavigationHandlers>
						{({ actions }) => (
							<Component
								{...media.data}
								{...media.actions}
								{...likes.actions}
								onViewComments={actions.onViewComments}
							/>
						)}
					</WithNavigationHandlers>
				)}
			</WithLiking>
		)}
	</WithMediaOverlay>
);
