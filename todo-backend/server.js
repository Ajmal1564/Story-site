//using express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// create an express app
const app = express();
//middleware to parse json request body
app.use(express.json())
app.use(cors())
// sample in memory storage 
//let todos = [];

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/tododb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//define a todo schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String,
});

//create a todo model
const todomodel = mongoose.model('Todo', todoSchema);


//create a new todo item 
app.post('/todos', (req, res) => {
     const {title,description}=req.body;
     //const newtodo = {
      //  id: todos.length + 1,
      //  title,
      //  description, 
     //};
    // todos.push(newtodo);
    //console.log(todos);

try{
     const newtodo = new todomodel({title,description});
     newtodo.save();
      res.status(201).json(newtodo);
   } catch(err){
     
     res.status(500).json({message: error.message});

   }

    

   });

//get all todo items
app.get('/todos', async (req, res) => {
    try{
       const todos = await todomodel.find()

         res.json(todos);
    }catch(err){
        console.log(err);
        res.status(500).json({message: error.message});


    }
})
 //update a todo item 
app.put("/todos/:id", async (req, res) => {
    try{
    const  id  = req.params.id;
    const { title, description } = req.body;
    const updatedtodo= await todomodel.findByIdAndUpdate(
        id,
        { title, description },
        { new: true },
    )
    if (!updatedtodo) {
        return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedtodo);
}catch(err){
    console.log(err);
    res.status(500).json({message: Error.message});
}
     
})

// delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try{
    const id = req.params.id;
    await todomodel.findByIdAndDelete(id);
     res.status(204).end();
}catch(err){
    console.log(err);
    res.status(500).json({message: error.message});
}
   
})
//start the server
const PORT = 8000;
app.listen(PORT, () => {
    console.log("Server is running to port"+PORT);
})