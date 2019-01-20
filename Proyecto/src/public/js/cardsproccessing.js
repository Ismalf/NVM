
function getProfile(artist_id){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/media/'+artist_id, true);
    xhr.send();
}