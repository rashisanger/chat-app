import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { PostContext } from '../../../context/PostContext';
import { motion } from 'framer-motion';
import { FaImage, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const { authUser } = useContext(AuthContext);
    const { createPost } = useContext(PostContext);

    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim() && !selectedImage) {
            toast.error('Please write something or add an image');
            return;
        }

        setIsSubmitting(true);

        try {
            let imageBase64 = null;
            if (selectedImage) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(selectedImage);
                });
            }

            const postData = {
                text: text.trim(),
                privacy: 'public',
                ...(imageBase64 && { image: imageBase64 })
            };

            const success = await createPost(postData);

            if (success) {
                setText('');
                removeImage();
                toast.success('Post created!');
            }
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
                <img
                    src={authUser?.profilePic || 'https://via.placeholder.com/40'}
                    alt={authUser?.fullName}
                    className="w-10 h-10 rounded-full border border-purple-500"
                />
                <span className="text-white font-medium">{authUser?.fullName}</span>
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                    rows="2"
                />

                {imagePreview && (
                    <div className="relative mt-2 inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 rounded-lg border border-gray-700"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between mt-3">
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <div className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition">
                            <FaImage />
                            <span className="text-sm">Photo</span>
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting || (!text.trim() && !selectedImage)}
                        className="px-4 py-1 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;