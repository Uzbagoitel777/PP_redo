const express = require('express');
const app = express();

const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Yes the API works' });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});