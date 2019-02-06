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

$("#artistcard").on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    console.log($('#album_artist').text());
    $.ajax({

        url: '/profile/'+$('#album_artist').text(),
        type: 'GET'
    }).done(function(result){

        replace(result);
    }).fail(function(err){
        console.log(err);
    });
});
$('body').on('click', "#artistcard",function(event){
  event.preventDefault();
  event.stopPropagation();
  console.log($('#album_artist').text());
  $.ajax({

      url: '/profile/'+$('#album_artist').text(),
      type: 'GET'
  }).done(function(result){

      replace(result);
  }).fail(function(err){
      console.log(err);
  });
});
$('body').on('click', "#artistcards",function(event){
  event.preventDefault();
  event.stopPropagation();
  console.log($('#user_name').text());
  $.ajax({
      url: '/subscribe/'+$('#user_name').text(),
      type: 'POST'
  }).done(function(result){

      replace(result);
  }).fail(function(err){
      console.log(err);
  });
});

$("from#dataform").submit(function(event){
    console.log('hey');
    event.preventDefault();
    event.stopPropagation();
    var formData = new FormData(this);
    $.ajax({
        url: '/create_album',
        type: 'POST',
        data: formData,
        success: function (data) {
            alert(data)
        },
        cache: false,
        contentType: false,
        processData: false
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

function replacesimple(xhttp){
  var div = document.getElementById("albumoptions");
  div.innerHTML = xhttp;
}
