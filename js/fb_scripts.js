var baseUrl = location.protocol + '//' + location.host + '/';
var app = {
  counter: 0,
  firstVisit: {},
  loggedIn: {
    voted: {},
    notVoted: {}
  }
}

$(document).ready(function(){
  app.$intro = $('.intro');
  app.$footer = $('footer');
  var $introClone = app.$intro.clone()
  $introClone.addClass('duplicate').find('.more, .disclaimer').remove()
  $introClone.insertBefore(app.$footer)

  app.firstVisit.$containers = $('.firstVisit')
  app.loggedIn.voted.$containers = $('.loggedVoted')
  app.loggedIn.notVoted.$containers = $('.loggedNotVoted')

  app.firstVisit.$voteTriggers = app.firstVisit.$containers.find('.vote')
  app.firstVisit.$whoTriggers = app.firstVisit.$containers.find('.whowillvote')

  app.loggedIn.notVoted.$voteTriggers = app.loggedIn.notVoted.$containers.find('.login_vote');

  app.$faces = $('.faces')
  app.$counters = $('.count')

  app.firstVisit.$containers.hide()
  app.loggedIn.voted.$containers.hide()
  app.loggedIn.notVoted.$containers.hide()

  app.firstVisit.$whoTriggers.on("click",function(){
    who();
  });

  app.firstVisit.$voteTriggers.on("click",function(){
    checkLogin();
  });

  app.loggedIn.notVoted.$voteTriggers.on("click",function(){
    postDialog();
  });

  var $map = $('#map');
  var mapLoaded = false;
  $map.waypoint(function() {
    if (!mapLoaded) {
      mapLoaded=true;
      $map.attr('src', $map.data('src'))
    }
  }, {
    offset: 200
  })

  $.ajax({
      url: baseUrl  + "counter.php?m=check"
  }).done(function(data){
    app.$counters.text(data)
  });
});


var notLoggedIn = function() {
  app.firstVisit.$containers.show();
}

//FB Async Init
window.fbAsyncInit = function() {

  FB.init({
    appId      : '501861616625542',
    xfbml      : true,
    status     : true,
    cookie     : true,
    version    : 'v2.1'
  }); 

  FB.getLoginStatus(function(response) {
    if(response.status === 'connected') {
      var voted = docCookies.getItem("voted");
      if (voted) {
        app.loggedIn.voted.$containers.show();
        $('.duplicate').remove()
      } else {
        app.loggedIn.notVoted.$containers.show();
      }
      updateFaces();
    } else if (response.status === 'not_authorized'){
      notLoggedIn()
    } else {
      notLoggedIn()
    }
  });
}; //FB Async Init


function updateFaces(){
  FB.api('/me/friends', {fields: 'name,photos'}, function(response) {
    var count = response.data.length;
    for (var i = 0; i < count; i++) {
      app.$faces.append('<img title="'+response.data[i].name+'" src="http://graph.facebook.com/'+response.data[i].id+'/picture?type=square&width=60&height=60">');
    }
    // top up until 10
    for (var i = 0; i < 10-count; i++) {
      app.$faces.append('<img src="images/who.png" alt="" class="placeholder"/>');
    }
  });
}

function postDialog(){
  FB.ui({
    method: 'feed',
    app_id: '501861616625542',
    link: baseUrl,
    picture: baseUrl + "fb_logo.jpg",
    name: "ЩE ГЛАСУВАМ",
    description: "Ще гласувам е независима кампания, целяща да увеличи избирателната активност и да покаже, че твоя глас има силата да стори промяна",
    actions: [{ name: 'И аз ще гласувам!', link: 'http://www.shteglasuvam.com' }]
  }, function(response) {
    $.ajax({
      url: baseUrl + "counter.php?m=increment"
    }).done(function(data) {
      docCookies.setItem("voted", "true", Infinity);
      document.location.reload(true);
    });
  });
}

//This can be attached to the Login button.  
function checkLogin(){
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      updateFaces();
    } else {
      FB.login(function(response) {
        if (response.status === 'connected') {
          postDialog();
        } else {
           //User cancelled login or did not fully authorize.
        }
      }, {scope: 'public_profile, user_friends'});
    }
  });
}

function who(){
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      updateFaces();
    } else if (response.status === 'not_authorized'){
      FB.login(function(response){
        if (response.status === 'connected') {
          document.location.reload(true);
        }
      }, {scope: 'public_profile, user_friends'});
    } else {
      FB.login(function(){
        document.location.reload(true);
      }, {scope: 'public_profile, user_friends'});
    }
  });
}


$(function () {
  $('.popup-modal').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#username',
    modal: true
  });
  $(document).on('click', '.popup-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });
});


(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/bg_BG/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



if (top.location!= self.location)
{
top.location = self.location
}



function FacebookInviteFriends()
{
  FB.ui({
    method: 'apprequests',
    message: 'Покани твои приятели да гласуват.'
  });
}
