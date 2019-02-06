$("#popartists").on('click', function(event){
    console.log('hey');
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: '/main/popartists',
        type: 'GET'
    }).done(function(result){

        replace(result);
    }).fail(function(err){
        console.log(err);
    });
});

$("#topalbums").on('click', function(event){
    console.log('hey');
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: '/main/albums',
        type: 'GET'
    }).done(function(result){

        replace(result);
    }).fail(function(err){
        console.log(err);
    });
});

$("#popsongs").on('click', function(event){
    console.log('hey');
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: '/main/topsongs',
        type: 'GET'
    }).done(function(result){

        replace(result);
    }).fail(function(err){
        console.log(err);
    });
});

$("#myprofile").on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: '/main/myprofile',
        type: 'GET'
    }).done(function(result){

        replace(result);
    }).fail(function(err){
        console.log(err);
    });
});

$("#createalbum").on('click', function(event){
    console.log('hey');
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: '/main/popartists',
        type: 'GET'
    }).done(function(result){

        replace(result);
    }).fail(function(err){
        console.log(err);
    });
});

function replace(xhttp){
    var div = document.getElementById("mainbody");
    div.innerHTML = xhttp;
}
