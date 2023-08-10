const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Data schema of posts data structure
// posts === {
//     '123qwe': {
//         id: '123qwe',
//         title: 'post title',
//         comments(array of objects): [
//             {id: 'klj32a', content: 'comment!'}
//         ]
//     }
// }
const posts = {};

//Extract handleEvent 
const handleEvent = (type, data) => {
    //If event type is PostCreated, req data has id and title
    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = {id, title, comments: []};
    }

    //If event type is CommentCreated, req data has id, title, postId, comment status
    if (type === 'CommentCreated') {
        const { id, content, status, postId } = data;
        
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        const comment = posts[postId].comments.find(comment  => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;
    handleEvent(type, data);
    res.send({});
});

//When we start to listening, we should make a request over to event bus to list
//all events up to current time
app.listen(4002, async () => {
    console.log('Listening on 4002');
    try {
        const res = await axios.get('http://event-bus-srv:4005/events');

        //Every time we use axios, the return result is saving in the response.data 
        for (let event of res.data) {
            console.log("Processing event", event.type);

            handleEvent(event.type, event.data);
        }
    } catch(error) {
        console.log(error.message);
    }
    
});