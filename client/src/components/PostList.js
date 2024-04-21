import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchPost = async () => {
		const res = await axios.get('http://posts.com/posts');
		console.log('res.data :>> ', res.data);
		setPosts(Object.values(res.data.data));
		setLoading(false);
	};
	useEffect(() => {
		try {
			fetchPost();
		} catch (error) {
			setError(true);
			setLoading(false);
		}
	}, []);

	console.log('Object.values(posts) :>> ', posts);

	if (loading) {
		return <h1>Loading ...</h1>;
	}
	console.log('posts :>> ', posts);

	return (
		<div className="d-flex flex-row flex-wrap justify-content-between">
			{!error &&
				!loading &&
				posts.map((post) => {
					return (
						<div
							key={post.id}
							className="card"
							style={{ width: '30%', marginBottom: '20px' }}
						>
							<div className="card-body">
								<h3>{post.title}</h3>
								<CommentList comments={post.comment} />
								<CommentCreate postId={post.id} />
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default PostList;
