const modal = document.getElementById("playlist-modal");
const closeButton = document.getElementsByClassName("close")[0];

const playlistGrid = document.querySelector(".playlist-grid");
let playlistsData = [];
//fetching data from json file
async function getPlaylists() {
    try {
        const response = await fetch("data/data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        playlistsData = await response.json();
        renderPlaylists();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//rendering playlists
function renderPlaylists() {
    //clearing content
    playlistGrid.innerHTML = "";

    // creating playlist cards

    playlistsData.forEach((playlist) => {
        const playlistCard = document.createElement("article");
        playlistCard.className = "playlist-cards";
        playlistCard.onclick = () => openModal(playlist);

        // fix image path if needed
        const imagePath = playlist.playlist_art.replace('music-playlist-creator/', '');

        playlistCard.innerHTML = `
            <img src="${imagePath}" alt="${playlist.playlist_name}" width="100px">
            <h2>${playlist.playlist_name}</h2>
            <p>${playlist.playlist_author}</p>
            <div class="likes-container">
                <img src="assets/img/heart.png" alt="heart" width=12px>
                <span class="like-count">${playlist.likes || 0}</span>
            </div>
        `;

        playlistGrid.appendChild(playlistCard);
    });
}


// open modal with playlist details and songs
function openModal(playlist) {
    // Set playlist details
    document.getElementById('playlist-name').innerText = playlist.playlist_name;

    // fix image path if needed
    const imagePath = playlist.playlist_art.replace('music-playlist-creator/', '');
    document.getElementById('playlist-img').src = imagePath;

    document.getElementById('creator-name').innerText = `Creator: ${playlist.playlist_author}`;

    // render songs
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';

    if (playlist.songs && playlist.songs.length > 0) {
        playlist.songs.forEach(song => {
            // fix song cover path if needed
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

    modal.style.display = 'block';

}

closeButton.onclick = function() {
    modal.style.display = "none"
}

window.onclick = function(event) {
    if (event.target == modal){
        modal.style.display = "none"
    }
}
// Load playlists when the page loads
document.addEventListener('DOMContentLoaded', getPlaylists);
