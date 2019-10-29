const express = require('express');
const bodyParser = require('body-parser')

//Load query
const query = require('./query.json')

//Initialize app to express
const app = express();

//BodyParser middleware
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({
  status: true,
  message: "Welcome to app Please send query like below",
  query: query
}));

//Routes
app.use('/task', require('./routes/task'))

//Creating port
const PORT = 5000;

app.listen(PORT,
  console.log(`Server is started on port ${PORT}`),
  console.log(`Please visit: http://localhost:${PORT}`),
);