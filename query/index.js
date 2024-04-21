const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;
		posts[id] = { id, title, comment: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;
		const post = posts[postId];
		post.comment.push({ id, content, status });
	}

	if (type === 'CommentUpdated') {
		const { id, content, postId, status } = data;
		const post = posts[postId];
		const comment = post.comment.find((comment) => comment.id === id);
		comment.status = status;
		comment.content = content;
	}
};

app.get('/posts', (req, res) => {
	res.status(201).json({
		status: 'Success',
		data: posts,
	});
});

app.post('/events', (req, res) => {
	const { type, data } = req.body;
	handleEvent(type, data);

	res.send({ statusbar: 'success', message: 'Data process' });
});

app.listen(4002, async () => {
	console.log('Query Service running on 4002');
	try {
		const res = await axios.get(
			'http://events-bus-clusterip-srv:4005/events',
		);
		console.log('res :>> ', res.data);
		for (const event of res.data) {
			console.log('Processing event:', event.type);
			handleEvent(event.type, event.data);
		}
	} catch (error) {
		console.log('query Service Event Store :>> ', error);
	}
});
