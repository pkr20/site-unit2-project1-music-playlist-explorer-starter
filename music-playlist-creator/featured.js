let playlistsData = [];

//fetch playlists data and display a random playlist
async function getPlaylists() {
    try {
        const response = await fetch("data/data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        playlistsData = await response.json();
        displayRandomPlaylist();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//display a random playlist
function displayRandomPlaylist() {
    if (playlistsData.length === 0) return;

    //select a random playlist
    const randomIndex = Math.floor(Math.random() * playlistsData.length);
    const playlist = playlistsData[randomIndex];

    //update playlist details
    document.getElementById('featured-playlist-title').innerText = playlist.playlist_name;
    document.getElementById('featured-creator-name').innerText = `Creator: ${playlist.playlist_author}`;
    
    //fix image path if needed
    const imagePath = playlist.playlist_art.replace('music-playlist-creator/', '');
    document.getElementById('featured-playlist-img').src = imagePath;

    //render songs
    const songList = document.getElementById('featured-song-list');
    songList.innerHTML = '';

    if (playlist.songs && playlist.songs.length > 0) {
        playlist.songs.forEach(song => {
            //fix song cover path if needed
            const songCoverPath = song["song-cover"].replace('music-playlist-creator/', '');

            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <img src="${songCoverPath}" alt="${song.title} Cover">
                <div>
                    <strong>${song.title}</strong>
                    <p>${song.artist}</p>
                    <p>${song.album}</p>
                </div>
                <span class="duration">${song.duration}</span>
            `;
            songList.appendChild(songItem);
        });
    } else {
        songList.innerHTML = '<p>No songs in this playlist</p>';
    }
}

//function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//add event listener for shuffle button
document.addEventListener('DOMContentLoaded', () => {
    getPlaylists();
    
    const shuffleButton = document.querySelector('.shuffle-button');
    shuffleButton.addEventListener('click', () => {
        const songList = document.getElementById('featured-song-list');
        const songs = Array.from(songList.children);
        if (songs.length > 1) {
            const shuffledSongs = shuffleArray(songs);
            songList.innerHTML = '';
            shuffledSongs.forEach(song => songList.appendChild(song));
        }
    });
}); 