(async function () {
  //驗證是否有登入，如果沒有登入跳轉到登入頁
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("登入失敗，點擊確定跳轉至登入頁");
    location.href = "./login.html";
    return;
  }

  // 以下為登入狀態代碼
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    messageContainer: $(".msg-container"),
  };

  // 註銷事件
  doms.close.addEventListener("click", () => {
    API.loginOut();
    location.href = "./login.html";
  });

  // 載入歷史聊天紀錄
  loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    resp.data.forEach((item) => addChat(item));
    scrollBottom();
  }

  // 滾動聊天窗到最後
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  // 設置用戶訊息
  setUserInfo();
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  // 根據消息對象，將消息添加到頁面中
  function addChat({ content, createdAt, from }) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (from) {
      div.classList.add("me");
    }

    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const contentDiv = $$$("div");
    contentDiv.classList.add("chat-content");
    contentDiv.innerText = content;

    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formatDate(createdAt);

    div.appendChild(img);
    div.appendChild(contentDiv);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  // 格式化時間戳
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // 發送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({
      from: user.loginId,
      to: null,
      createAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }

  // 發送消息事件
  doms.messageContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    sendChat();
  });
})();
