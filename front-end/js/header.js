const url = "http://localhost:2709/";
var username = ""
function isLogin() {
  if (sessionStorage.getItem("token")) {
    const token = sessionStorage.getItem("token");
    username = sessionStorage.getItem("username");
    //set username
    document.getElementById("username").innerText = username;

    //set listener
    document.getElementById("logout").addEventListener("click", logout);
    getAvatar();
    return true;
  } else {
    return false;
  }
}

//get profile
async function getProfile() {
  const response = await fetch(url + "user/profile/" + sessionStorage.getItem("slug"), {
    method: "GET",
    withCredentials: true,
    headers: {
      token: sessionStorage.getItem('token'),
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data["data"];
}

//get avatar
 function getAvatar() {
  document.getElementById("avatar").src = sessionStorage.getItem("filename");
}

//log out
async function logout() {
  const response = await fetch(url + "logout", {
    method: "POST",
    headers: {
      token: sessionStorage.getItem('token'),
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  window.location.href = window.location.origin + "/front-end/home-page/home.html";
}

export { url, getAvatar, isLogin, logout, getProfile };
