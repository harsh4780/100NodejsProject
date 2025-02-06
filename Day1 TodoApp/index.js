const express = require('express')
const app = express();
// const bodyParser = require('body-parser');

const connect = require('./db/db');
const Post = require('./model/post');
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

connect();

app.get('/', async (req,res)=>{
    res.render('index');
});
app.get('/tasks', async (req,res)=>{
    let data = await Post.find();
    console.log(data);
    res.json(data);
});

app.post('/addPost',async(req,res)=>{
    console.log(req.body);
    const { title } = req.body; 
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const newPost = await Post.create({ title });
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the task' });
    }
       
 })
 app.get('/delete/:id', async (req,res)=>{
    const { id } = req.params;
    let deleteRequest = await Post.findByIdAndDelete(id);
    console.log(deleteRequest);
    res.redirect('/');
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})