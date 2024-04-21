const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/posts/create', async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;

	posts[id] = {
		id,
		title,
	};
	try {
		await axios.post('http://events-bus-clusterip-srv:4005/events', {
			type: 'PostCreated',
			data: { id, title },
		});

		res.status(200).json({
			status: 'success',
			message: 'Post created successfully',
			data: posts[id],
		});
	} catch (e) {
		console.log('ERROR EEE :>> ', e);
		res.status(404).json({
			status: 'fail',
			message: 'something wrong',
			data: posts[id],
		});
	}
});

app.post('/events', (req, res) => {
	console.log('EVENTS', req.body.type);
	res.send({});
});

app.listen(4000, () => {
	console.log('version 55000000');
	console.log('Listening Post on 4000');
});
