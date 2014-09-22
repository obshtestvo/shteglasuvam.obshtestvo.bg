$(document).ready(function(){
  $("#vote").hide();
    $("#login_vote").hide();
    $("#whowillvote").hide();
    $("#badge").hide();

  $.ajax({
  url: "http://shteglasuvam.obshtestvo.bg/counter.php?m=check"
  }).done(function(data){
    increment(data);
    // console.log(data);
  });
});
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
        console.log("Connected");
        $("#badge").show();

        getFaces();
    }else if(response.status === 'not_authorized'){
      console.log("not_authorized");
      getEmptyFaces();
      $("#vote").show();
        $("#whowillvote").show();
    }else{
      console.log("NOT Connected");
      getEmptyFaces();
      $("#vote").show();
      $("#whowillvote").show();
    }
  });
};    //FB Async Init    


function increment(i){
  $('#retroclockbox_counter').flipcountdown({size:'sm',
    tick:function(){
      return i;
    }
  });
}

function getFaces(){
  // console.log("Getting Faces");
  FB.api('/me/friends', {fields: 'name,photos'}, function(response) {

    console.log("Got Faces");
    var count = response.data.length;
    console.log("Count" + count);
    $("#faces").text("");
    for (var i = 0; i < (count >= 9?9:count); i++) {
      $("#faces").prepend("<img src=\"http://graph.facebook.com/"+response.data[i]["id"]+"/picture?type=square\" style=\"margin: 2px;\">");
    };
  });
}

function getEmptyFaces(){
  $("#faces").text("");
    for (var i = 0; i < 9; i++) {
    $("#faces").prepend("<img src=\"images/Man_Silhouette.png\" style=\"margin: 2px; width: 50px; height: 50px;\">");   
  };
}

function postDialog(){
  console.log('Post dialog popup.');
  FB.ui({
      method: 'feed',
      app_id: '501861616625542',
    link: 'http://shteglasuvam.obshtestvo.bg',
    picture: 'http://shteglasuvam.obshtestvo.bg/fb_logo.jpg',
    name: "ЩE ГЛАСУВАМ",
    caption: "Аз ще гласувам! Твоят глас не е важен само за изборите, а е важен и преди тях за да покаже на хората, че и други гласуват. Включи се в кампанията на http://shteglasuvam.obshtestvo.bg",    
    description: "Ще гласувам е независима кампания, целяща да увеличи избирателната активност и да покаже, че твоя глас има силата да стори промяна",
    actions: [{ name: 'action_links text!', link: 'http://shteglasuvam.obshtestvo.bg' }]
      
  }, function(response){
    $.ajax({
      url: "http://shteglasuvam.obshtestvo.bg/counter.php?m=increment"
    }).done(function(data){
      increment(data);
    });
  });
}

//This can be attached to the Login button.  
function checkLogin(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
                 
      // console.log("Connected");
      getFaces();

    }else if(response.status === 'not_authorized'){
          
          // console.log("Not Autorized");
          getEmptyFaces();
          FB.login(function(response){

            if (response.status === 'connected') {
            console.log('Welcome!  Fetching your information.... ');
            postDialog();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
            
      }, {scope: 'public_profile, user_friends'});
              
    } else {

      // console.log("NOT CONNECTED");
      $("#faces").text("");
      getEmptyFaces();
      FB.login(function(){
        document.location.reload(true); 
      }, {scope: 'public_profile, user_friends'});

    }   
    });
}


//This can be attached to the Login button.  
function who(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
                 
      console.log("Connected");
      getFaces();

    }else if(response.status === 'not_authorized'){
          
          console.log("Not Autorized");
          getEmptyFaces();
          FB.login(function(response){
            if (response.status === 'connected') {
              document.location.reload(true); 
            }
          }, {scope: 'public_profile, user_friends'});
              
    } else {

      console.log("NOT CONNECTED");
      $("#faces").text("");
      getEmptyFaces();
      FB.login(function(){
        document.location.reload(true); 
      }, {scope: 'public_profile, user_friends'});

    }   
    });
}


$("#vote").on("click",function(){
    checkLogin();
});
      
$("#login_vote").on("click",function(){
    postDialog();
});

$("#whowillvote").on("click",function(){
    who();
});



(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/bg_BG/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));