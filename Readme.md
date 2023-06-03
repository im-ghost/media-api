
# Media Api

My Node.js Media API

## Description

This is a Node.js API that allows users to take posts . Users can create, read, update, and delete posts using this API.

## Installation

To install and run the API, follow these steps:

1. Clone the repository
 `git clone https://github.com/im-ghost/media-api.git
cd media-api`
2. Install the required dependencies by running
 `yarn`
3. Create a .env file in the root directory and add your environment variables 
 `
MONGO_URI =
SECRET =
PORT = 
`
4. Run the API using `yarn server`

## Usage

To use the API, make requests to the following endpoints:

- `/api/v1/users/` (GET, POST)
- `/api/v1/users/user/:id` (PUT, DELETE, GET)
- `/api/v1/users/login` (POST)
- `/api/v1/users/:id/follow` (POST)

- `/api/v1/posts/` (GET, POST)
- `/api/v1/posts/:id` (GET)
- `/api/v1/posts/:id/like` (PUT)
- `/api/v1/posts/:id/comment` (PUT)
- `/api/v1/posts/:id/:author` (DELETE,PUT)
- `/api/v1/posts/user/:id` (GET)


All requests must include a valid JWT token in the `authorization` header.

## Routes and Endpoints

### /api/v1/users/

- `GET /api/v1/users/`: Get all users for the authenticated user.
- `POST /api/v1/users`: Create a new user.

### /api/v1/users/user/:id

- `GET /api/v1/users/user/:id`: Get a specific user by ID for the authenticated user.
- `PUT /api/v1/users/user/:id`: Update a specific user by ID for the authenticated and authorized  user.
- `DELETE /api/v1/users/user/:id`: Delete a specific user by ID for the authenticated and authorized user.

### /api/v1/users/login

- `POST /api/v1/users/user/login`: logs user in.
- 


### /api/v1/users/:id/follow

- `POST /api/v1/users/:id/follow`: To follow a user.
- 

### /api/v1/posts/

- `POST /api/v1/posts`: Create a new post.
- `GET /api/v1/posts`: Get all post.

### /api/v1/posts/post/:id

- `GET /api/v1/post/post/:id`: Get a specific post by ID for the authenticated user.

### /api/v1/post/:id/:author


- `PUT /api/v1/post/:id/:author`: Edit a specific post by ID and author id for the authenticated user.

- `DELETE /api/v1/post/post/:id`: delete a specific post by ID and author's id for the authenticated user.
-

### /api/v1/post/:id/like 

- `GET /api/v1/post/:id/like`: Like a specific post by ID for the authenticated user.
- 


### /api/v1/post/:id/comment 

- `GET /api/v1/post/:id/comment`: Comment on a specific post by ID for the authenticated user.
- 
#### All endpoints will return an error message if failed or the data if successful 


## Example Code

Here's an example of how to use the API to create a new post:

```javascript
const fetch = require('node-fetch');
const data = {
content:"..."
authorId:`${user._id}`};

fetch('http://localhost:4000/api/v1/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'authorization': `${TOKEN}`
  },
  body: JSON.stringify(data),
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.error(err));