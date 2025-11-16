import pool from './db/db.js';
import axios from 'axios';

async function putMoviePosters() {
    const sql = `select * from movies`;
    const [result] = await pool.promise().query(sql);
    const url = `http://www.omdbapi.com/?apikey=4c84660e`;

    const poster = [];
    for (let i = 0; i < result.length; i++) {
        const e = result[i];
        try {
            const movie = await axios.get(url + `&t=${encodeURIComponent(e.title)}`);
            const posterUrl = movie.data.Poster;
            const average_rating = movie.data.Ratings[0].Value.split('/')[0];
            const sql = `Update movies set poster_url = ?, average_rating = ? where id = ?`;
            const values = [posterUrl, average_rating, e.id];
            await pool.promise().query(sql, values);
        //     console.log(e.id)

        } catch (err) {
            console.error(`Failed to fetch poster for ${e.title}:`, err.message);
            poster.push(null);
        }
    }

}

putMoviePosters();