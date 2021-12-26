const url = "http://localhost:2709/";
const signin = async (username, email , password,confirmpass) => {
  try {
    // post (url, data, headers)
    const response = await axios.post(url + "user", {
      username: username,
      email:email,
      password: password,
      password_confirm: confirmpass,
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
    alert(error.response.userMsg);
  }
};
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.querySelector("#usernameInput").value;
  const email = document.querySelector("#emailInput").value;
  const password = document.querySelector("#passwordInput").value;
  const confirmpass = document.querySelector("#confirmpassInput").value;
  if (username?.length <=0 ||email?.length<=0 ||password?.length <=0 || confirmpass?.length<=0) {
    alert("Nhap day du thong tin");
  } else
    await signin(username, email,password,confirmpass);
});