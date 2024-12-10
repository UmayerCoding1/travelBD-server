import dotenv from 'dotenv';
dotenv.config({path:'../.env'});
import connectDB from './db/index.js';
import { app } from './app.js';


connectDB()
.then(() => {
    app.on('error', (error) => {
        console.log('Error', error);
        throw(error)
    })
app.get('/', (req,res) => {
    res.send('TravelBD server is ready')
})


app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running at PORT:${process.env.PORT}`)
})

})
.catch(err => {
    console.log(`MongoDB connect failed!!!!`, err);
})
