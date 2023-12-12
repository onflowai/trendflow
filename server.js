import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
//setting up access to .env
dotenv.config();
//evoking app
const app = express();

//if we are in dev log the data if not do not
if (process.env.NODE_ENV === 'development') {
  //HTTP request LOGGER middleware for Node calling dev
  app.use(morgan('dev'));
}

//setting up middleware json
app.use(express.json());

//app responding to get requests home rout with controller that handles the requests
app.get('/', (req, res) => {
  res.send('hello world');
});
//POST request
app.post('/', (req, res) => {
  console.log(req);
  res.json({ message: 'data received', data: req.body });
});
//this is done so that the hosting platform can inject the any value into the port with env
const port = process.env.PORT || 5100;

//listener on port 5100
app.listen(port, () => {
  console.log(`server is running here: ${port}`);
});
