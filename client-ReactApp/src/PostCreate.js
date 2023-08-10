import React from "react";
import { useState } from "react";
import axios from "axios";

const PostCreate = () => {
    //initial state is empty string
    const [title, setTitle] = useState("");

    //We use axios to make http request to our post service and pass the value of title
    const onSubmit = async(event) => {
        event.preventDefault();

        await axios.post('http://posts.com/posts/create', {
            title
        });

        //after we successfully created a post, clear the title area for next time use
        setTitle('');
    }

    return(
        <div>
            {/* Once the form is submitted, execute the onSubmit function */}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    {/* Keep track of the current input fields values, and display them on the UI
                    attach the setTitle setter function to the onChange event handler which
                    passes the value of the input under e.target.value, then set to the title which sets
                    the value of the input*/}
                    <input 
                        value={title}
                        onChange={e => setTitle(e.target.value)} 
                        className="form-control" />
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default PostCreate;