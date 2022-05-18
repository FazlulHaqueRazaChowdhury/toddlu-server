
//importing
const express = require('express');
const app = express();
const cors = require('cors');

//port 
const port = process.env.PORT || 4000;


app.get('/', (req, res) => {
    res.send('The server is running');
})
app.listen(port, () => {
    console.log('Listening to the port', port);
})