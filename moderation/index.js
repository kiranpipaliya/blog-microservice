const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
	const { type, data } = req.body;

	if (type === 'CommentCreated') {
		console.log('Moderated CommentCreated :>> ');
		const { id, content, postId } = data;
		const status = content.includes('orange') ? 'rejected' : 'approved';

		setTimeout(async () => {
			try {
				await axios.post(
					'http://events-bus-clusterip-srv:4005/events',
					{
						type: 'CommentModerated',
						data: {
							id,
							content,
							postId,
							status,
						},
					},
				);
				console.log('Moderation event sent successfully');
			} catch (error) {
				console.log('Moderation Event send Error :>> ', error);
			}
		}, 2000);
	}

	res.send({ statusbar: 'success', message: 'Comment moderation completed' });
});

app.listen(4003, () => {
	console.log('Moderation server listening on 4003');
});
