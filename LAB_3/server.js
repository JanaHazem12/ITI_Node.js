import express from 'express';
import routes from './index.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static('css'));

app.use(express.json());
app.use(routes);
app.use(express.static('public')); // --> localhost:3000/balloon.jpg

app.listen(3000, () => {
  console.log('Server is running on localhost:3000');
});
