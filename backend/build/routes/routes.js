"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const User_1 = require("../model/User");
const Topic_1 = require("../model/Topic");
const Comment_1 = require("../model/Comment");
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        res.write('The server is available at the moment.');
        res.status(200).end(`Wow it's working`);
    });
    // User endpoints
    // Log in
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('User not found.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server errror.');
                        }
                        else {
                            console.log('Successful login.');
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    // Register
    router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, name, address, nickname, password, isAdmin } = req.body;
        const user = new User_1.User({ email: email, name: name, address: address, nickname: nickname, password: password, isAdmin: isAdmin });
        const isExists = yield User_1.User.findOne({ email: email });
        if (isExists) {
            console.log('This email is already taken.');
            res.status(500).send('This email is already taken.');
        }
        else {
            user.save().then(data => {
                console.log('Successfully registration.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
    }));
    // Log out
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error');
                }
                console.log('Successfully logged out.');
                res.status(200).send('Successfully log out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Delete user
    router.delete('/delete_user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const deletedUser = yield User_1.User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.status(200).send('User successfully deleted.');
        }
        else {
            res.status(404).send('User not found.');
        }
    }));
    // Get All Users
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Check user is authenticated
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    // Check user is admin
    router.get('/isAdmin', (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                res.status(200).send(true);
            }
            else {
                res.status(500).send(false);
            }
        }
        else {
            res.status(500).send(false);
        }
    });
    // Topic endpoints
    // One specific Topic
    router.get('/topic/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // TODO POSTMAN ENDPOINT TO TEST THIS
        const { topicId } = req.params;
        const topic = yield Topic_1.Topic.findById(topicId);
        if (topic) {
            console.log('Specific topic found.');
            res.status(200).send(topic);
        }
        else {
            res.status(404).send('Topic not found.');
        }
    }));
    // All Topics
    router.get('/all_topics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const topics = yield Topic_1.Topic.find();
        if (topics) {
            console.log('All the Topics successfully retrieved.');
            res.status(200).send(topics);
        }
        else {
            res.status(404).send('No topics found.');
        }
    }));
    // My Topics
    router.get('/my_topics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const topics = yield Topic_1.Topic.find({ author: req.user.email });
            if (topics) {
                console.log('My Topics successfully retrieved.');
                res.status(200).send(topics);
            }
            else {
                res.status(404).send('You have not written any topics yet.');
            }
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // New Topic
    router.post('/new_topic', (req, res) => {
        const { title } = req.body;
        if (req.isAuthenticated()) {
            const timestamp = new Date();
            const topic = new Topic_1.Topic({ author: req.user.email, title: title, timestamp: timestamp });
            topic.save().then(data => {
                console.log('Topic successfully created.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Delete Topic
    router.delete('/delete_topic/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const topicId = req.params.topicId;
        const deletedTopic = yield Topic_1.Topic.findByIdAndDelete(topicId);
        if (deletedTopic) {
            res.status(200).send('Topic successfully deleted.');
        }
        else {
            res.status(404).send('Topic not found.');
        }
    }));
    // Edit Topic
    router.put('/edit_topic/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { topicId } = req.params;
        const { title } = req.body;
        if (req.isAuthenticated()) {
            const topic = yield Topic_1.Topic.findById(topicId);
            if (topic) {
                const updatedTopic = yield Topic_1.Topic.findOneAndUpdate({ _id: topicId }, { $set: { 'title': title } }, { new: true });
                // TODO updatedTopic check needed
                res.status(200).send('Topic successfully edited.');
            }
            else {
                res.status(404).send('Topic not found.');
            }
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // Like Topic
    router.post('/like_topic/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send('Now way to like a topic yet.');
        // TODO like topic
    }));
    // Dislike Topic
    router.post('/dislike_topic/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send('Now way to dislike a topic yet.');
        // TODO dislike topic
    }));
    // Comment endpoints
    // My comments in the topics
    router.get('/my_comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { author } = req.body;
        const topics = yield Topic_1.Topic.find();
        if (topics) {
            /*const userComments = topics.reduce((acc, topic) => {
                const comments: any = topic.comments.filter(comment => comment.author === author);
                return acc.concat(comments);
            }, []);
            console.log(userComments);*/
            const userTopics = topics.map(topic => {
                const userComments = topic.comments.filter(comment => comment.author === author);
                if (userComments.length > 0) {
                    return Object.assign(Object.assign({}, topic.toObject()), { comments: userComments });
                }
                else {
                    return null;
                }
            }).filter(topic => topic !== null);
            res.status(200).send(userTopics);
        }
        else {
            res.status(404).send('No comments found.');
        }
    }));
    // New Comment
    router.post('/new_comment/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const topicId = req.params.topicId;
        const { author, comment, timestamp } = req.body;
        const newComment = new Comment_1.Comment({ author: author, comment: comment, timestamp: timestamp });
        const topic = yield Topic_1.Topic.findById(topicId);
        if (!topic) {
            res.status(404).send('Topic not found');
        }
        else {
            topic.comments.push(newComment);
            topic.save();
            console.log('Comment successfully created.');
            res.status(200).send(topic);
        }
    }));
    // Delete comment
    router.delete('/delete_comment/:topicId/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { topicId, commentId } = req.params;
        const topic = yield Topic_1.Topic.findById(topicId);
        if (topic) {
            const updatedTopic = yield Topic_1.Topic.findByIdAndUpdate(topicId, { $pull: { comments: { _id: commentId } } }, { new: true });
            // TODO check updatedTopic
            // send back topic to refresh FE data
            res.status(200).send('Comment successfully deleted.');
        }
        else {
            res.status(404).send('Comment not found.');
        }
    }));
    // Edit comment
    router.post('/edit_comment/:topicId/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { topicId, commentId } = req.params;
        const { author, comment } = req.body;
        const topic = yield Topic_1.Topic.findById(topicId);
        if (topic) {
            const updatedTopic = yield Topic_1.Topic.findOneAndUpdate({ _id: topicId, 'comments._id': commentId }, { $set: { 'comments.$.author': author, 'comments.$.comment': comment } }, { new: true });
            // TODO check updatedTopic
            res.status(200).send('Comment successfully edited.');
        }
        else {
            res.status(404).send('Topic or Comment not found.');
        }
    }));
    // Like Comment
    router.post('/like_comment/:topicId/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send('Now way to like a Comment yet.');
        // TODO like Comment
    }));
    // Dislike Comment
    router.post('/dislike_comment/:topicId/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send('Now way to dislike a Comment yet.');
        // TODO dislike Comment
    }));
    return router;
};
exports.configureRoutes = configureRoutes;
