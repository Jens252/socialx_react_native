/*
 * TO DO:
 * 1. Link onReportProblem with backend to send notification to SocialX / send e-mail to SocialX
 */

import * as React from 'react';

import { KeyboardContext, SCREENS, TABS } from '../../environment/consts';
import {
	IComment,
	ICurrentUser,
	IError,
	IGlobal,
	IMediaProps,
	INavigationProps,
	IOptionsMenuProps,
	ITranslatedProps,
	IWallPostData,
} from '../../types';

import { IPostReturnData } from '@socialx/api-data';
import { WithAggregations } from '../connectors/aggregations/WithAggregations';
import { WithI18n } from '../connectors/app/WithI18n';
import { WithNavigationParams } from '../connectors/app/WithNavigationParams';
import { WithPosts } from '../connectors/data/WithPosts';
import { WithActivities } from '../connectors/ui/WithActivities';
import { WithGlobals } from '../connectors/ui/WithGlobals';
import { WithOverlays } from '../connectors/ui/WithOverlays';
import { WithCurrentUser } from '../screens';

export interface IWallPostEnhancedData {
	post: IWallPostData;
	currentUser: ICurrentUser;
	errors: IError[];
	skeletonPost: IWallPostData;
	commentInput?: boolean;
	isCommentsScreen: boolean;
	keyboardRaised?: boolean;
	marginBottom: number;
}

export interface IWallPostEnhancedActions extends ITranslatedProps, IOptionsMenuProps {
	onImagePress: (index: number, mediaObjects: IMediaProps[], post: IWallPostData) => void;
	onRemovePost: (postId: string) => void;
	onUserPress: (userId: string) => void;
	onCommentsPress: (post: IWallPostData, keyboardRaised: boolean) => void;
	onSubmitComment: (commentText: string, postId: string) => void;
	onLikeComment: (comment: IComment) => void;
	onRemoveComment: (commentId: string) => void;
	onBlockUser: (userId: string) => void;
	onReportProblem: (subject: string, description: string) => void;
	onAddComment?: (cardHeight: number) => void;
	onGoBack: () => void;
}

interface IWithWallPostEnhancedProps {
	data: IWallPostEnhancedData;
	actions: IWallPostEnhancedActions;
}

interface IWithWallPostProps extends INavigationProps {
	children(props: IWithWallPostEnhancedProps): JSX.Element;
}

interface IWithWallPostState {}

export class WithWallPost extends React.Component<IWithWallPostProps, IWithWallPostState> {
	public render() {
		return (
			<WithI18n>
				{({ getText }) => (
					<WithNavigationParams>
						{({ setNavigationParams }) => (
							<WithOverlays>
								{({ showOptionsMenu }) => (
									<WithGlobals>
										{({ globals, setGlobal }) => (
											<WithActivities>
												{({ errors }) => (
													<KeyboardContext.Consumer>
														{({ marginBottom }) => (
															<WithAggregations>
																{({ userPosts, getUserPosts }) => (
																	<WithPosts>
																		{(feed) => (
																			<WithCurrentUser>
																				{({ currentUser }) =>
																					this.props.children({
																						data: {
																							currentUser,
																							skeletonPost: globals.skeletonPost,
																							errors,
																							marginBottom,
																						} as any,
																						actions: {
																							onImagePress: (
																								index: number,
																								mediaObjects: IMediaProps[],
																								post: IWallPostData,
																							) =>
																								this.onImagePressHandler(
																									setNavigationParams,
																									index,
																									mediaObjects,
																									post,
																								),
																							onRemovePost: (postId) =>
																								this.onRemovePostHandler(
																									setGlobal,
																									feed.removePost,
																									postId,
																								),
																							onUserPress: (userId) =>
																								this.onUserPressHandler(
																									setNavigationParams,
																									currentUser.userId,
																									userPosts,
																									getUserPosts,
																									userId,
																								),
																							onCommentsPress: (post, keyboardRaised) =>
																								this.onCommentsPressHandler(
																									setNavigationParams,
																									post,
																									keyboardRaised,
																								),
																							onSubmitComment: (text, postId) =>
																								this.onSubmitCommentHandler(
																									feed.createComment,
																									text,
																									postId,
																								),
																							onLikeComment: (comment) =>
																								this.onLikeCommentHandler(
																									feed.likeComment,
																									feed.unlikeComment,
																									comment,
																								),
																							onRemoveComment: (commentId) =>
																								feed.removeComment({ commentId }),
																							onBlockUser: () => undefined,
																							onReportProblem: () => undefined,
																							onGoBack: () => this.onGoBackHandler(),
																							showOptionsMenu: (items) =>
																								showOptionsMenu({ items }),
																							getText,
																						},
																					})
																				}
																			</WithCurrentUser>
																		)}
																	</WithPosts>
																)}
															</WithAggregations>
														)}
													</KeyboardContext.Consumer>
												)}
											</WithActivities>
										)}
									</WithGlobals>
								)}
							</WithOverlays>
						)}
					</WithNavigationParams>
				)}
			</WithI18n>
		);
	}

	private onGoBackHandler = () => {
		this.props.navigation.goBack(null);
	};

	private onImagePressHandler = (
		setNavigationParams: (input: any) => void,
		index: number,
		mediaObjects: IMediaProps[],
		post: IWallPostData,
	) => {
		const { navigation } = this.props;
		setNavigationParams({
			screenName: SCREENS.MediaViewer,
			params: {
				mediaObjects,
				startIndex: index,
				post,
			},
		});
		navigation.navigate(SCREENS.MediaViewer);
	};

	private onRemovePostHandler = async (
		setGlobal: (global: IGlobal) => void,
		removePost: ({ postId }: { postId: string }) => void,
		postId: string,
	) => {
		setGlobal({
			transparentOverlay: {
				visible: true,
				alpha: 0.5,
				loader: true,
			},
		});

		await removePost({ postId });

		setGlobal({
			transparentOverlay: {
				visible: false,
			},
		});
	};

	private onUserPressHandler = (
		setNavigationParams: (input: any) => void,
		currentUserId: string,
		userPosts: { [owner: string]: IPostReturnData[] },
		getUserPosts: ({ username }: { username: string }) => void,
		userId: string,
	) => {
		const { navigation } = this.props;

		if (userId === currentUserId) {
			navigation.navigate(SCREENS.MyProfile);
		} else {
			if (!userPosts[userId]) {
				getUserPosts({ username: userId });
			}

			setNavigationParams({
				screenName: SCREENS.UserProfile,
				params: { userId, origin: TABS.Feed },
			});
			navigation.navigate(SCREENS.UserProfile);
		}
	};

	private onCommentsPressHandler = (
		setNavigationParams: (input: any) => void,
		post: IWallPostData,
		keyboardRaised: boolean,
	) => {
		const { navigation } = this.props;

		setNavigationParams({
			screenName: SCREENS.Comments,
			params: { post, keyboardRaised },
		});
		navigation.navigate(SCREENS.Comments);
	};

	private onSubmitCommentHandler = async (
		createComment: ({ text, postId }: { text: string; postId: string }) => void,
		text: string,
		postId: string,
	) => {
		await createComment({ text, postId });
	};

	private onLikeCommentHandler = async (
		likeComment: ({ commentId }: { commentId: string }) => void,
		unlikeComment: ({ commentId }: { commentId: string }) => void,
		comment: IComment,
	) => {
		const { likedByCurrentUser, commentId } = comment;

		if (likedByCurrentUser) {
			unlikeComment({ commentId });
		} else {
			likeComment({ commentId });
		}
	};
}
