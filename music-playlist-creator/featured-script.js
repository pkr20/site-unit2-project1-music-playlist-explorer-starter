// Function to display a random playlist on the Featured page
const displayRandomPlaylist = () => {
    const randomIndex = Math.floor(Math.random() * data.playlists.length);
    const playlist = data.playlists[randomIndex];

    // Update the HTML with the playlist details
    document.querySelector('.playlist-image').innerHTML = `<img src="${playlist.playlist_art}" alt="Playlist Cover">`;
    document.querySelector('.playlist-name').textContent = playlist.playlist_name;

    const songList = document.querySelector('.song-list');
    songList.innerHTML = '';
    playlist.songs.forEach(song => {
        const songItem = document.createElement('li');
        songItem.classList.add('song-item');
        songItem.innerHTML = `
            <img src="${song.cover_art}" alt="${song.title} Cover" class="song-cover">
            <div class="song-info">
                <span class="song-title">${song.title}</span>
                <span class="song-artist">${song.artist}</span>
                <span class="song-album">${song.album}</span>
                <span class="song-duration">${song.duration}</span>
            </div>
        `;
        songList.appendChild(songItem);
    });
};

// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', displayRandomPlaylist);
