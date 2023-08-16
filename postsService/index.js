//include express, create am express app and two routes for posting a post and retrieving a post

/**
 * Express is a Node web framework, it provides mechanisms to:
 * Write handlers for requests with different HTTP verbs at different URL paths
 * Set common web app settings like the port to use for connecting
 */

const express = require('express');
//Require randomBytes for generating random IDs
const { randomBytes } = require('crypto');
//Require body-parser to validate incoming request bodies in a middleware before handlers, available under req.body property
//As req.body's shape is based on user-controlled input, all properties and values in this object are untrusted and should be validated
//Otherwise, req.body.toString() mat fail in multiple ways
const bodyParser = require('body-parser');
//Fix CORS error
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(cors());

//For toy project, we are going to store all data in memory
//posts is where we store all posts
const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');

    //we get the post content from user's request body
    
    //can be written as:
    // const title = req.body.title;
    // const content = req.body.content;

    //Or ES6 new destructuring assignment
    const { title } = req.body;
    // const { content } = req.body;

    posts[id] = {
        id, title
    };

    //emit event to event bus 
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    })

    res.status(201).send(posts[id]);
});

//add a new post route to indicate that event-bus has successfully received the event
//every time a new post created --> post to event bus about PostCreated --> event bus post to postsService that 
//it has successfully received the event
app.post('/events', (req, res) => {
    console.log('Received Post Service Event', req.body.type);

    res.send({});
})

//Listen to what port
app.listen(4000, () => {
    console.log('Listening on 4000');
})