// var mainApp ={};

document.getElementById('tooltiptext').style.display = "flex";
var profileInfo =[];
(function(){
   
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //      user.providerData.forEach((profile) => {
    //         // console.log("  Provider-specific UID: " + profile.uid);
    //         // console.log("  Name: " + profile.displayName);
    //         // console.log("  Email: " + profile.email);
    //         // console.log("  Photo URL: " + profile.photoURL);
    //         document.getElementById("account").innerHTML =  profile.displayName[0];
    //         profileInfo = profile;
    //         var tooltip = document.querySelector('#account');
    //         // const app = initializeApp(firebaseConfig);
    //         // const database = getDatabase(app);
            
    //         // set(ref(database,'users/'+userId),{
    //         //     name:profile.displayName,
    //         //     email:profile.email
    //         // });
            
            
           
    //         event.stopPropagation();
    //         document.getElementById('tooltiptext').style.display = "flex";
    //             tooltip.addEventListener('click', function() {;
    //                 if(event.target.id === "account"){
    //                     document.getElementById('tooltiptext').style.display = "flex";
    //                 }
    //                 var tooltiptext = document.querySelector('.tooltiptext')
    //                 document.getElementById('tooltiptext').style.display = "flex";
    //             if (tooltiptext.classList.contains('active')) {
    //                 tooltiptext.classList.remove('active');
    //                 tooltiptext.innerHTML = " ";
    //             } else {
    //                 tooltiptext.classList.add('active');
    //                 var button = document.createElement('div');
    //                 button.className = "button";
    //                 button.innerHTML =  profile.displayName[0];
    //                 tooltiptext.appendChild(button)
    //                 var name = document.createElement('div');
    //                 name.className ="name";
    //                 name.innerHTML = profile.displayName
    //                 tooltiptext.appendChild(name);
    //                 var div = document.createElement('div');
    //                 div.className ="email";
    //                 div.innerHTML = profile.email
    //                 tooltiptext.appendChild(div);
    //                 var signdiv = document.createElement('div');
    //                 signdiv.className ="sign-out";
    //                 signdiv.innerHTML = "Sign Out"
    //                 tooltiptext.appendChild(signdiv)
    //                 document.querySelector('.sign-out').addEventListener('click', logout)
    //                // signdiv.addEventListener("click", logout());
    //             }
                
    //             });
          
    //       });
    //     } else {
    //       window.location = "login.html"
    //     }
    //   }); 

})()

function hideDiv() {
    var target = event.target || event.srcElement;
    // filter event handling when the event bubbles
    if (event.currentTarget == target) {
        document.getElementById('tooltiptext').style.display = "none";
        if (document.getElementById('tooltiptext').classList.contains('active')) {
            document.getElementById('tooltiptext').classList.remove('active');
            document.getElementById('tooltiptext').innerHTML = " ";
        } 
    }
    else{
        document.getElementById('tooltiptext').style.display = "flex";
    }

}
function logout(){
    window.location="login.html"
}
function GotoPage(){
    // var x = document.getElementById("myAudio")
    // x.play(); 
    setTimeout(() => {
    window.location="index.html";
    }, 700);
}