import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic, deserializeUser } from 'passport';
import { User } from '../model/User';
import { Topic } from '../model/Topic';
import { Comment } from '../model/Comment';

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {    

    router.get('/', (req: Request, res: Response) => {
        res.write('The server is available at the moment.');
        res.status(200).end(`Wow it's working`);
    });

    // User endpoints
    // Log in
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server errror.');
                        } else {
                            console.log('Successful login.');
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    // Register
    router.post('/register', async (req: Request, res: Response ) => {
        const { email, name, address, nickname, password, isAdmin } = req.body;
        const user = new User({email: email, name: name, address: address, nickname: nickname, password: password, isAdmin: isAdmin});
        const isExists = await User.findOne( {email: email} );
        if (isExists) {
            console.log('This email is already taken.');
            res.status(500).send('This email is already taken.');
        } else {
            user.save().then(data => {
                console.log('Successfully registration.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
    });

    // Log out
    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error');
                }
                console.log('Successfully logged out.');
                res.status(200).send('Successfully log out.');
            });
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Delete user
    router.delete('/delete_user/:userId', async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.status(200).send('User successfully deleted.')
        } else {
            res.status(404).send('User not found.');
        }
    });

    // Get All Users
    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Check user is authenticated
    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    // Check user is admin
    router.get('/isAdmin', (req: Request, res: Response) => {
        //const user = req.user;
        if (req.isAuthenticated()/* && user.isAdmin*/) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    // Topic endpoints
    // One specific Topic
    router.get('/topic/:topicId', async (req: Request, res: Response) => {


        // TODO POSTMAN ENDPOINT TO TEST THIS


        const { topicId } = req.params;
        const topic = await Topic.findById(topicId);
        if (topic) {
            console.log('Specific topic found.');
            res.status(200).send(topic);
        } else {
            res.status(404).send('Topic not found.');
        }
    });

    // All Topics
    router.get('/all_topics', async (req: Request, res: Response) => {
        const topics = await Topic.find();
        if (topics) {
            console.log('All the Topics successfully retrieved.');
            res.status(200).send(topics);
        } else {
            res.status(404).send('No topics found.');
        }
    });

    // My Topics
    router.get('/my_topics', async (req: Request, res: Response) => {
        const { author } = req.body;
        
        const topics = await Topic.find({ author });
        if (topics) {
            console.log('My Topics successfully retrieved.');            
            res.status(200).send(topics);
        } else {
            res.status(404).send('You have not written any topics yet.');
        }
    });

    // New Topic
    router.post('/new_topic', (req: Request, res: Response) => {
        const { author, title, timestamp } = req.body;
        const topic = new Topic({author: author, title: title, timestamp: timestamp});
        topic.save().then(data => {
            console.log('Topic successfully created.');
            
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    // Delete Topic
    router.delete('/delete_topic/:topicId', async (req: Request, res: Response) => {
        const topicId = req.params.topicId;
        const deletedTopic = await Topic.findByIdAndDelete(topicId);
        if (deletedTopic) {
            res.status(200).send('Topic successfully deleted.')
        } else {
            res.status(404).send('Topic not found.');
        }
    });
    
    // Edit Topic
    router.post('/edit_topic/:topicId', async (req: Request, res: Response) => {
        const { topicId } = req.params;
        const { author, title } = req.body;

        const topic = await Topic.findById(topicId);
        if (topic) {
            const updatedTopic = await Topic.findOneAndUpdate(
                { _id: topicId },
                { $set: { 'author': author, 'title': title } },
                { new: true }
            );
            // TODO updatedTopic check needed
            res.status(200).send('Topic successfully edited.');
        } else {
            res.status(404).send('Topic not found.');
        }
    });

    // Like Topic
    router.post('/like_topic/:topicId', async (req: Request, res: Response) => {
        res.status(404).send('Now way to like a topic yet.')
        // TODO like topic
    });

    // Dislike Topic
    router.post('/dislike_topic/:topicId', async (req: Request, res: Response) => {
        res.status(404).send('Now way to dislike a topic yet.')
        // TODO dislike topic
    });

    // Comment endpoints
    // My comments in the topics
    router.get('/my_comments', async (req: Request, res: Response) => {
        const { author } = req.body;

        const topics = await Topic.find();
        if (topics) {
            /*const userComments = topics.reduce((acc, topic) => {
                const comments: any = topic.comments.filter(comment => comment.author === author);
                return acc.concat(comments);
            }, []);
            console.log(userComments);*/

            const userTopics = topics.map(topic => {
                const userComments = topic.comments.filter(comment => comment.author === author);
                if (userComments.length > 0) {
                    return { ...topic.toObject(), comments: userComments };
                } else {
                    return null;
                }
            }).filter(topic => topic !== null);
            
            res.status(200).send(userTopics);
        } else {
            res.status(404).send('No comments found.');
        }
    });

    // New Comment
    router.post('/new_comment/:topicId', async (req: Request, res: Response) =>{
        const topicId = req.params.topicId;
        const { author, comment, timestamp } = req.body;
        const newComment = new Comment({author: author, comment: comment, timestamp: timestamp});

        const topic = await Topic.findById(topicId)
        if (!topic) {
            res.status(404).send('Topic not found');
        } else {
            topic.comments.push(newComment);
            topic.save();
            console.log('Comment successfully created.');
            res.status(200).send(topic);
        }
    });

    // Delete comment
    router.delete('/delete_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        const { topicId, commentId } = req.params;

        const topic = await Topic.findById(topicId);
        if (topic) {
            const updatedTopic = await Topic.findByIdAndUpdate(
                topicId,
                { $pull: { comments: { _id: commentId } } },
                { new: true }
            );
            // TODO check updatedTopic
            // send back topic to refresh FE data
            res.status(200).send('Comment successfully deleted.');
        } else {
            res.status(404).send('Comment not found.');
        }
        
    });

    // Edit comment
    router.post('/edit_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        const { topicId, commentId } = req.params;
        const { author, comment } = req.body;

        const topic = await Topic.findById(topicId);
        if (topic) {
            const updatedTopic = await Topic.findOneAndUpdate(
                { _id: topicId, 'comments._id': commentId },
                { $set: { 'comments.$.author': author, 'comments.$.comment': comment } },
                { new: true }
            );
            // TODO check updatedTopic
            res.status(200).send('Comment successfully edited.');
        } else {
            res.status(404).send('Topic or Comment not found.');
        }
    });

    // Like Comment
    router.post('/like_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        res.status(404).send('Now way to like a Comment yet.')
        // TODO like Comment
    });

    // Dislike Comment
    router.post('/dislike_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        res.status(404).send('Now way to dislike a Comment yet.')
        // TODO dislike Comment
    });

    return router;
}