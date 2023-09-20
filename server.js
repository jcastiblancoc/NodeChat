var  express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var mongodb = require('mongodb')
var port = process.env.PORT || 5000


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


const dbUrl = 'mongodb+srv://admin:SaRa.2019@mongo-node.ntteyv6.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


var Message = new mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res)=>{
    Message.find({}, (err,messages)=>{
        res.send(messages)
    })    
})

app.post('/messages', (req, res)=>{
    var message = new Message(req.body)
    message.save()
        .then(() => {
                io.emit('message',req.body)
                res.sendStatus(200)
        })
        .catch(err => {
            console.error('Error saving message:', err);
            res.sendStatus(500);
        });
})

io.on("connection", (socket)=>{
    console.log('user connected')
})


var server = http.listen(port, () => {
    console.log('Server is listening on port %d', port)


})
