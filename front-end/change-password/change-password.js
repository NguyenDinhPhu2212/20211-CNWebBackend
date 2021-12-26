const url = "http://localhost:2709/";
const changePassword = async (password, newpass, confirmpass) => {
  try {
    // put (url, data, headers)
    const response = await axios.put(url + "user/change_password", {
      current_password: password,
      new_password: newpass,
      confirm_password: confirmpass,
    }, {
      headers:{
        token: sessionStorage.getItem('token')
      }
       
    });
    const resMsg = response.data;
    if (resMsg.success) {
      window.location.href = "/front-end/login/login.html";
    }
  } catch (error) {
    console.log(error.response)
    alert(error.response.data.userMsg);
  }
};
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const password = document.querySelector("#passwordInput").value;
  const newpass = document.querySelector("#newInput").value;
  const confirmpass = document.querySelector("#confirmInput").value;
  if (password?.length <=0 || confirmpass?.length<=0 || newpass?.length<=0) {
    alert("Nhap day du thong tin");
  } else
    await changePassword(password, newpass, confirmpass);
});