const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	const comments = commentsByPostId[req.params.id] || [];

	res.status(201).json({
		status: 'success',
		result: comments.length,
		data: comments,
	});
});

app.post('/posts/:id/comments', async (req, res) => {
	const commentsId = randomBytes(4).toString('hex');
	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

	comments.push({ id: commentsId, content, status: 'pending' });

	commentsByPostId[req.params.id] = comments;
	try {
		await axios.post('http://events-bus-clusterip-srv:4005/events', {
			type: 'CommentCreated',
			data: {
				id: commentsId,
				content,
				postId: req.params.id,
				status: 'pending',
			},
		});
	} catch (e) {
		console.log('ERRor', e);
	}

	res.status(201).json(commentsByPostId);
});

app.post('/events', async (req, res) => {
	const { type, data } = req.body;

	if (type === 'CommentModerated') {
		const { id, postId, status, content } = data;
		const comment = commentsByPostId[postId].find(
			(comment) => comment.id === id,
		);
		comment.status = status;
		try {
			await axios.post('http://events-bus-clusterip-srv:4005/events', {
				type: 'CommentUpdated',
				data: { id, postId, status, content },
			});
		} catch (error) {
			console.log('CommentUpdated send event Error :>> ', error);
		}
	}
	res.send({});
});

app.listen(4001, () => {
	console.log('Listening comments on 4001');
});
