

$('body').on('click', "#uploadbtn",function(){
  console.log('ok');
  modal = document.getElementById('myModal');
  span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
});
$('body').on('click', "#createbtn",function(){
  console.log('ok');
  modal = document.getElementById('createModal');
  span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
});

$('body').on('click', "#closecr", function(){
  modal.style.display = "none";
  //$('#myModal').css('display', 'none');
});

$('body').on('click', "#uploadmedia", function(){
  $('#myModal').on('click', function(){
    $(this).css('display', 'none');
  });
});
$('body').on('click', "#createalbum", function(){
  $('#createModal').on('click', function(){
    $(this).css('display', 'none');
  });
});
// When the user clicks the button, open the modal
/*btn.onclick = function() {
    console.log('ok');
    modal.style.display = "block";
}*/

//$('body').on('click', "#.close",function(){
  //console.log('ok');
  //modal.style.display = "block";
//});
// When the user clicks on <span> (x), close the modal

span.onclick = function(event){
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {

  if (event.target == modal) {
    modal.style.display = "none";
  }
}
