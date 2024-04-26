const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
//Using EJS as model engine
//Using views directory
app.set('views', './views');
//Using a static directory
app.engine('ejs', require('ejs').renderFile);
app.use(
    express.static(path.resolve(__dirname, "public/"))
)
app.use(bodyParser.urlencoded({ extended: true}));

const movieSchema = new mongoose.Schema({
    title : String ,
    duration : Number,
    director : String, 
    releaseYear : Number,
    genre : String,
    raiting : Number,
    image : String,
})
const Movie = mongoose.model('Movie', movieSchema);

async function connect(){
    try{
        await mongoose.connect('mongodb://0.0.0.0:27017/mydatabase', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }catch(error){
        console.log('Looks like you have an error \n', error);
    }
}
async function disconnect() {
    try{
        await mongoose.disconnect();
    }catch(error){
        console.log('Looks like you have an error \n', error);
    }
}

app.get('/', async (req, res) => {
    try{
        await connect();
        const data = await Movie.find({}) 
        res.status(200).render('index.ejs', {data})
        // res.status(200).send(data)
    }catch(error){
        res.status(500).send(error)
    }    
})

app.get('/pelicula/:id', async (req, res) => {
    try{
        await connect();
        const id =  req.params.id;
        const movie = await Movie.findOne({_id: id})
        res.status(200).render('detalle.ejs', {movie})
        // res.status(200).send(movie);
    }catch(error){
        res.status(200).send(error)
    }
})  

app.post('/', async (req, res) => {
    await saveData();
    res.send('gaaaaaa')
})

app.get('/addMovie', (req, res) => {
    res.render('addMovie.ejs');
})

app.post('/addMovie', async (req, res) =>{
    const title = req.body.title;
    console.log(title);
    const duration = req.body.duration;
    console.log(duration);
    const director = req.body.director;
    console.log(director);
    const releaseYear = req.body.releaseYear;
    console.log(releaseYear);
    const genre = req.body.genre;
    console.log(genre);
    const raiting = req.body.raiting;
    console.log(raiting);
    const image =  req.body.image;
    console.log(image);

    try{
        await connect(); 
        const pelicula = new Movie({
            title : title ,
            duration : duration,
            director : director, 
            releaseYear : releaseYear,
            genre : genre,
            raiting : raiting,
            image: image
        });
        await pelicula.save()
        res.status(200).redirect('/')
    }catch(error){
        res.status(500).redirect('/');
    }finally{
        await disconnect();
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`You are connected to a test server web => http://localhost:${PORT} `)
})