const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const events = [];

app.post('/events', async (req, res) => {
	const event = req.body;
	console.log('event type :>> ', event.type);

	events.push(event);

	try {
		// Make asynchronous requests and await their responses
		await Promise.all([
			axios.post('http://posts-clusterip-srv:4000/events', event),
			axios.post('http://comments-clusterip-srv:4001/events', event),
			axios.post('http://query-clusterip-srv:4002/events', event),
			axios.post('http://moderation-clusterip-srv:4003/events', event),
		]);
		res.send({ status: 'OK' });
	} catch (error) {
		console.log('EVENT BUS error:', error.message);
		// Handle error and send appropriate response
		res.status(500).send({ error: 'Failed to send events to event bus' });
	}
});

app.get('/events', (req, res) => {
	res.send(events);
});

app.listen(4005, () => {
	console.log('Events Bus is listening on 4005');
});
