var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname){
    for(tablink of tablinks){
        tablink.classList.remove("active-link");
    }
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab");  
   }
   event.currentTarget.classList.add("active-link");
   document.getElementById(tabname).classList.add("active-tab")
}


window.addEventListener("scroll",function(){
    var navbar = document.querySelector("nav");
    var newlogo = document.getElementById("logo")
    if(window.scrollY > 0){
        navbar.classList.add("sticky");
        newlogo.src = "logo.png";
    }
    else{
        navbar.classList.remove("sticky");
        newlogo.src = "logo.png";

    }

})


function sendMail(){
    let parms = {
    name : document.getElementById("name").value,
    message : document.getElementById("msg").value,
    phone : document.getElementById("ph_num").value,
    email : document.getElementById("email_id").value,
}
emailjs.send("service_3imse18","template_3tbpepl",parms).then(alert("Message Sent"));
}