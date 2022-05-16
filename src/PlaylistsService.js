const { Pool } = require('pg');

class PlaylistsService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT row_to_json(playlists) AS playlist 
      FROM(SELECT playlists.id, playlists.name, (SELECT json_agg(playlist_songs) AS songs
      FROM(SELECT songs.id, songs.title, songs.performer
      FROM playlist_songs INNER JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1) playlist_songs)
      FROM playlists INNER JOIN users ON playlists.owner = users.id) playlists WHERE id=$1`,
      values: [id],
    };

    const result = await this.#pool.query(query).catch((err) => {
      console.error(err.stack);
      console.error(err.message);
      throw new ServerError('Sorry, our server returned an error.', 'error');
    });

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found', 'fail');
    }

    return result.rows[0];
  }
}

module.exports = PlaylistsService;
