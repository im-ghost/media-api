const User = require('./app/v1/models/User');
const Post = require('./app/v1/models/Post');
const Like = require('./app/v1/models/Like');
const Comment = require('./app/v1/models/Comment');
const Notification = require('./app/v1/models/Notification');
const Chat = require('./app/v1/models/Chat');
const Message = require('./app/v1/models/Message');
const bcrypt = require("bcryptjs");

const connectDB = require("./app/v1/config/db");
// Function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create random posts
async function createRandomPosts(users) {
  const posts = [];

  for (const user of users) {
    const numPosts = getRandomNumber(1, 5); // Random number of posts (1-5)

    for (let i = 0; i < numPosts; i++) {
      const post = await Post.create({
        author: user._id,
        caption: `Post ${i + 1}`,
        content: `Content of Post ${i + 1}`,
      });

      posts.push(post);
      user.posts.push(post._id)
      await user.save()
    }
  }
  console.log("posts created");
  return posts;
}

// Function to create random comments from different users
async function createRandomComments(users, posts) {
  for (const post of posts) {
    const numComments = getRandomNumber(1, 5); // Random number of comments (1-5)

    for (let i = 0; i < numComments; i++) {
      const user = getRandomUser(users, post.author); // Get a random user who is not the post author

      const comment = await Comment.create({
        author: user._id,
        post: post._id,
        content: `Comment ${i + 1} on Post ${post._id}`,
      });

      post.comments.push(comment);
      await post.save();

      // Random number of likes for the comment
      const numLikes = getRandomNumber(1, 3); // Random number of likes (1-3)

      for (let j = 0; j < numLikes; j++) {
        const likeUser = getRandomUser(users, user._id); // Get a random user who is not the comment author

        const commentLike = await Like.create({
          author: likeUser._id,
          comment: comment._id,
        });

        comment.likes.push(commentLike);
        await comment.save();
      }
    }
  }
}

// Function to create random likes for posts from different users
async function createRandomLikes(users, posts) {
  for (const post of posts) {
    const numLikes = getRandomNumber(1, 3); // Random number of likes (1-3)

    for (let i = 0; i < numLikes; i++) {
      const user = getRandomUser(users, post.author); // Get a random user who is not the post author

      const like = await Like.create({
        author: user._id,
        post: post._id,
      });

      post.likes.push(like);
      await post.save();
    }
  }
}

// Function to get a random user who is not the specified user ID
function getRandomUser(users, userId) {
  const filteredUsers = users.filter((user) => String(user._id) !== String(userId));
  const randomIndex = Math.floor(Math.random() * filteredUsers.length);
  return filteredUsers[randomIndex];
}

// Function to create random users
async function createRandomUsers() {
  await connectDB();
  await User.deleteMany();
  console.log("users deleted");
  await Post.deleteMany();
  console.log("posts delete");
  await Notification.deleteMany()
  await Chat.deleteMany()
  console.log("chats deletd");
  await Comment.deleteMany()
  await Like.deleteMany()
  console.log("like deleted");
  await Message.deleteMany()
  console.log("All deleteMany");
  const numUsers = 15; // Number of users to create

  const users = [];
 const salt = await bcrypt.genSalt(10);
 
   const hash = await bcrypt.hash("pass123",salt)
  
    const pass = hash 
  for (let i = 5; i < numUsers; i++) {
    const user = await User.create({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone:`${i}${i}${i+1}${i}${i+4}`,
      bio:`User ${i+1} bio`,
      password: hash, // Set the password as desired
      image:"/default.png"
    });

    users.push(user);
  }
  console.log("Users created");
  makeUsersFollowEachOther();
  const posts = await createRandomPosts(users);
  await createRandomComments(users, posts);
  await createRandomLikes(users, posts);

  console.log('Users, posts, likes, and comments created successfully.');
}

// Call the function to create random users
createRandomUsers();



async function makeUsersFollowEachOther() {
  await connectDB()
  // Get all users from the database
  const users = await User.find();

  // Iterate through each user
  for (const currentUser of users) {
    // Generate a random index to select another user to follow
    const randomIndex = Math.floor(Math.random() * users.length);
    const userToFollow = users[randomIndex];

    // Skip if the current user is the same as the user to follow
    if (String(currentUser._id) === String(userToFollow._id)) {
      continue;
    }

    // Add the user to follow to the current user's following array
    currentUser.following.push(userToFollow._id);

    // Add the current user to the user to follow's followers array
    userToFollow.followers.push(currentUser._id);

    // Save the changes to the database
    await Promise.all([currentUser.save(), userToFollow.save()]);
  }

  console.log('Random follow relationships established successfully.');
}

// Call the function to make users follow each other

