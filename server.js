import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = require('fastify')({
    logger: true
});
import { readFileSync } from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
console.log('__filename: ', __filename)


const __dirname = path.dirname(__filename);
console.log('__dirname: ', __dirname);

const moviesJson = readFileSync(__dirname + '/data/movies.json');
const movies = JSON.parse(moviesJson);

app.get('/movies', async (req, res) => {
    res.send(movies.movieList);
});

app.get('/movies/:movieid', async (req, res) => {
    let movie;

    for (let i = 0; i < movies.movieList.length; i++) {
        if (movies.movieList[i].id == req.params.movieId) {
            movie = movies.movieList[i];
            break;
        }
    }
    if (movies) {
        res.send(movies);
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