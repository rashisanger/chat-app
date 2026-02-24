import React, { useContext } from 'react';
import { PostContext } from '../../../context/PostContext';
import Post from './Post';

const PostList = () => {
    const { feedPosts, loading } = useContext(PostContext);

    if (loading && feedPosts.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400">Loading posts...</div>
            </div>
        );
    }

    if (feedPosts.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-900/30 rounded-xl">
                <p className="text-gray-400">No posts yet. Be the first to post!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {feedPosts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
};

export default PostList;