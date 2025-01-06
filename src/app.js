import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:["http://localhost:5173"]
}));
app.use(express.json())
app.use(express.static('../public/upload'))
app.use(cookieParser())


// route import
import userRoute from './routes/user.routes.js'


// route declaration
app.use('/api', userRoute);

export {app}