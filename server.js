import express from 'express';
//evoking app
const app = express();
//app responding to get requests home rout with controller that handles the requests
app.get('/', (req, res) => {
  res.send('hello world');
});

//listener on port 5100
app.listen(5100, () => {
  console.log('server is running');
});
