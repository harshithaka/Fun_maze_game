
document.getElementById('tooltiptext').style.display = "flex";


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
   
    setTimeout(() => {
    window.location="index.html";
    }, 700);
}
