import * as React from 'react';
import { connect, ConnectedComponentClass } from 'react-redux';
import { createSelector } from 'reselect';

import { IApplicationState } from '../../../store';
import {
	createPost,
	getPostByPath,
	getUserPosts,
	IPost,
	IPostLikeInput,
	IPostPathInput,
	likePost,
	loadMoreFriendsPosts,
	loadMorePosts,
	refreshFriendsPosts,
	refreshGlobalPosts,
	removePost,
	unlikePost,
} from '../../../store/data/posts';
import { IThunkDispatch } from '../../../store/types';
import { ICreatePost } from '../../../types';

interface IDataProps {
	all: {
		[postId: string]: IPost;
	};
	global: {
		canLoadMore: boolean;
		posts: string[];
	};
	friends: {
		canLoadMore: boolean;
		posts: string[];
	};
}

interface IActionProps {
	loadMorePosts: (init?: boolean) => void;
	loadMoreFriendsPosts: (init?: boolean) => void;
	getUserPosts: (alias: string) => void;
	getPostByPath: (getPostByPathInput: IPostPathInput) => void;
	createPost: (post: ICreatePost) => void;
	removePost: (postId: string) => void;
	likePost: (input: IPostLikeInput) => void;
	unlikePost: (input: IPostLikeInput) => void;
	refreshFriendsPosts: () => void;
	refreshGlobalPosts: () => void;
}

type IProps = IDataProps & IActionProps;

interface IChildren {
	children: (props: IProps) => JSX.Element;
}

class Enhancer extends React.Component<IProps & IChildren> {
	render() {
		const { children, ...props } = this.props;
		return children(props);
	}
}

const selectAllPosts = createSelector(
	(state: IApplicationState) => state.data.posts.all,
	(posts) => posts,
);

const selectGlobalPosts = createSelector(
	(state: IApplicationState) => state.data.posts.global.posts,
	(posts) => posts,
);

const selectGlobalCanLoad = createSelector(
	(state: IApplicationState) => state.data.posts.global.canLoadMore,
	(canLoad) => canLoad,
);

const selectFriendsPosts = createSelector(
	(state: IApplicationState) => state.data.posts.friends.posts,
	(posts) => posts,
);

const selectFriendsCanLoad = createSelector(
	(state: IApplicationState) => state.data.posts.friends.canLoadMore,
	(canLoad) => canLoad,
);

const mapStateToProps = (state: IApplicationState) => ({
	all: selectAllPosts(state),
	global: {
		posts: selectGlobalPosts(state),
		canLoadMore: selectGlobalCanLoad(state),
	},
	friends: {
		posts: selectFriendsPosts(state),
		canLoadMore: selectFriendsCanLoad(state),
	},
});

const mapDispatchToProps = (dispatch: IThunkDispatch) => ({
	loadMorePosts: (init: boolean) => dispatch(loadMorePosts(init)),
	loadMoreFriendsPosts: (init: boolean) => dispatch(loadMoreFriendsPosts(init)),
	getUserPosts: (alias: string) => dispatch(getUserPosts(alias)),
	getPostByPath: (getPostPathInput: IPostPathInput) => dispatch(getPostByPath(getPostPathInput)),
	createPost: (post: ICreatePost) => dispatch(createPost(post)),
	removePost: (postId: string) => dispatch(removePost(postId)),
	likePost: (input: IPostLikeInput) => dispatch(likePost(input)),
	unlikePost: (input: IPostLikeInput) => dispatch(unlikePost(input)),
	refreshFriendsPosts: () => dispatch(refreshFriendsPosts()),
	refreshGlobalPosts: () => dispatch(refreshGlobalPosts()),
});

export const WithPosts: ConnectedComponentClass<JSX.Element, IChildren> = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Enhancer as any) as any;
