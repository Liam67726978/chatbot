const loginIdValidator = new FieldValidator("txtLoginId", function (val) {
  if (!val) {
    return "請填寫帳號";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "請填寫密碼";
  }
});

const form = $("form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return; //驗證未通過
  }

  const formData = new FormData(form); //瀏覽器提供的構造器，傳入一個form對象，得到一個form data對象
  const data = Object.fromEntries(formData.entries());

  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登入成功，點擊確認，跳轉到首頁");
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerText = "帳號或密碼錯誤";
  }
});
