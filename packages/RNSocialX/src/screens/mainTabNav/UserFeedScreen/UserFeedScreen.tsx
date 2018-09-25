/**
 * TODO list:
 * 1. resetNavigationToRoute, old repo. Internals/backend/actions/navigation.ts
 * 1.1 we can do this at the top level, without navigation
 * 2. Implement getAvatarImage (check IPFS)
 */

import * as React from 'react';
import {Animated, Dimensions, FlatList, Platform} from 'react-native';
import {AnimatedValue, NavigationScreenProp} from 'react-navigation';

import {IWithUserFeedEnhancedActions, IWithUserFeedEnhancedData} from '../../../enhancers/screens';

// import {ipfsConfig as base} from 'configuration';
import {FEED_TYPES, OS_TYPES} from '../../../environment/consts';
import {IMediaProps, IWallPostCardData} from '../../../types';
import {SHARE_SECTION_HEIGHT, USER_PLACEHOLDER_AVATAR} from './UserFeedScreen.style';
import {UserFeedScreenView} from './UserFeedScreen.view';

const AVAILABLE_SCREEN_HEIGHT = Dimensions.get('window').height;
const TOTAL_SCREEN_HEIGHT = Dimensions.get('screen').height;

export interface IFeedProps {
	shareSectionPlaceholder: string | null;
	feedType: FEED_TYPES;
}

export interface INavigationProps {
	navigation: NavigationScreenProp<any>;
}

interface IUserFeedScreenState {}

type IUserFeedScreenProps = INavigationProps & IFeedProps & IWithUserFeedEnhancedData & IWithUserFeedEnhancedActions;

export class Screen extends React.Component<IUserFeedScreenProps, IUserFeedScreenState> {
	private readonly scrollRef: React.RefObject<FlatList<IWallPostCardData>> = React.createRef();
	private scrollY: AnimatedValue = new Animated.Value(0);

	public render() {
		const {
			currentUser,
			posts,
			shareSectionPlaceholder,
			hasMorePosts,
			refreshingFeed,
			loadingMorePosts,
			loadingFeed,
			getText,
			deletePost,
			blockUser,
			reportProblem,
		} = this.props;

		const shareSectionOpacityInterpolation = this.scrollY.interpolate({
			inputRange: [0, SHARE_SECTION_HEIGHT / 2, SHARE_SECTION_HEIGHT],
			outputRange: [1, 0.3, 0],
			extrapolate: 'clamp',
		});

		return (
			<UserFeedScreenView
				avatarImage={this.getAvatarImage()}
				wallPosts={posts}
				refreshing={refreshingFeed}
				onRefresh={this.onRefreshHandler}
				hasMorePosts={hasMorePosts}
				loadingMorePosts={loadingMorePosts}
				onLoadMorePosts={this.onLoadMorePostsHandler}
				onShowNewWallPostPress={this.showNewWallPostPage}
				currentUser={currentUser}
				noPosts={posts.length === 0}
				shareSectionPlaceholder={shareSectionPlaceholder}
				shareSectionOpacityInterpolation={shareSectionOpacityInterpolation}
				scrollRef={this.scrollRef}
				scrollY={this.scrollY}
				isLoading={loadingFeed}
				getText={getText}
				onImagePress={this.onMediaObjectPressHandler}
				onLikeButtonPress={this.onLikePressHandler}
				onUserPress={this.gotoUserProfile}
				onSubmitComment={this.onSubmitCommentHandler}
				onCommentPress={this.onCommentsButtonPressHandler}
				onAddComment={this.onAddCommentPressHandler}
				onDeletePress={deletePost}
				onBlockUser={blockUser}
				onReportProblem={reportProblem}
			/>
		);
	}

	private getAvatarImage = () => {
		// let ret = USER_PLACEHOLDER_AVATAR;
		// const {data} = this.props;
		// if (!data.loading) {
		// 	const avatarHash = data ? (data.user.avatar ? data.user.avatar.hash : null) : null;
		// 	if (avatarHash) {
		// 		ret = {uri: base.ipfs_URL + avatarHash};
		// 	}
		// }
		return USER_PLACEHOLDER_AVATAR;
	};

	private onLoadMorePostsHandler = async () => {
		const {loadPosts, feedType} = this.props;

		if (!this.props.loadingMorePosts && !this.props.refreshingFeed) {
			loadPosts(feedType);
		}
	};

	private showNewWallPostPage = () => {
		const {currentUser, navigation} = this.props;
		navigation.navigate('CreateWallPostScreen', {
			fullName: currentUser.fullName,
			avatarImage: this.getAvatarImage(),
			afterPostCreate: this.onRefreshHandler,
		});
	};

	private onRefreshHandler = async () => {
		const {refreshFeed, feedType} = this.props;

		if (!this.props.refreshingFeed && !this.props.loadingMorePosts) {
			refreshFeed(feedType);
		}
	};

	private onLikePressHandler = (likedByMe: boolean, postId: string) => {
		const {likePost, unlikePost} = this.props;

		if (likedByMe) {
			unlikePost(postId);
		} else {
			likePost(postId);
		}

		return !likedByMe;
	};

	private gotoUserProfile = (userId: string) => {
		this.props.navigation.navigate('UserProfileScreen', {userId});
	};

	private onMediaObjectPressHandler = (index: number, medias: IMediaProps[]) => {
		this.props.navigation.navigate('MediaViewerScreen', {
			mediaObjects: medias,
			startIndex: index,
		});
	};

	private onCommentsButtonPressHandler = (postId: string, startComment: boolean) => {
		this.props.navigation.navigate('CommentsScreen', {postId, startComment});
	};

	private onAddCommentPressHandler = (index: number, cardHeight: number) => {
		if (!this.props.refreshingFeed && !this.props.loadingMorePosts && this.scrollRef.current) {
			this.scrollRef.current.scrollToIndex({
				animated: true,
				index,
				viewOffset: this.calculateScrollOffset(cardHeight, index),
				viewPosition: 0,
			});
		}
	};

	private onSubmitCommentHandler = (escapedComment: string, postId: string) => {
		this.props.postComment(escapedComment, postId);
	};

	private calculateScrollOffset = (cardHeight: number, index: number) => {
		const baseScreenHeight = 667;
		let idealOffset;
		let idealCardHeight;
		let diff;
		if (AVAILABLE_SCREEN_HEIGHT >= 667) {
			if (index === 0 && cardHeight < 300) {
				return 0;
			}

			idealOffset = 235;
			idealCardHeight = 490;
			diff = idealCardHeight - cardHeight;
		} else {
			idealOffset = 265;
			idealCardHeight = 480;
			diff = idealCardHeight - cardHeight;
		}
		const offset = (baseScreenHeight * idealOffset) / AVAILABLE_SCREEN_HEIGHT;

		if (Platform.OS === OS_TYPES.Android) {
			const softwareButtonsBarHeight = TOTAL_SCREEN_HEIGHT - AVAILABLE_SCREEN_HEIGHT;
			return -(offset - diff + softwareButtonsBarHeight);
		}

		return -(offset - diff);
	};
}
