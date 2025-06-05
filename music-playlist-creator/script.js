const modal = document.getElementById("playlist-modal")
const closeButton = document.getElementsByClassName("close")[0];

function openModal(playlist){
    document.getElementById('playlist-name').innerText = playlist.title;
    document.getElementById('playlist-img').src = playlist.imageUrl;
    document.getElementById('creator-name').innerText = `Creator: ${playlist.creator}`;
    modal.style.display = 'block'
}

closeButton.onclick = function() {
    modal.style.display = "none"
}

window.onclick = function(event) {
    if (event.target == modal){
        modal.style.display = "none"
    }
}
