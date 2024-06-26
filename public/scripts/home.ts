import axios from "axios";

// html
const startImgCowBody = document.querySelector(
  "#startImgCowBody"
) as HTMLImageElement;

const loginJoinContainer = document.querySelector(
  "#loginJoinContainer"
) as HTMLDivElement;
const loginIdContainer = loginJoinContainer.querySelector(
  "#login_id"
) as HTMLInputElement;
const loginPasswordContainer = loginJoinContainer.querySelector(
  "#login_password"
) as HTMLInputElement;
const loginBtn = loginJoinContainer.querySelector(
  "#loginBtn"
) as HTMLButtonElement;
const joinIdContainer = loginJoinContainer.querySelector(
  "#join_id"
) as HTMLInputElement;
const joinNickContainer = loginJoinContainer.querySelector(
  "#join_nick"
) as HTMLInputElement;
const joinPasswordContainer = loginJoinContainer.querySelector(
  "#join_password"
) as HTMLInputElement;
const joinPasswordCheckContainer = loginJoinContainer.querySelector(
  "#join_passwordCheck"
) as HTMLInputElement;
const joininviterCodeContainer = loginJoinContainer.querySelector(
  "#join_inviterCode"
) as HTMLInputElement;
const joinBtn = loginJoinContainer.querySelector(
  "#joinBtn"
) as HTMLButtonElement;

const gamePart = document.querySelector("#gamePart") as HTMLDivElement;
const mazeNameContainer = gamePart.querySelector(
  "#mazeNameContainer"
) as HTMLDivElement;
const mazeCoordContainer = gamePart.querySelector(
  "#mazeCoordContainer"
) as HTMLDivElement;
const mapBtn = gamePart.querySelector("#mapBtn") as HTMLButtonElement;

const mazePart = document.querySelector("#mazePart") as HTMLDivElement;
const mazeCanvas = mazePart.querySelector("#mazeCanvas") as HTMLCanvasElement;
const mazeCanvasCtx = mazeCanvas.getContext("2d")!;
const mazeCowContainer = mazePart.querySelector(
  "#mazeCowContainer"
) as HTMLDivElement;
const mazeCowBody = mazePart.querySelector("#mazeCowBody") as HTMLImageElement;
const mazePartWrapper = mazePart.querySelector(
  "#mazePartWrapper"
) as HTMLDivElement;

const menuBtnPart = document.querySelector("#menuBtnPart") as HTMLDivElement;
const profileBtn = menuBtnPart.querySelector(
  "#profileBtn"
) as HTMLButtonElement;
const rankBtn = menuBtnPart.querySelector("#rankBtn") as HTMLButtonElement;
const shopBtn = menuBtnPart.querySelector("#shopBtn") as HTMLButtonElement;
const inquiryBtn = menuBtnPart.querySelector(
  "#inquiryBtn"
) as HTMLButtonElement;

const hpPart = document.querySelector("#hpPart") as HTMLDivElement;
const currentHpBar = hpPart.querySelector("#currentHpBar") as HTMLDivElement;
const currentHpInfoContainer = hpPart.querySelector(
  "#currentHpInfoContainer"
) as HTMLDivElement;

const controllerPart = document.querySelector(
  "#controllerPart"
) as HTMLDivElement;
const potionAmountsContainer = controllerPart.querySelector(
  "#potionAmountsContainer"
) as HTMLDivElement;
const saveBtn = controllerPart.querySelector("#saveBtn") as HTMLButtonElement;

const outOfModals = document.querySelectorAll(
  ".outOfModal"
) as NodeListOf<HTMLDivElement>;
const modals = document.querySelectorAll(
  ".modal"
) as NodeListOf<HTMLDivElement>;
const modalQuitBtns = document.querySelectorAll(
  ".modalQuitBtn"
) as NodeListOf<HTMLButtonElement>;

const outOfProfileModal = document.querySelector(
  "#outOfProfileModal"
) as HTMLDivElement;
const profileModal = document.querySelector("#profileModal") as HTMLDivElement;
const profileModalNickContainer = profileModal.querySelector(
  "#profileModal_nick"
) as HTMLInputElement;
const nickChangeBtn = profileModal.querySelector(
  "#nickChangeBtn"
) as HTMLButtonElement;
const profileModalIdContainer = profileModal.querySelector(
  "#profileModal_id"
) as HTMLInputElement;
const logoutBtn = profileModal.querySelector("#logoutBtn") as HTMLButtonElement;
const profileModalPasswordContainer = profileModal.querySelector(
  "#profileModal_password"
) as HTMLInputElement;
const passwordChangeBtn = profileModal.querySelector(
  "#passwordChangeBtn"
) as HTMLButtonElement;
const profileModalUserCodeContainer = profileModal.querySelector(
  "#profileModal_userCode"
) as HTMLInputElement;
const leaveBtn = profileModal.querySelector("#leaveBtn") as HTMLButtonElement;
const inviteNumberContainer = profileModal.querySelector(
  "#inviteNumberContainer"
) as HTMLDivElement;

const outOfRankModal = document.querySelector(
  "#outOfRankModal"
) as HTMLDivElement;
const rankModal = document.querySelector("#rankModal") as HTMLDivElement;
const otherRankerInfoContainers = rankModal.querySelectorAll(
  ".otherRankerInfoContainer"
) as NodeListOf<HTMLDivElement>;
const myRankInfoContainer = rankModal.querySelector(
  "#myRankInfoContainer"
) as HTMLDivElement;
const rankeModalMyNickContainer = myRankInfoContainer.querySelector(
  ".rankerInfoContainer_nickContainer"
) as HTMLDivElement;
const rankeModalMyCurrentMazeLevelContainer = myRankInfoContainer.querySelector(
  ".rankerInfoContainer_currentMazeLevelContainer"
) as HTMLDivElement;

const outOfShopModal = document.querySelector(
  "#outOfShopModal"
) as HTMLDivElement;
const shopModal = document.querySelector("#shopModal") as HTMLDivElement;
const shopSellingPotionContainers = shopModal.querySelectorAll(
  ".shopSellingPotionContainer"
) as NodeListOf<HTMLDivElement>;
const shopInfoUserCode = shopModal.querySelector(
  "#shopInfoUserCode"
) as HTMLSpanElement;
const chargeCashInfo = shopModal.querySelector(
  "#chargeCashInfo"
) as HTMLDivElement;

const outOfInquiryModal = document.querySelector(
  "#outOfInquiryModal"
) as HTMLDivElement;
const inquiryModal = document.querySelector("#inquiryModal") as HTMLDivElement;

const outOfPotionPurchaseModal = document.querySelector(
  "#outOfPotionPurchaseModal"
) as HTMLDivElement;
const potionPurchaseModal = document.querySelector(
  "#potionPurchaseModal"
) as HTMLDivElement;
const potionPurchaseAgreeBtn = potionPurchaseModal.querySelector(
  "#potionPurchaseAgreeBtn"
) as HTMLButtonElement;
const potionPurchaseDisagreeBtn = potionPurchaseModal.querySelector(
  "#potionPurchaseDisagreeBtn"
) as HTMLButtonElement;

const alertModal = document.querySelector("#alertModal") as HTMLDivElement;
const outOfAlertModal = document.querySelector(
  "#outOfAlertModal"
) as HTMLDivElement;

const outOfLoadingModal = document.querySelector(
  "#outOfLoadingModal"
) as HTMLDivElement;
const loadingModal = document.querySelector("#loadingModal") as HTMLDivElement;
const loadingCowBody = loadingModal.querySelector(
  "#loadingCowBody"
) as HTMLImageElement;
const loadingCowHead = loadingModal.querySelector(
  "#loadingCowHead"
) as HTMLImageElement;

const mazeStartCoordImg = new Image();
mazeStartCoordImg.src = "/images/start.png";
const mazeDestinationCoordImg = new Image();
mazeDestinationCoordImg.src = "/images/end.png";
const upImg = new Image();
upImg.src = "/images/up.png";
const downImg = new Image();
downImg.src = "/images/down.png";
const leftImg = new Image();
leftImg.src = "/images/left.png";
const rightImg = new Image();
rightImg.src = "/images/right.png";

// common
let loadInterval: any = null;
let reload: boolean = false;
let playMode: "run" | "map" = "run";
let mazeYcoordIndex: number = 0;
let mazeXcoordIndex: number = 0;
let moveLog: ("up" | "down" | "left" | "right")[] = [];
let rankersDataWrited = false;
let currentBuyingPotionIndex: number = 0;
let myUserData: {
  id: number;
  nick: string;
  loginId: string;
  hp: number;
  potion: number;
  currentMazeLevel: number;
  currentMazeSide: number;
  currentMazeYCoord: number;
  currentMazeXCoord: number;
  currentMazeStartYCoord: number;
  currentMazeStartXCoord: number;
  currentMazeDestinationYCoord: number;
  currentMazeDestinationXCoord: number;
  currentMazeData: string;
  chargeCash: number;
  depositDeadLine: number;
  inviteNumbers: number;
} = {
  id: 0,
  nick: "",
  loginId: "",
  hp: 0,
  potion: 0,
  currentMazeLevel: 0,
  currentMazeSide: 0,
  currentMazeYCoord: 0,
  currentMazeXCoord: 0,
  currentMazeStartYCoord: 0,
  currentMazeStartXCoord: 0,
  currentMazeDestinationYCoord: 0,
  currentMazeDestinationXCoord: 0,
  currentMazeData: "",
  chargeCash: 0,
  depositDeadLine: 0,
  inviteNumbers: 0,
};
let clickInterval: any = null;
let moves: ("up" | "down" | "left" | "right")[] = [
  "up",
  "down",
  "left",
  "right",
];

// common func
const testLoginInfo = (category: "nick" | "id" | "password", text: string) => {
  let tester = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
  switch (category) {
    case "id": {
      tester = /^(?=.*[a-z0-9])[a-z0-9]{6,16}$/;
      break;
    }
    case "password": {
      tester = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
      break;
    }
  }
  return tester.test(text);
};
const renderMaze = () => {
  const {
    currentMazeSide,
    currentMazeData,
    currentMazeYCoord,
    currentMazeXCoord,
    currentMazeStartYCoord,
    currentMazeStartXCoord,
    currentMazeDestinationYCoord,
    currentMazeDestinationXCoord,
  } = myUserData;
  if (
    mazeYcoordIndex !== Math.floor(currentMazeYCoord / 10) ||
    mazeXcoordIndex !== Math.floor(currentMazeXCoord / 10)
  ) {
    mazeCowContainer.style.display = "none";
  } else {
    mazeCowContainer.style.display = "block";
    mazeCowContainer.style.top = `${(currentMazeYCoord % 10) * 10}%`;
    mazeCowContainer.style.left = `${(currentMazeXCoord % 10) * 10}%`;
  }
  const currentPartCoord: string[][] = [[], [], [], [], [], [], [], [], [], []];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const targetRoom =
        currentMazeData[
          currentMazeSide * 10 * mazeYcoordIndex +
            currentMazeSide * i +
            10 * mazeXcoordIndex +
            j
        ];
      currentPartCoord[i].push(targetRoom);
    }
  }
  let mazeDrawEnd = false;
  mazeCanvasCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  mazeCanvasCtx.fillStyle = "black";
  for (let i = 0; i < 10; i++) {
    if (mazeDrawEnd) {
      break;
    }
    for (let j = 0; j < 10; j++) {
      if (mazeDrawEnd) {
        break;
      }
      const targetRoom = currentPartCoord[i][j];
      if (targetRoom === "z") {
        mazeDrawEnd = true;
        mazeCanvasCtx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
        break;
      }
      const targetRoomNumber = parseInt(targetRoom, 16);
      const targetRoomCode = targetRoomNumber.toString(2).padStart(4, "0");
      Array.from(targetRoomCode).forEach((directAvailAble, index) => {
        if (directAvailAble === "1") {
          const directionX =
            (mazeCanvas.width / 10) * j + (mazeCanvas.width * 3) / 200;
          const directionY =
            (mazeCanvas.height / 10) * i + (mazeCanvas.height * 3) / 200;
          const directionWidth = (mazeCanvas.width * 7) / 100;
          const directionHeight = (mazeCanvas.height * 7) / 100;
          if (i === 0 && index === 3) {
            mazeCanvasCtx.drawImage(
              upImg,
              directionX,
              directionY,
              directionWidth,
              directionHeight
            );
          } else if (i === 9 && index === 2) {
            mazeCanvasCtx.drawImage(
              downImg,
              directionX,
              directionY,
              directionWidth,
              directionHeight
            );
          }
          if (j === 0 && index === 1) {
            mazeCanvasCtx.drawImage(
              leftImg,
              directionX,
              directionY,
              directionWidth,
              directionHeight
            );
          } else if (j === 9 && index === 0) {
            mazeCanvasCtx.drawImage(
              rightImg,
              directionX,
              directionY,
              directionWidth,
              directionHeight
            );
          }
          return;
        }
        const rectX =
          index === 0
            ? (mazeCanvas.width * (j + 1)) / 10 - mazeCanvas.width / 400
            : (mazeCanvas.width * j) / 10 - mazeCanvas.width / 400;
        const rectY =
          index === 2
            ? (mazeCanvas.height * (i + 1)) / 10 - mazeCanvas.height / 400
            : (mazeCanvas.height * i) / 10 - mazeCanvas.height / 400;
        const rectWidth = [2, 3].includes(index)
          ? mazeCanvas.width * 0.105
          : mazeCanvas.width / 200;
        const rectHeight = [0, 1].includes(index)
          ? mazeCanvas.height * 0.105
          : mazeCanvas.height / 200;
        mazeCanvasCtx.fillRect(rectX, rectY, rectWidth, rectHeight);
      });
    }
  }
  if (
    mazeYcoordIndex === Math.floor(currentMazeStartYCoord / 10) &&
    mazeXcoordIndex === Math.floor(currentMazeStartXCoord / 10)
  ) {
    mazeCanvasCtx.drawImage(
      mazeStartCoordImg,
      (mazeCanvas.width / 10) * (currentMazeStartXCoord % 10),
      (mazeCanvas.height / 10) * (currentMazeStartYCoord % 10),
      mazeCanvas.width / 10,
      mazeCanvas.height / 10
    );
  }
  if (
    mazeYcoordIndex === Math.floor(currentMazeDestinationYCoord / 10) &&
    mazeXcoordIndex === Math.floor(currentMazeDestinationXCoord / 10)
  ) {
    mazeCanvasCtx.drawImage(
      mazeDestinationCoordImg,
      (mazeCanvas.width / 10) * (currentMazeDestinationXCoord % 10),
      (mazeCanvas.height / 10) * (currentMazeDestinationYCoord % 10),
      mazeCanvas.width / 10,
      mazeCanvas.height / 10
    );
  }
};
const updateHp = (hpChange: number) => {
  myUserData.hp += hpChange;
  const { hp } = myUserData;
  currentHpInfoContainer.innerText = `${hp.toLocaleString("ko-KR")} / 1,000`;
  currentHpBar.style.width = `${hp / 10}%`;
};

const tryPotionDrink = () => {
  const { potion } = myUserData;
  if (potion === 0) {
    return;
  }
  myUserData.potion--;
  potionAmountsContainer.innerText = `${myUserData.potion}`;
  updateHp(1000);
};

const getCurrentRoom = () => {
  const {
    currentMazeSide,
    currentMazeData,
    currentMazeYCoord,
    currentMazeXCoord,
  } = myUserData;
  const currentRoom =
    currentMazeData[currentMazeSide * currentMazeYCoord + currentMazeXCoord];
  return currentRoom;
};

// func
const checkLoginCode = async () => {
  try {
    const loginCode = localStorage.getItem("LOGIN_CODE");
    showStartLoading();
    if (!loginCode) {
      setTimeout(() => {
        stopLoading();
        loginJoinContainer.style.display = "flex";
      }, 2000);
      return;
    }
    const res = await axios.post("/auth/checkLoginCode", {
      loginCode,
    });
    setTimeout(() => {
      stopLoading();
    }, 1000);
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    if (answer === "no user") {
      localStorage.removeItem("LOGIN_CODE");
      setTimeout(() => {
        stopLoading();
        loginJoinContainer.style.display = "flex";
      }, 2000);
      return;
    }
    const { newLoginCode, userData } = data;
    localStorage.setItem("LOGIN_CODE", newLoginCode);
    myUserData = userData;
    const {
      depositDeadLine,
      currentMazeLevel,
      currentMazeSide,
      currentMazeYCoord,
      currentMazeXCoord,
      potion,
      nick,
      loginId,
      id,
      inviteNumbers,
      chargeCash,
    } = myUserData;
    setTimeout(() => {
      if (depositDeadLine > 0 && depositDeadLine < Date.now()) {
        alertByModal("입금이 진행되지 않을 시, 계정이 정지됩니다!");
        shopModal.style.display = "flex";
        outOfShopModal.style.display = "block";
      }
      mazeNameContainer.innerText = `제${currentMazeLevel}미궁`;
      mazeCoordContainer.innerText = `(${currentMazeSide} * ${currentMazeSide})`;
      mazeYcoordIndex = Math.floor(currentMazeYCoord / 10);
      mazeXcoordIndex = Math.floor(currentMazeXCoord / 10);
      updateHp(0);
      potionAmountsContainer.innerText = `${potion}`;
      profileModalNickContainer.value = nick;
      rankeModalMyNickContainer.innerText = nick;
      profileModalIdContainer.value = loginId;
      const userCode = id.toString(36).padStart(7, "0");
      profileModalUserCodeContainer.value = userCode;
      inviteNumberContainer.innerText = `물약 획득: ${inviteNumbers}`;
      rankeModalMyCurrentMazeLevelContainer.innerText = `제${currentMazeLevel}미궁`;
      // becauseOfTest
      // shopInfoUserCode.innerText = userCode;
      // chargeCashInfo.innerText = `입금 필요 금액: ${chargeCash.toLocaleString(
      //   "ko-KR"
      // )}₩`;
      renderMaze();
      gamePart.style.display = "flex";
      stopLoading();
    }, 2000);
  } catch (err) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다!");
  }
};

// login & join
const login = async () => {
  if (loadInterval) {
    return;
  }
  const loginFailMessage =
    "해당 아이디가 존재하지 않거나, 비밀번호가 일치하지 않습니다.";
  const id = loginIdContainer.value;
  const password = loginPasswordContainer.value;
  const idTest = testLoginInfo("id", id);
  const passwordTest = testLoginInfo("password", password);
  if (!idTest || !passwordTest) {
    return alertByModal(loginFailMessage);
  }
  try {
    showLoading();
    const res = await axios.post("/auth/login", { id, password });
    const { data } = res;
    const { answer, loginCode } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "no user") {
      alertByModal(loginFailMessage);
    } else if (answer === "lock") {
      alertByModal("정지된 ID입니다!");
    }
    if (loginCode) {
      localStorage.setItem("LOGIN_CODE", loginCode);
      location.reload();
    }
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다.");
  }
};
const join = async () => {
  if (loadInterval) {
    return;
  }
  const nick = joinNickContainer.value;
  const id = joinIdContainer.value;
  const password = joinPasswordContainer.value;
  const passwordCheck = joinPasswordCheckContainer.value;
  if (!nick || !id || !password || !passwordCheck) {
    return alertByModal(
      "닉네임, 아이디, 비밀번호, 비밀번호 확인 칸을 모두 작성하세요."
    );
  }
  if (password !== passwordCheck) {
    return alertByModal("비밀번호가 일치하지 않습니다.");
  }
  const nickTest = testLoginInfo("nick", nick);
  const idTest = testLoginInfo("id", id);
  const passwordTest = testLoginInfo("password", password);
  if (!nickTest || !idTest || !passwordTest) {
    return alertByModal("닉네임, 아이디, 비밀번호를 형식에 맞게 작성하세요.");
  }
  const inviterCode = joininviterCodeContainer.value;
  try {
    showLoading();
    const res = await axios.post("/auth/join", {
      nick,
      id,
      password,
      passwordCheck,
      inviterCode,
    });
    stopLoading();
    const { data } = res;
    const { answer } = data;
    if (answer === "join success") {
      loginIdContainer.value = id;
      loginPasswordContainer.value = password;
      loginBtn.click();
    }
    if (answer === "error") {
      throw new Error();
    }
    const { nickExist, idExist } = data;
    if (nickExist || idExist) {
      return alertByModal(
        `해당 ${
          nickExist && idExist
            ? "닉네임과 아이디가"
            : nickExist
            ? "닉네임이"
            : "아이디가"
        } 존재합니다`
      );
    }
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다.");
  }
};

// game
const changePlayMode = () => {
  if (loadInterval) return;
  const { currentMazeYCoord, currentMazeXCoord } = myUserData;
  if (
    playMode === "map" &&
    (mazeYcoordIndex !== Math.floor(currentMazeYCoord / 10) ||
      mazeXcoordIndex !== Math.floor(currentMazeXCoord / 10))
  ) {
    mazeYcoordIndex = Math.floor(currentMazeYCoord / 10);
    mazeXcoordIndex = Math.floor(currentMazeXCoord / 10);
    renderMaze();
  }
  mapBtn.style.backgroundColor = playMode === "run" ? "greenyellow" : "white";
  playMode = playMode === "run" ? "map" : "run";
};

const openProfileModal = () => {
  if (loadInterval) return;
  profileModal.style.display = "flex";
  outOfProfileModal.style.display = "block";
};
const openRankModal = async () => {
  if (loadInterval) return;

  if (!rankersDataWrited) {
    try {
      showLoading();
      const loginCode = localStorage.getItem("LOGIN_CODE");
      const res = await axios.post("/user/getRankInfo", {
        loginCode,
      });
      const { data } = res;
      const { answer } = data;
      if (answer === "error") {
        throw new Error();
      }
      const { rankersData } = data;
      rankersData.forEach(
        (rankerData: { nick: string; level: number }, index: number) => {
          const targetRankerInfoContainer = otherRankerInfoContainers[index];
          const targetRankerNickContainer =
            targetRankerInfoContainer.querySelector(
              ".rankerInfoContainer_nickContainer"
            ) as HTMLDivElement;
          const targetRankerCurrentMazeLevelContainer =
            targetRankerInfoContainer.querySelector(
              ".rankerInfoContainer_currentMazeLevelContainer"
            ) as HTMLDivElement;
          const { nick, level } = rankerData;
          targetRankerNickContainer.innerText = nick;
          targetRankerCurrentMazeLevelContainer.innerText = `제${level}미궁`;
        }
      );
      rankersDataWrited = true;
      stopLoading();
    } catch (err: any) {
      stopLoading();
      reload = true;
      alertByModal("오류가 발생하여 재접속합니다.");
    }
  }
  rankModal.style.display = "flex";
  outOfRankModal.style.display = "block";
};
const openShopModal = () => {
  if (loadInterval) return;
  shopModal.style.display = "flex";
  outOfShopModal.style.display = "block";
};
const openInquiryModal = () => {
  if (loadInterval) return;
  inquiryModal.style.display = "flex";
  outOfInquiryModal.style.display = "block";
};
const enterNewMaze = async () => {
  if (loadInterval) return;
  try {
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/maze/enterNewMaze", {
      loginCode,
      moveLog,
      resultHp: myUserData.hp,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    if (answer === "no next level") {
      stopLoading();
      myUserData.hp++;
      const lastMove = moveLog[moveLog.length - 1];
      switch (lastMove) {
        case "up": {
          myUserData.currentMazeYCoord++;
          break;
        }
        case "down": {
          myUserData.currentMazeYCoord--;
          break;
        }
        case "left": {
          myUserData.currentMazeXCoord++;
          break;
        }
        case "right": {
          myUserData.currentMazeXCoord--;
          break;
        }
      }
      reload = true;
      alertByModal("아직 다음 단계의 미궁이 발견되지 않았습니다!");
      return;
    }
    const {
      currentMazeSide,
      startYCoord,
      startXCoord,
      destinationYCoord,
      destinationXCoord,
      newMazeData,
    } = data;
    myUserData.currentMazeLevel++;
    myUserData.currentMazeSide = currentMazeSide;
    myUserData.currentMazeStartYCoord = startYCoord;
    myUserData.currentMazeStartXCoord = startXCoord;
    myUserData.currentMazeYCoord = startYCoord;
    myUserData.currentMazeXCoord = startXCoord;
    myUserData.currentMazeDestinationYCoord = destinationYCoord;
    myUserData.currentMazeDestinationXCoord = destinationXCoord;
    myUserData.currentMazeData = newMazeData;
    const { currentMazeLevel } = myUserData;
    mazeNameContainer.innerText = `제${currentMazeLevel}미궁`;
    mazeCoordContainer.innerText = `(${currentMazeSide} * ${currentMazeSide})`;
    mazeYcoordIndex = Math.floor(startYCoord / 10);
    mazeXcoordIndex = Math.floor(startXCoord / 10);
    rankeModalMyCurrentMazeLevelContainer.innerText = `제${currentMazeLevel}미궁`;
    renderMaze();
    moveLog = [];
    stopLoading();
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다.");
  }
};
const enterNewPart = async () => {
  if (loadInterval) return;
  try {
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/maze/enterNewPart", {
      loginCode,
      moveLog,
      resultHp: myUserData.hp,
      resultYCoord: myUserData.currentMazeYCoord,
      resultXCoord: myUserData.currentMazeXCoord,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    const { newUserMazeData } = data;
    myUserData.currentMazeData = newUserMazeData;
    const { currentMazeYCoord, currentMazeXCoord } = myUserData;
    mazeYcoordIndex = Math.floor(currentMazeYCoord / 10);
    mazeXcoordIndex = Math.floor(currentMazeXCoord / 10);
    renderMaze();
    moveLog = [];
    stopLoading();
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다.");
  }
};
const saveCurrentData = async () => {
  if (loadInterval) return;
  if (moveLog.length === 0) return;
  try {
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/maze/saveCurrentData", {
      loginCode,
      moveLog,
      resultHp: myUserData.hp,
      resultYCoord: myUserData.currentMazeYCoord,
      resultXCoord: myUserData.currentMazeXCoord,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    moveLog = [];
    stopLoading();
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다.");
  }
};
const executeClickMoveBtn=(x:number,y:number)=>{
  if (y <= 0.5) {
    if (x <= 0.5) {
      if (y <= x) {
        clickMoveBtn("up")();
      } else {
        clickMoveBtn("left")();
      }
    } else {
      if (y <= 1 - x) {
        clickMoveBtn("up")();
      } else {
        clickMoveBtn("right")();
      }
    }
  } else {
    if (x <= 0.5) {
      if (y >= 1 - x) {
        clickMoveBtn("down")();
      } else {
        clickMoveBtn("left")();
      }
    } else {
      if (y >= x) {
        clickMoveBtn("down")();
      } else {
        clickMoveBtn("right")();
      }
    }
  }
}
const clickMoveBtn = (direction: "up" | "down" | "left" | "right") => () => {
  if (loadInterval) return;
  switch (playMode) {
    case "map": {
      const { currentMazeSide } = myUserData;
      const lastIndex = currentMazeSide / 10 - 1;
      if (direction === "up" && mazeYcoordIndex > 0) {
        mazeYcoordIndex--;
      } else if (direction === "down" && mazeYcoordIndex < lastIndex) {
        mazeYcoordIndex++;
      } else if (direction === "left" && mazeXcoordIndex > 0) {
        mazeXcoordIndex--;
      } else if (direction === "right" && mazeXcoordIndex < lastIndex) {
        mazeXcoordIndex++;
      } else {
        return;
      }
      renderMaze();
      break;
    }
    case "run": {
      const { hp } = myUserData;
      if (hp === 0) {
        return;
      }
      let currentRoom = getCurrentRoom();

      if (
        direction === "up" &&
        ["1", "3", "5", "7", "9", "b", "d", "f"].includes(currentRoom)
      ) {
        mazeCowContainer.style.transform = "rotate(180deg)";
        myUserData.currentMazeYCoord--;
        moveLog.push("up");
        const currentTopPercent = mazeCowContainer.style.top;
        mazeCowContainer.style.top = `${
          Number(currentTopPercent.slice(0, currentTopPercent.length - 1)) - 10
        }%`;
      } else if (
        direction === "down" &&
        ["2", "3", "6", "7", "a", "b", "e", "f"].includes(currentRoom)
      ) {
        mazeCowContainer.style.transform = "rotate(0deg)";
        myUserData.currentMazeYCoord++;
        moveLog.push("down");
        const currentTopPercent = mazeCowContainer.style.top;
        mazeCowContainer.style.top = `${
          Number(currentTopPercent.slice(0, currentTopPercent.length - 1)) + 10
        }%`;
      } else if (
        direction === "left" &&
        ["4", "5", "6", "7", "c", "d", "e", "f"].includes(currentRoom)
      ) {
        mazeCowContainer.style.transform = "rotate(90deg)";
        myUserData.currentMazeXCoord--;
        moveLog.push("left");
        const currentLeftPercent = mazeCowContainer.style.left;
        mazeCowContainer.style.left = `${
          Number(currentLeftPercent.slice(0, currentLeftPercent.length - 1)) -
          10
        }%`;
      } else if (
        direction === "right" &&
        ["8", "9", "a", "b", "c", "d", "e", "f"].includes(currentRoom)
      ) {
        mazeCowContainer.style.transform = "rotate(270deg)";
        myUserData.currentMazeXCoord++;
        moveLog.push("right");
        const currentLeftPercent = mazeCowContainer.style.left;
        mazeCowContainer.style.left = `${
          Number(currentLeftPercent.slice(0, currentLeftPercent.length - 1)) +
          10
        }%`;
      } else {
        return;
      }
      if (mazeCowBody.classList.contains("leftFootForward")) {
        mazeCowBody.classList.remove("leftFootForward");
        mazeCowBody.classList.add("rightFootForward");
        mazeCowBody.src = "/images/cowBodyRightFootForward.png";
      } else {
        mazeCowBody.classList.remove("rightFootForward");
        mazeCowBody.classList.add("leftFootForward");
        mazeCowBody.src = "/images/cowBodyLeftFootForward.png";
      }
      updateHp(-1);
      const {
        currentMazeDestinationYCoord,
        currentMazeDestinationXCoord,
        currentMazeYCoord,
        currentMazeXCoord,
      } = myUserData;
      currentRoom = getCurrentRoom();
      if (
        currentMazeDestinationYCoord === currentMazeYCoord &&
        currentMazeDestinationXCoord === currentMazeXCoord
      ) {
        enterNewMaze();
      } else if (currentRoom === "z") {
        enterNewPart();
      } else {
        if (
          mazeYcoordIndex !== Math.floor(currentMazeYCoord / 10) ||
          mazeXcoordIndex !== Math.floor(currentMazeXCoord / 10)
        ) {
          mazeYcoordIndex = Math.floor(currentMazeYCoord / 10);
          mazeXcoordIndex = Math.floor(currentMazeXCoord / 10);
          renderMaze();
        }
        if (myUserData.hp === 0) {
          saveBtn.click();
        }
      }
      if (myUserData.hp === 0) {
        tryPotionDrink();
      }
      break;
    }
  }
};
const quitModal = (modalIndex: number) => () => {
  if (loadInterval) return;
  const targetModal = [profileModal, rankModal, shopModal, inquiryModal][
    modalIndex
  ];
  const targetOutOfModal = [
    outOfProfileModal,
    outOfRankModal,
    outOfShopModal,
    outOfInquiryModal,
  ][modalIndex];
  targetModal.style.display = "none";
  targetOutOfModal.style.display = "none";
};
const clickUserInfoChangeBtn = (type: "nick" | "password") => async () => {
  if (loadInterval) return;
  try {
    let textContainer = profileModalNickContainer;
    let tester = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/;
    if (type === "password") {
      textContainer = profileModalPasswordContainer;
      tester = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/;
    }
    const text = textContainer.value;
    const textTest = tester.test(text);
    if (!textTest) {
      alertByModal(
        "닉네임: 2~8자 내 한글, 영어, 숫자\n\n비밀번호: 6~16자 내 영어, 숫자, 일부 특수문자(!@#$%^&*()._-)"
      );
      return;
    }
    let res: any = null;
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    switch (type) {
      case "nick": {
        res = await axios.post("/auth/changeNick", {
          loginCode,
          newNick: text,
        });
        break;
      }
      case "password": {
        res = await axios.post("/auth/changePassword", {
          loginCode,
          newPassword: text,
        });
        break;
      }
    }
    stopLoading();
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    if (answer === "nick exist") {
      alertByModal("이미 존재하는 닉네임입니다!");
      return;
    }
    alertByModal(`${type === "nick" ? "닉네임" : "비밀번호"} 변경 완료!`);
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 로그아웃됩니다!");
  }
};
const logout = () => {
  localStorage.removeItem("LOGIN_CODE");
  location.reload();
};
const leave = async () => {
  if (loadInterval) return;
  const password = profileModalNickContainer.value;
  if (!testLoginInfo("password", password)) {
    alertByModal(
      "닉네임란에 비밀번호를 입력해주세요.\n\n삭제된 계정은 복원이 불가합니다!"
    );
    return;
  }
  try {
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/auth/leave", {
      loginCode,
      password,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    if (answer === "no user") {
      alertByModal("비밀번호가 일치하지 않습니다!");
      return;
    }
    reload = true;
    alertByModal("계정이 삭제되었습니다!");
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다.");
  }
};
const clickShopSellingPotionContainer = (potionIndex: number) => () => {
  if (loadInterval) return;
  if (myUserData.chargeCash === 0) {
    currentBuyingPotionIndex = potionIndex;
    potionPurchaseModal.style.display = "flex";
    outOfPotionPurchaseModal.style.display = "block";
  } else {
    alertByModal(
      "이전 구매 건이 처리되지 않아 아직 포션을 구매하실 수 없습니다!"
    );
  }
};
const purchasePotion = async () => {
  if (loadInterval) return;
  try {
    showLoading();
    const loginCode = localStorage.getItem("LOGIN_CODE");
    const res = await axios.post("/shop/purchasePotion", {
      loginCode,
      potionIndex: currentBuyingPotionIndex,
    });
    const { data } = res;
    const { answer } = data;
    if (answer === "error") {
      throw new Error();
    }
    stopLoading();
    myUserData.chargeCash += [300, 2000, 10000][currentBuyingPotionIndex];
    chargeCashInfo.innerText = `입금 필요 금액: ${myUserData.chargeCash.toLocaleString(
      "ko-KR"
    )}₩`;
    myUserData.potion += 10 ** currentBuyingPotionIndex;
    if (myUserData.hp === 0) {
      tryPotionDrink();
      alertByModal(
        `물약 ${
          10 ** currentBuyingPotionIndex
        }개 구매 완료!\n\n물약을 1개 소모하여 체력을 회복합니다!`
      );
    } else {
      potionAmountsContainer.innerText = `${myUserData.potion}`;
      alertByModal(`물약 ${10 ** currentBuyingPotionIndex}개 구매 완료!`);
    }
    currentBuyingPotionIndex = 0;
    potionPurchaseModal.style.display = "none";
    outOfPotionPurchaseModal.style.display = "none";
  } catch (err: any) {
    stopLoading();
    reload = true;
    alertByModal("오류가 발생하여 재접속합니다.");
  }
};
const cancelPurchasePotion = () => {
  if (loadInterval) return;
  currentBuyingPotionIndex = 0;
  potionPurchaseModal.style.display = "none";
  outOfPotionPurchaseModal.style.display = "none";
};

const alertByModal = (msg: string) => {
  alertModal.innerText = msg;
  alertModal.style.display = "flex";
  outOfAlertModal.style.display = "block";
};
const showLoading = () => {
  loadingModal.style.display = "flex";
  outOfLoadingModal.style.display = "block";
  loadInterval = setInterval(() => {
    if (loadingCowBody.classList.contains("leftFootForward")) {
      loadingCowBody.classList.replace("leftFootForward", "rightFootForward");
      loadingCowBody.src = "/images/cowBodyRightFootForward.png";
    } else {
      loadingCowBody.classList.replace("rightFootForward", "leftFootForward");
      loadingCowBody.src = "/images/cowBodyLeftFootForward.png";
    }
  }, 300);
};
const showStartLoading = () => {
  loadInterval = setInterval(() => {
    if (startImgCowBody.classList.contains("leftFootForward")) {
      startImgCowBody.classList.replace("leftFootForward", "rightFootForward");
      startImgCowBody.src = "/images/cowBodyRightFootForward.png";
    } else {
      startImgCowBody.classList.replace("rightFootForward", "leftFootForward");
      startImgCowBody.src = "/images/cowBodyLeftFootForward.png";
    }
  }, 300);
};
const stopLoading = () => {
  loadingModal.style.display = "none";
  outOfLoadingModal.style.display = "none";
  clearInterval(loadInterval);
  loadInterval = null;
};

// event listeners
let lastTouch = 0;
document.addEventListener("touchend", (event: TouchEvent) => {
  const now = Date.now();
  if (now - lastTouch <= 300) {
    event.preventDefault();
  }
  lastTouch = now;
});

loginBtn.addEventListener("click", login);
joinBtn.addEventListener("click", join);

mapBtn.addEventListener("click", changePlayMode);
profileBtn.addEventListener("click", openProfileModal);
rankBtn.addEventListener("click", openRankModal);
shopBtn.addEventListener("click", openShopModal);
inquiryBtn.addEventListener("click", openInquiryModal);
if (
  navigator.userAgent.match(/mobile/i) ||
  navigator.userAgent.match(/iPad|Android|Touch/i)
) {
  mazePartWrapper.addEventListener("touchstart", (event) => {
    const mazePartWrapperRect = mazePartWrapper.getBoundingClientRect();
    const x = (event.touches[0].clientX - mazePartWrapperRect.left)/ mazePartWrapper.offsetWidth;
    const y = (event.touches[0].clientY - mazePartWrapperRect.top)/ mazePartWrapper.offsetHeight;
    executeClickMoveBtn(x,y)
  });
} else {
  mazePartWrapper.addEventListener("click", (event) => {
    const x = event.offsetX / mazePartWrapper.offsetWidth;
    const y = event.offsetY / mazePartWrapper.offsetHeight;
    executeClickMoveBtn(x,y)
  });
}
window.addEventListener("keydown", (event: KeyboardEvent) => {
  const key = event.key;
  switch (key) {
    case "ArrowUp": {
      clickMoveBtn("up")();
      break;
    }
    case "ArrowDown": {
      clickMoveBtn("down")();
      break;
    }
    case "ArrowLeft": {
      clickMoveBtn("left")();
      break;
    }
    case "ArrowRight": {
      clickMoveBtn("right")();
      break;
    }
  }
});
saveBtn.addEventListener("click", saveCurrentData);

modalQuitBtns.forEach((modalQuitBtn, index) => {
  modalQuitBtn.addEventListener("click", quitModal(index));
});
nickChangeBtn.addEventListener("click", clickUserInfoChangeBtn("nick"));
passwordChangeBtn.addEventListener("click", clickUserInfoChangeBtn("password"));
logoutBtn.addEventListener("click", logout);
leaveBtn.addEventListener("click", leave);
// becauseOfTest
// shopSellingPotionContainers.forEach((shopSellingPotionContainer, index) => {
//   shopSellingPotionContainer.addEventListener(
//     "click",
//     clickShopSellingPotionContainer(index)
//   );
// });
// potionPurchaseAgreeBtn.addEventListener("click", purchasePotion);
// potionPurchaseDisagreeBtn.addEventListener("click", cancelPurchasePotion);

alertModal.addEventListener("click", () => {
  alertModal.style.display = "none";
  outOfAlertModal.style.display = "none";
});
document.addEventListener("click", () => {
  if (reload) {
    return location.reload();
  }
});
window.addEventListener("keydown", () => {
  if (reload) {
    return location.reload();
  }
});

window.onload = checkLoginCode;
