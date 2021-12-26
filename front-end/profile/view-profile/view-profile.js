import {
  url,
  isLogin,
  getProfile,
  getAvatar,
} from "../../js/header.js";

const UPLOAD_BUTTON = document.getElementsByClassName("upload-button")[0];
const FILE_INPUT = document.querySelector("input[type=file]");
const AVATAR = document.getElementById("avatar-image");
var file = null;

UPLOAD_BUTTON.addEventListener("click", () => FILE_INPUT.click());

FILE_INPUT.addEventListener("change", (event) => {
  file = event.target.files[0];

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    AVATAR.setAttribute("aria-label", file.name);
    AVATAR.style.background = "url(" + reader.result + ") center center/cover";
  };
});

//set listener for save button
document.getElementById("save").addEventListener("click", uploadAvatar);

/*set profile info */
if (isLogin()) {
  //get avatar
  const profile = await getProfile();

  AVATAR.style.background = "url(" + sessionStorage.getItem('filename') + ") center center/cover";
  document.getElementById("name").innerText = profile["username"];
  document.getElementById("slug").innerText = profile["slug"];
  document.getElementById("email").innerText = profile["email"];
  document.getElementById("date").innerText = new Date(
    profile["created"]
  ).toLocaleString("en-GB", { timeZone: "UTC" });

  //set progress
  const progress = await getProgress();

  const bar = document.getElementsByClassName("progress__bar");
  for(var i=0; i<bar.length; i++){
      var com = (progress[i]?.completed == 0 ? 1 : progress[i]?.completed) + "%";
      bar[i].style.background = "linear-gradient( to right, rgb(10 59 194) " + com + ", transparent " + com + ")";
      bar[i].innerText = com;
  }
}

//upload avatar
async function uploadAvatar() {
  const formData = new FormData();
  formData.set("image", file);
  const response = await fetch(url + "user/change_avatar", {
    method: "PUT",
    body: formData,
    headers: {
      token: sessionStorage.getItem("token"),
      // "Content-Type": "image",
    },
  });
  const data = await response.json();
  sessionStorage.setItem('filename', "http://localhost:2709/image/" + data.data.filename);
  window.location.reload();
}

//get progress
async function getProgress(){
  const response = await fetch(url + "progress/" + sessionStorage.getItem("slug"), {
    method: "GET",
    withCredentials: true,
    headers: {
      token: sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data['data'].progress;
}