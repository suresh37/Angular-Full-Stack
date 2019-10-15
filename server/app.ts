import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';

import setRoutes from './routes';

const app = express();
dotenv.config();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let mongodbURI;
if (process.env.NODE_ENV === 'test') {
  console.log("mongoURI Test:" +mongodbURI)
  mongodbURI = process.env.MONGODB_TEST_URI;
} else {
  //mongodbURI = process.env.MONGODB_URI;
  mongodbURI = 'mongodb://suresh:suresh007@ds135068.mlab.com:35068/angularfullstack';
  console.log("mongoURI:" +mongodbURI)
  app.use(morgan('dev'));
}

mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI)
  .then(db => {
    console.log('Connected to MongoDB');

    setRoutes(app);

    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    if (!module.parent) {
      app.listen(app.get('port'), () => console.log(`Angular Full Stack listening on port ${app.get('port')}`));
    }
  })
  .catch(err => console.error(err));

export { app };
