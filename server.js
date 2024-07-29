const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mainRouter = require('./Router/mainRouter');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb+srv://astiksharma26:tE0rBUIopfFWeRaX@cluster0.efnags3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));
  
app.use(cors());
app.use(bodyParser.json());
app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
