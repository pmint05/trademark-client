// require("dotenv").config();
const bodyParser = require("body-parser");
import express, {Application, Request, Response, Router} from 'express';
import router from './routes/index';
// const port = process.env.PORT;
const port: number = 3000;
const app = express();

console.log(port);


// ROutes init
router(app);



app.listen(port, () => console.log("Application listening at http://localhost:" + port)
);