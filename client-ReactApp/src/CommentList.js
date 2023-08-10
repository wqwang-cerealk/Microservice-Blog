import React from "react";
// import React, { useState, useEffect } from "react";
// import axios from 'axios';

const CommentList = ({ comments }) => {
// const CommentList = ({postId}) => {
    // const [comments, setComments] = useState([]);

    // const fetchData = async () => {
    //     const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);

    //     setComments(res.data);
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const renderedComments = comments.map(comment => {
        const status = comment.status;
        switch(status) {
            case 'approved':
                return <li key={comment.id}>{comment.content}</li>
            case 'rejected':
                const rejection = 'This comment is rejected'
                return <li key={comment.id}>{rejection}</li>
            case 'pending':
                const pending = 'This comment is awaiting moderation'
                return <li key={comment.id}>{pending}</li>
        }
        // let content;
        // if (comment.status === 'approved') {
        //     content = comment.content;
        // }

        // if (comment.status === 'rejected') {
        //     content = 'This comment is rejected';
        // }

        // if (comment.status === 'pending') {
        //     content = 'This comment is awaiting moderation';
        // }
        // return <li key={comment.id}>{content}</li>
    })

    return (
        <ul>
            {renderedComments}
        </ul>
    );
}

export default CommentList;