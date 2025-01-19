import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://fascinating-marzipan-6ba2a2.netlify.app"
    ],
    credentials: true
}));
app.use(express.json())
app.use(express.static('../public/upload'))
app.use(cookieParser())


// route import
import userRoute from './routes/user.routes.js';
import destinationsRoute from './routes/destination.routes.js';


// route declaration
app.use('/api/v1', userRoute);
app.use('/api/v1', destinationsRoute);

export {app}