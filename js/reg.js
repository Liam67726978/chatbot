const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "請填寫帳號";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    // 帳號已存在
    return "帳號已存在，請重新選擇一個新帳號名稱";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "請填寫暱稱";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "請填寫密碼";
  }
});

const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  function (val) {
    if (!val) {
      return "請填寫確認密碼";
    }
    if (val !== loginPwdValidator.input.value) {
      return "確認密碼與密碼輸入不相同";
    }
  }
);

const form = $("form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!result) {
    return; //驗證未通過
  }

  const formData = new FormData(form); //瀏覽器提供的構造器，傳入一個form對象，得到一個form data對象
  const data = Object.fromEntries(formData.entries());

  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("註冊成功");
    location.href = "./login.html";
  }
});
