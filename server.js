import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = require('fastify')({
    logger: true
});
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const fs = require('fs');
console.log('__filename: ', __filename)


const __dirname = path.dirname(__filename);
console.log('__dirname: ', __dirname);

const moviesJson = fs.readFileSync(__dirname + '/data/movies.json');
const movies = JSON.parse(moviesJson);



//GET METHOD

app.get('/movies', async (req, res) => {
    res.send(movies.movieList);
});

//HEAD METHOD
app.head('/movies/:movieId', (req, res) => {
    res.headers({
    ['content-length']: Buffer.from(JSON.stringify({ movies: 'movieList' })).byteLength
});
res.send(movies.movieList);
});

//POST METHOD

app.post('/movies', async (req, res) => {
    const newMovie = req.body;
    let maxId = 0;

    for (let i = 0;i< movies.movieList.length; i++) {
    if (movies.movieList[i].id > maxId) {
        maxId = movies.movieList[i].id;
    }
}

    newMovie.id = maxId + 1;
    movies.movieList.push(newMovie);

    res.send(newMovie);
});

//PATCH METHOD

app.patch('/movies/:movieId', async (req, res) => {
    const updatedMovie = req.body;
    let moviefound = false;

    for (let i = 0; i < movies.movieList.length; i++) {
        if (movies.movieList[i].id == req.params.movieId) {
        updatedMovie.id = movies.movieList[i].id;
        moviefound = true;
        movies.movieList[i] = updatedMovie
        break;
    }
}
    if (moviefound) {
        res.send(updatedMovie);
    } else {
        const emptyResponse = {};
        res.code(404).send(emptyResponse);
    }
});

//DELETE METHOD

app.delete('/movies/:movieId', async (req, res) => {
    let movie;
    for (let i = 0; i < movies.movieList.length; i++) {
        if(movies.movieList[i].id == req.params.movieId) {
            movie = movies.movieList[i];
            movies.movieList.splice(i, 1);
            break;
        }
    }
        if (movie) {
            res.send(movie);
        } else {
            const emptyResponse = {};
            res.code(404).send(emptyResponse);
        }
})



const startServer = async () => {
    try {
        await app.listen(5000);
    } catch (err) {
        app.log.error(err);
    }
};

startServer();