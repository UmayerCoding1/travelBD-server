import dotenv from 'dotenv';
dotenv.config({path:'../.env'});
import connectDB from './db/index.js';
import { app } from './app.js';
const port = process.env.PORT || 3000;
console.log(port);

connectDB()
.then(() => {
    app.on('error', (error) => {
        console.log('Error', error);
        throw(error)
    })
app.get('/', (req,res) => {
    res.send('TravelBD server is ready')
})


app.listen(port, () => {
    console.log(`Server running at PORT:${port}`)
})

})
.catch(err => {
    console.log(`MongoDB connect failed!!!!`, err);
})
