
function getProfile(artist_id){
  console.log('artistttt');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/profile/'+artist_id, true);
    xhr.send();
}

function subscribe(username){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/subscribe/'+artist_id, true);
  xhr.send();
}
