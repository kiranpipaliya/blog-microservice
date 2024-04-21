import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
	const [comment, setComment] = useState('');

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		await axios.post(`http://posts.com/posts/${postId}/comments`, {
			content: comment,
		});
		setComment('');
	};
	return (
		<div>
			<form onSubmit={onSubmitHandler}>
				<div className="form-group">
					<label>Comment</label>
					<input
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						type="text"
						className="form-control"
					/>
				</div>
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default CommentCreate;
