const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

//declare a new object to save all commentsById
//It will have some keys (post ID) and each key is corresponding an array of comments
/**
 *                              commentsById
 * '1qwe' --> {id: 'j325', content: 'great post'}, {id: 'r534', content: 'nice'} 
 */
const commentsById = {};

//retrieve all comments
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsById[req.params.id] || []);
})

//Post a new comment
app.post('/posts/:id/comments', async (req, res) => {
    //random generate Id for current comment
    const commentId = randomBytes(4).toString('hex');

    const { content } = req.body;
    //comments either is existed or undefeined, we can get postId from request url
    const comments = commentsById[req.params.id] || [];
    comments.push({id: commentId, content: content, status: 'pending'});
    commentsById[req.params.id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content: content,
            // We need to attach posiId with this comment
            postId: req.params.id,
            status: 'pending'
        }
    })

    res.status(201).send(comments);
});

//handle events to Comment Service
app.post('/events', async (req, res) => {
    console.log('Received Comment Service Event', req.body.type);

    const { type, data } = req.body;

    //handle CommentModerated event, updating comment status
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        //find comments associated with this posiId and find the comment with this id
        const comments = commentsById[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        //emit update event to Query Service
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                content,
                postId,
                status
            }
        })
    }

    res.send({});
})

app.listen(4001, () => {
    console.log("Listening on 4001");
});