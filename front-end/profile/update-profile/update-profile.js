import {
  url,
  isLogin,
  getProfile,
  getAvatar,
} from "../../js/header.js";
//import { callAPI } from "../../a/index.js";


if (isLogin()) {
  const profile = await getProfile();
  document.getElementById("current").value = profile["email"];

  //set listener
  document.getElementById("submit").addEventListener("click", updateEmail);
}

async function updateEmail() {
  var cEmail = document.getElementById("current").value;
  var nEmail = document.getElementById("new").value;

  if (cEmail && nEmail) {
    if (ValidateEmail(cEmail) && ValidateEmail(nEmail)) {
      const data = JSON.stringify({email: nEmail});
      const response = await fetch( url +
        "user/profile",{
          method: "PUT",
          headers: {
            token: sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: data,
        });
        window.location.href = "../view-profile/view-profile.html";
        // .then((response) => response.json())
        // .then((data) => {
        //   console.log(data);
        // })
        // .catch((error) => {
        //   console.log(error);
        // });
    } else {
      alert("Please enter right email!");
    }
  } else {
    alert("Please fill all fields!");
  }
}

function ValidateEmail(email) {
  var mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (mailformat.test(email)) return true;
  else return false;
}
