const pass_field = document.querySelector(".pass-key");
const showBtn = document.querySelector(".show");
showBtn.addEventListener("click", function () {
  if (pass_field.type === "password") {
    pass_field.type = "text";
    showBtn.textContent = "HIDE";
    showBtn.style.color = "#3498db";
  } else {
    pass_field.type = "password";
    showBtn.textContent = "SHOW";
    showBtn.style.color = "#222";
  }
});
const url = "http://localhost:2709/";
async function login() {
  const response = await fetch(url + "login", {
    method: "GET",
    withCredentials: true,
  });

  const data = await response.json();
  return data["data"];
}
const Login = async (username, password) => {
  try {
    // post (url, data, headers)
    const response = await axios.post(url + "login", {
      username: username,
      password: password,
    });
    const resMsg = response.data;
    if (resMsg.success) {
        const data = resMsg.data;
        // slug role username avatar token
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('slug', data.slug);
        sessionStorage.setItem('filename', "http://localhost:2709/image/" + data.avatar);

      window.location.href = "/front-end/course-list/courses-list.html";
    }
  } catch (error) {
    alert(error.response.data.userMsg);
  }
};
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.querySelector("#usernameInput").value;
  const password = document.querySelector("#passwordInput").value;
  if (username?.length <=0 || password?.length <=0) {
    alert("Nhap day du thong tin");
  } else 
    await Login(username, password);
});
