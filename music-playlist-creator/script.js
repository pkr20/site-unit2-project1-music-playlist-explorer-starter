const modal = document.getElementById("playlist-modal");
const playlistCloseButton = modal.querySelector(".close");

const playlistGrid = document.querySelector(".playlist-grid");
let playlistsData = [];


// store liked playlists in localStorage
let likedPlaylists = JSON.parse(localStorage.getItem('likedPlaylists')) || {};


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


        // check if this playlist has been liked before
        const isLiked = likedPlaylists[playlist.playlistID] || false;
        const heartImage = isLiked ? "assets/img/heart.png" : "assets/heart-outline.png";

        playlistCard.innerHTML = `
            <img src="${imagePath}" alt="${playlist.playlist_name}" width="100px">
            <h2>${playlist.playlist_name}</h2>
            <p>${playlist.playlist_author}</p>
            <div class="likes-container">
                <img src="${heartImage}" alt="heart" width=12px class="heart-icon" data-playlist-id="${playlist.playlistID}">
                <span class="like-count">${playlist.likes || 0}</span>
            </div>
        `;

        playlistGrid.appendChild(playlistCard);
    });
}


// open modal with playlist details and songs
function openModal(playlist) {
    // set playlist details
    document.getElementById('playlist-name').innerText = playlist.playlist_name;

    // fix image path if needed
    const imagePath = playlist.playlist_art.replace('music-playlist-creator/', '');
    document.getElementById('playlist-img').src = imagePath;

    document.getElementById('modal-creator-name').innerText = `Creator: ${playlist.playlist_author}`;

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

playlistCloseButton.onclick = function() {
    modal.style.display = "none"
}

window.onclick = function(event) {
    if (event.target == modal){
        modal.style.display = "none"
    }
}
// handle heart icon clicks
function setupLikeButtons() {
    const heartIcons = document.querySelectorAll('.heart-icon');

    heartIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.stopPropagation(); // prevent opening the modal when clicking the heart

            const playlistId = this.getAttribute('data-playlist-id');
            const playlist = playlistsData.find(p => p.playlistID === playlistId);

            if (!playlist) return;

            // toggle liked state
            const isLiked = likedPlaylists[playlistId] || false;

            if (!isLiked) {
                // like the playlist
                playlist.likes = (playlist.likes || 0) + 1;
                this.src = "assets/img/heart.png";
                likedPlaylists[playlistId] = true;
            } else {
                // unlike the playlist
                playlist.likes = Math.max(0, (playlist.likes || 0) - 1);
                this.src = "assets/heart-outline.png";
                likedPlaylists[playlistId] = false;
            }

            // update the like count display
            const likeCountElement = this.nextElementSibling;
            likeCountElement.textContent = playlist.likes;

            // save liked state to localStorage
            localStorage.setItem('likedPlaylists', JSON.stringify(likedPlaylists));
        });
    });
}

// function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// event listener for shuffle button
document.addEventListener('DOMContentLoaded', () => {
    getPlaylists().then(() => {
        setupLikeButtons();

        // adding shuffle button
        const shuffleButton = document.querySelector('.shuffle-button');
        shuffleButton.addEventListener('click', () => {
            const songList = document.getElementById('song-list');
            const songs = Array.from(songList.children);
            if (songs.length > 1) {
                const shuffledSongs = shuffleArray(songs);
                songList.innerHTML = '';
                shuffledSongs.forEach(song => songList.appendChild(song));
            }
        });
    });
});




//add playlist modal elements
const addPlaylistModal = document.getElementById("add-playlist-modal");
const addPlaylistBtn = document.getElementById("add-playlist-btn");
const addPlaylistForm = document.getElementById("add-playlist-form");
const addPlaylistCloseBtn = addPlaylistModal.querySelector(".close");

//open add playlist modal
addPlaylistBtn.onclick = function() {
    addPlaylistModal.style.display = "block";
}

// close add playlist modal
addPlaylistCloseBtn.onclick = function() {
    addPlaylistModal.style.display = "none";
}

// handle add playlist form submission
addPlaylistForm.onsubmit = function(e) {
    e.preventDefault();

    //get form values
    const playlistName = document.getElementById("playlist-name").value;
    const creatorName = document.getElementById("creator-name").value;
    const playlistImage = document.getElementById("playlist-image").value;
    const songsText = document.getElementById("songs").value;

    // parse though songs
    const songs = songsText.split('\n').map(song => {
        const [title, artist, album, duration] = song.split(',').map(s => s.trim());
        return {
            title,
            artist,
            album,
            duration,
            "song-cover": playlistImage
        };
    });

    // create new playlist
    const newPlaylist = {
        playlistID: Date.now().toString(), //makes unique playlist id
        playlist_name: playlistName,
        playlist_author: creatorName,
        playlist_art: playlistImage,
        songs: songs,
        likes: 0
    };

    // add to playlists array
    playlistsData.push(newPlaylist);

    // rendering playlist
    renderPlaylists();

    // close modal and reset form
    addPlaylistModal.style.display = "none";
    addPlaylistForm.reset();
}

// close modals when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == addPlaylistModal) {
        addPlaylistModal.style.display = "none";
    }
}

//function for search bar
document.getElementById("search-bar").addEventListener("input", function (){
    const query = this.value.toLowerCase();
    const songs = document.querySelectorAll("song-list .song-item");

    songs.forEach(song => {
        const title = song.querySelector("strong").innerText.toLowerCase();
        const artist = song.querySelector("p").innerText.toLocaleLowerCase();
        
    })
})