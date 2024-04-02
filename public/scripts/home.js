"use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const axios = __importDefault(require("axios"));
// html
const startImgCowBody = document.querySelector("#startImgCowBody");
const loginJoinContainer = document.querySelector("#loginJoinContainer");
const loginIdContainer = loginJoinContainer.querySelector("#login_id");
const loginPasswordContainer = loginJoinContainer.querySelector("#login_password");
const loginBtn = loginJoinContainer.querySelector("#loginBtn");
const joinIdContainer = loginJoinContainer.querySelector("#join_id");
const joinNickContainer = loginJoinContainer.querySelector("#join_nick");
const joinPasswordContainer = loginJoinContainer.querySelector("#join_password");
const joinPasswordCheckContainer = loginJoinContainer.querySelector("#join_passwordCheck");
const joininviterCodeContainer = loginJoinContainer.querySelector("#join_inviterCode");
const joinBtn = loginJoinContainer.querySelector("#joinBtn");
const gamePart = document.querySelector("#gamePart");
const mazeNameContainer = gamePart.querySelector("#mazeNameContainer");
const mazeCoordContainer = gamePart.querySelector("#mazeCoordContainer");
const mapBtn = gamePart.querySelector("#mapBtn");
const mazePart = document.querySelector("#mazePart");
const mazeCanvas = mazePart.querySelector("#mazeCanvas");
const mazeCanvasCtx = mazeCanvas.getContext("2d");
const mazeCowContainer = mazePart.querySelector("#mazeCowContainer");
const mazeCowBody = mazePart.querySelector("#mazeCowBody");
const menuBtnPart = document.querySelector("#menuBtnPart");
const profileBtn = menuBtnPart.querySelector("#profileBtn");
const rankBtn = menuBtnPart.querySelector("#rankBtn");
const shopBtn = menuBtnPart.querySelector("#shopBtn");
const inquiryBtn = menuBtnPart.querySelector("#inquiryBtn");
const hpPart = document.querySelector("#hpPart");
const currentHpBar = hpPart.querySelector("#currentHpBar");
const currentHpInfoContainer = hpPart.querySelector("#currentHpInfoContainer");
const controllerPart = document.querySelector("#controllerPart");
const potionAmountsContainer = controllerPart.querySelector("#potionAmountsContainer");
const upBtn = controllerPart.querySelector("#upBtn");
const leftBtn = controllerPart.querySelector("#leftBtn");
const rightBtn = controllerPart.querySelector("#rightBtn");
const downBtn = controllerPart.querySelector("#downBtn");
const moveBtns = [upBtn, downBtn, leftBtn, rightBtn];
const saveBtn = controllerPart.querySelector("#saveBtn");
const outOfModals = document.querySelectorAll(".outOfModal");
const modals = document.querySelectorAll(".modal");
const modalQuitBtns = document.querySelectorAll(".modalQuitBtn");
const outOfProfileModal = document.querySelector("#outOfProfileModal");
const profileModal = document.querySelector("#profileModal");
const profileModalNickContainer = profileModal.querySelector("#profileModal_nick");
const nickChangeBtn = profileModal.querySelector("#nickChangeBtn");
const profileModalIdContainer = profileModal.querySelector("#profileModal_id");
const logoutBtn = profileModal.querySelector("#logoutBtn");
const profileModalPasswordContainer = profileModal.querySelector("#profileModal_password");
const passwordChangeBtn = profileModal.querySelector("#passwordChangeBtn");
const profileModalUserCodeContainer = profileModal.querySelector("#profileModal_userCode");
const leaveBtn = profileModal.querySelector("#leaveBtn");
const inviteNumberContainer = profileModal.querySelector("#inviteNumberContainer");
const outOfRankModal = document.querySelector("#outOfRankModal");
const rankModal = document.querySelector("#rankModal");
const otherRankerInfoContainers = rankModal.querySelectorAll(".otherRankerInfoContainer");
const myRankInfoContainer = rankModal.querySelector("#myRankInfoContainer");
const rankeModalMyNickContainer = myRankInfoContainer.querySelector(".rankerInfoContainer_nickContainer");
const rankeModalMyCurrentMazeLevelContainer = myRankInfoContainer.querySelector(".rankerInfoContainer_currentMazeLevelContainer");
const outOfShopModal = document.querySelector("#outOfShopModal");
const shopModal = document.querySelector("#shopModal");
const shopSellingPotionContainers = shopModal.querySelectorAll(".shopSellingPotionContainer");
const shopInfoUserCode = shopModal.querySelector("#shopInfoUserCode");
const chargeCashInfo = shopModal.querySelector("#chargeCashInfo");
const outOfInquiryModal = document.querySelector("#outOfInquiryModal");
const inquiryModal = document.querySelector("#inquiryModal");
const outOfPotionPurchaseModal = document.querySelector("#outOfPotionPurchaseModal");
const potionPurchaseModal = document.querySelector("#potionPurchaseModal");
const potionPurchaseAgreeBtn = potionPurchaseModal.querySelector("#potionPurchaseAgreeBtn");
const potionPurchaseDisagreeBtn = potionPurchaseModal.querySelector("#potionPurchaseDisagreeBtn");
const alertModal = document.querySelector("#alertModal");
const outOfAlertModal = document.querySelector("#outOfAlertModal");
const outOfLoadingModal = document.querySelector("#outOfLoadingModal");
const loadingModal = document.querySelector("#loadingModal");
const loadingCowBody = loadingModal.querySelector("#loadingCowBody");
const loadingCowHead = loadingModal.querySelector("#loadingCowHead");
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
let loadInterval = null;
let reload = false;
let playMode = "run";
let mazeYcoordIndex = 0;
let mazeXcoordIndex = 0;
let moveLog = [];
let rankersDataWrited = false;
let currentBuyingPotionIndex = 0;
let myUserData = {
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
let clickInterval = null;
let moves = [
    "up",
    "down",
    "left",
    "right",
];
// common func
const testLoginInfo = (category, text) => {
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
    const { currentMazeSide, currentMazeData, currentMazeYCoord, currentMazeXCoord, currentMazeStartYCoord, currentMazeStartXCoord, currentMazeDestinationYCoord, currentMazeDestinationXCoord, } = myUserData;
    if (mazeYcoordIndex !== Math.floor(currentMazeYCoord / 10) ||
        mazeXcoordIndex !== Math.floor(currentMazeXCoord / 10)) {
        mazeCowContainer.style.display = "none";
    }
    else {
        mazeCowContainer.style.display = "block";
        mazeCowContainer.style.top = `${(currentMazeYCoord % 10) * 10}%`;
        mazeCowContainer.style.left = `${(currentMazeXCoord % 10) * 10}%`;
    }
    const currentPartCoord = [[], [], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const targetRoom = currentMazeData[currentMazeSide * 10 * mazeYcoordIndex +
                currentMazeSide * i +
                10 * mazeXcoordIndex +
                j];
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
                    const directionX = (mazeCanvas.width / 10) * j + (mazeCanvas.width * 3) / 200;
                    const directionY = (mazeCanvas.height / 10) * i + (mazeCanvas.height * 3) / 200;
                    const directionWidth = (mazeCanvas.width * 7) / 100;
                    const directionHeight = (mazeCanvas.height * 7) / 100;
                    if (i === 0 && index === 3) {
                        mazeCanvasCtx.drawImage(upImg, directionX, directionY, directionWidth, directionHeight);
                    }
                    else if (i === 9 && index === 2) {
                        mazeCanvasCtx.drawImage(downImg, directionX, directionY, directionWidth, directionHeight);
                    }
                    if (j === 0 && index === 1) {
                        mazeCanvasCtx.drawImage(leftImg, directionX, directionY, directionWidth, directionHeight);
                    }
                    else if (j === 9 && index === 0) {
                        mazeCanvasCtx.drawImage(rightImg, directionX, directionY, directionWidth, directionHeight);
                    }
                    return;
                }
                const rectX = index === 0
                    ? (mazeCanvas.width * (j + 1)) / 10 - mazeCanvas.width / 400
                    : (mazeCanvas.width * j) / 10 - mazeCanvas.width / 400;
                const rectY = index === 2
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
    if (mazeYcoordIndex === Math.floor(currentMazeStartYCoord / 10) &&
        mazeXcoordIndex === Math.floor(currentMazeStartXCoord / 10)) {
        mazeCanvasCtx.drawImage(mazeStartCoordImg, (mazeCanvas.width / 10) * (currentMazeStartXCoord % 10), (mazeCanvas.height / 10) * (currentMazeStartYCoord % 10), mazeCanvas.width / 10, mazeCanvas.height / 10);
    }
    if (mazeYcoordIndex === Math.floor(currentMazeDestinationYCoord / 10) &&
        mazeXcoordIndex === Math.floor(currentMazeDestinationXCoord / 10)) {
        mazeCanvasCtx.drawImage(mazeDestinationCoordImg, (mazeCanvas.width / 10) * (currentMazeDestinationXCoord % 10), (mazeCanvas.height / 10) * (currentMazeDestinationYCoord % 10), mazeCanvas.width / 10, mazeCanvas.height / 10);
    }
};
const updateHp = (hpChange) => {
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
    const { currentMazeSide, currentMazeData, currentMazeYCoord, currentMazeXCoord, } = myUserData;
    const currentRoom = currentMazeData[currentMazeSide * currentMazeYCoord + currentMazeXCoord];
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
        const res = await axios.default.post("/auth/checkLoginCode", {
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
        const { depositDeadLine, currentMazeLevel, currentMazeSide, currentMazeYCoord, currentMazeXCoord, potion, nick, loginId, id, inviteNumbers, chargeCash, } = myUserData;
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
    }
    catch (err) {
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
    const loginFailMessage = "해당 아이디가 존재하지 않거나, 비밀번호가 일치하지 않습니다.";
    const id = loginIdContainer.value;
    const password = loginPasswordContainer.value;
    const idTest = testLoginInfo("id", id);
    const passwordTest = testLoginInfo("password", password);
    if (!idTest || !passwordTest) {
        return alertByModal(loginFailMessage);
    }
    try {
        showLoading();
        const res = await axios.default.post("/auth/login", { id, password });
        const { data } = res;
        const { answer, loginCode } = data;
        if (answer === "error") {
            throw new Error();
        }
        stopLoading();
        if (answer === "no user") {
            alertByModal(loginFailMessage);
        }
        else if (answer === "lock") {
            alertByModal("정지된 ID입니다!");
        }
        if (loginCode) {
            localStorage.setItem("LOGIN_CODE", loginCode);
            location.reload();
        }
    }
    catch (err) {
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
        return alertByModal("닉네임, 아이디, 비밀번호, 비밀번호 확인 칸을 모두 작성하세요.");
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
        const res = await axios.default.post("/auth/join", {
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
            return alertByModal(`해당 ${nickExist && idExist
                ? "닉네임과 아이디가"
                : nickExist
                    ? "닉네임이"
                    : "아이디가"} 존재합니다`);
        }
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다.");
    }
};
// game
const changePlayMode = () => {
    if (loadInterval)
        return;
    const { currentMazeYCoord, currentMazeXCoord } = myUserData;
    if (playMode === "map" &&
        (mazeYcoordIndex !== Math.floor(currentMazeYCoord / 10) ||
            mazeXcoordIndex !== Math.floor(currentMazeXCoord / 10))) {
        mazeYcoordIndex = Math.floor(currentMazeYCoord / 10);
        mazeXcoordIndex = Math.floor(currentMazeXCoord / 10);
        renderMaze();
    }
    mapBtn.style.backgroundColor = playMode === "run" ? "greenyellow" : "white";
    playMode = playMode === "run" ? "map" : "run";
};
const openProfileModal = () => {
    if (loadInterval)
        return;
    profileModal.style.display = "flex";
    outOfProfileModal.style.display = "block";
};
const openRankModal = async () => {
    if (loadInterval)
        return;
    if (!rankersDataWrited) {
        try {
            showLoading();
            const loginCode = localStorage.getItem("LOGIN_CODE");
            const res = await axios.default.post("/user/getRankInfo", {
                loginCode,
            });
            const { data } = res;
            const { answer } = data;
            if (answer === "error") {
                throw new Error();
            }
            const { rankersData } = data;
            rankersData.forEach((rankerData, index) => {
                const targetRankerInfoContainer = otherRankerInfoContainers[index];
                const targetRankerNickContainer = targetRankerInfoContainer.querySelector(".rankerInfoContainer_nickContainer");
                const targetRankerCurrentMazeLevelContainer = targetRankerInfoContainer.querySelector(".rankerInfoContainer_currentMazeLevelContainer");
                const { nick, level } = rankerData;
                targetRankerNickContainer.innerText = nick;
                targetRankerCurrentMazeLevelContainer.innerText = `제${level}미궁`;
            });
            rankersDataWrited = true;
            stopLoading();
        }
        catch (err) {
            stopLoading();
            reload = true;
            alertByModal("오류가 발생하여 재접속합니다.");
        }
    }
    rankModal.style.display = "flex";
    outOfRankModal.style.display = "block";
};
const openShopModal = () => {
    if (loadInterval)
        return;
    shopModal.style.display = "flex";
    outOfShopModal.style.display = "block";
};
const openInquiryModal = () => {
    if (loadInterval)
        return;
    inquiryModal.style.display = "flex";
    outOfInquiryModal.style.display = "block";
};
const enterNewMaze = async () => {
    if (loadInterval)
        return;
    try {
        showLoading();
        const loginCode = localStorage.getItem("LOGIN_CODE");
        const res = await axios.default.post("/maze/enterNewMaze", {
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
        const { currentMazeSide, startYCoord, startXCoord, destinationYCoord, destinationXCoord, newMazeData, } = data;
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
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다.");
    }
};
const enterNewPart = async () => {
    if (loadInterval)
        return;
    try {
        showLoading();
        const loginCode = localStorage.getItem("LOGIN_CODE");
        const res = await axios.default.post("/maze/enterNewPart", {
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
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다.");
    }
};
const saveCurrentData = async () => {
    if (loadInterval)
        return;
    if (moveLog.length === 0)
        return;
    try {
        showLoading();
        const loginCode = localStorage.getItem("LOGIN_CODE");
        const res = await axios.default.post("/maze/saveCurrentData", {
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
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다.");
    }
};
const clickMoveBtn = (direction) => () => {
    if (loadInterval)
        return;
    switch (playMode) {
        case "map": {
            const { currentMazeSide } = myUserData;
            const lastIndex = currentMazeSide / 10 - 1;
            if (direction === "up" && mazeYcoordIndex > 0) {
                mazeYcoordIndex--;
            }
            else if (direction === "down" && mazeYcoordIndex < lastIndex) {
                mazeYcoordIndex++;
            }
            else if (direction === "left" && mazeXcoordIndex > 0) {
                mazeXcoordIndex--;
            }
            else if (direction === "right" && mazeXcoordIndex < lastIndex) {
                mazeXcoordIndex++;
            }
            else {
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
            if (direction === "up" &&
                ["1", "3", "5", "7", "9", "b", "d", "f"].includes(currentRoom)) {
                mazeCowContainer.style.transform = "rotate(180deg)";
                myUserData.currentMazeYCoord--;
                moveLog.push("up");
                const currentTopPercent = mazeCowContainer.style.top;
                mazeCowContainer.style.top = `${Number(currentTopPercent.slice(0, currentTopPercent.length - 1)) - 10}%`;
            }
            else if (direction === "down" &&
                ["2", "3", "6", "7", "a", "b", "e", "f"].includes(currentRoom)) {
                mazeCowContainer.style.transform = "rotate(0deg)";
                myUserData.currentMazeYCoord++;
                moveLog.push("down");
                const currentTopPercent = mazeCowContainer.style.top;
                mazeCowContainer.style.top = `${Number(currentTopPercent.slice(0, currentTopPercent.length - 1)) + 10}%`;
            }
            else if (direction === "left" &&
                ["4", "5", "6", "7", "c", "d", "e", "f"].includes(currentRoom)) {
                mazeCowContainer.style.transform = "rotate(90deg)";
                myUserData.currentMazeXCoord--;
                moveLog.push("left");
                const currentLeftPercent = mazeCowContainer.style.left;
                mazeCowContainer.style.left = `${Number(currentLeftPercent.slice(0, currentLeftPercent.length - 1)) -
                    10}%`;
            }
            else if (direction === "right" &&
                ["8", "9", "a", "b", "c", "d", "e", "f"].includes(currentRoom)) {
                mazeCowContainer.style.transform = "rotate(270deg)";
                myUserData.currentMazeXCoord++;
                moveLog.push("right");
                const currentLeftPercent = mazeCowContainer.style.left;
                mazeCowContainer.style.left = `${Number(currentLeftPercent.slice(0, currentLeftPercent.length - 1)) +
                    10}%`;
            }
            else {
                return;
            }
            if (mazeCowBody.classList.contains("leftFootForward")) {
                mazeCowBody.classList.remove("leftFootForward");
                mazeCowBody.classList.add("rightFootForward");
                mazeCowBody.src = "/images/cowBodyRightFootForward.png";
            }
            else {
                mazeCowBody.classList.remove("rightFootForward");
                mazeCowBody.classList.add("leftFootForward");
                mazeCowBody.src = "/images/cowBodyLeftFootForward.png";
            }
            updateHp(-1);
            const { currentMazeDestinationYCoord, currentMazeDestinationXCoord, currentMazeYCoord, currentMazeXCoord, } = myUserData;
            currentRoom = getCurrentRoom();
            if (currentMazeDestinationYCoord === currentMazeYCoord &&
                currentMazeDestinationXCoord === currentMazeXCoord) {
                enterNewMaze();
            }
            else if (currentRoom === "z") {
                enterNewPart();
            }
            else {
                if (mazeYcoordIndex !== Math.floor(currentMazeYCoord / 10) ||
                    mazeXcoordIndex !== Math.floor(currentMazeXCoord / 10)) {
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
const quitModal = (modalIndex) => () => {
    if (loadInterval)
        return;
    const targetModal = [profileModal, rankModal, shopModal, inquiryModal][modalIndex];
    const targetOutOfModal = [
        outOfProfileModal,
        outOfRankModal,
        outOfShopModal,
        outOfInquiryModal,
    ][modalIndex];
    targetModal.style.display = "none";
    targetOutOfModal.style.display = "none";
};
const clickUserInfoChangeBtn = (type) => async () => {
    if (loadInterval)
        return;
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
            alertByModal("닉네임: 2~8자 내 한글, 영어, 숫자\n\n비밀번호: 6~16자 내 영어, 숫자, 일부 특수문자(!@#$%^&*()._-)");
            return;
        }
        let res = null;
        showLoading();
        const loginCode = localStorage.getItem("LOGIN_CODE");
        switch (type) {
            case "nick": {
                res = await axios.default.post("/auth/changeNick", {
                    loginCode,
                    newNick: text,
                });
                break;
            }
            case "password": {
                res = await axios.default.post("/auth/changePassword", {
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
    }
    catch (err) {
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
    if (loadInterval)
        return;
    const password = profileModalNickContainer.value;
    if (!testLoginInfo("password", password)) {
        alertByModal("닉네임란에 비밀번호를 입력해주세요.\n\n삭제된 계정은 복원이 불가합니다!");
        return;
    }
    try {
        showLoading();
        const loginCode = localStorage.getItem("LOGIN_CODE");
        const res = await axios.default.post("/auth/leave", {
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
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다.");
    }
};
const clickShopSellingPotionContainer = (potionIndex) => () => {
    if (loadInterval)
        return;
    if (myUserData.chargeCash === 0) {
        currentBuyingPotionIndex = potionIndex;
        potionPurchaseModal.style.display = "flex";
        outOfPotionPurchaseModal.style.display = "block";
    }
    else {
        alertByModal("이전 구매 건이 처리되지 않아 아직 포션을 구매하실 수 없습니다!");
    }
};
const purchasePotion = async () => {
    if (loadInterval)
        return;
    try {
        showLoading();
        const loginCode = localStorage.getItem("LOGIN_CODE");
        const res = await axios.default.post("/shop/purchasePotion", {
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
        chargeCashInfo.innerText = `입금 필요 금액: ${myUserData.chargeCash.toLocaleString("ko-KR")}₩`;
        myUserData.potion += 10 ** currentBuyingPotionIndex;
        if (myUserData.hp === 0) {
            tryPotionDrink();
            alertByModal(`물약 ${10 ** currentBuyingPotionIndex}개 구매 완료!\n\n물약을 1개 소모하여 체력을 회복합니다!`);
        }
        else {
            potionAmountsContainer.innerText = `${myUserData.potion}`;
            alertByModal(`물약 ${10 ** currentBuyingPotionIndex}개 구매 완료!`);
        }
        currentBuyingPotionIndex = 0;
        potionPurchaseModal.style.display = "none";
        outOfPotionPurchaseModal.style.display = "none";
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다.");
    }
};
const cancelPurchasePotion = () => {
    if (loadInterval)
        return;
    currentBuyingPotionIndex = 0;
    potionPurchaseModal.style.display = "none";
    outOfPotionPurchaseModal.style.display = "none";
};
const alertByModal = (msg) => {
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
        }
        else {
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
        }
        else {
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
document.addEventListener("touchend", (event) => {
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
moveBtns.forEach((moveBtn, index) => {
    if (navigator.userAgent.match(/mobile/i) ||
        navigator.userAgent.match(/iPad|Android|Touch/i)) {
        moveBtn.addEventListener("touchstart", () => {
            clickMoveBtn(moves[index])();
            clickInterval = setInterval(() => {
                clickMoveBtn(moves[index])();
            }, 200);
        });
        moveBtn.addEventListener("touchend", () => {
            if (clickInterval) {
                clearInterval(clickInterval);
            }
        });
        moveBtn.addEventListener("touchmove", (event) => {
            const touch = event.touches[0];
            if (clickInterval &&
                document.elementFromPoint(touch.pageX, touch.pageY) !== moveBtn) {
                clearInterval(clickInterval);
            }
        });
    }
    else {
        moveBtn.addEventListener("mousedown", () => {
            clickMoveBtn(moves[index])();
            clickInterval = setInterval(() => {
                clickMoveBtn(moves[index])();
            }, 200);
        });
        moveBtn.addEventListener("mouseup", () => {
            if (clickInterval) {
                clearInterval(clickInterval);
            }
        });
        moveBtn.addEventListener("mouseleave", () => {
            if (clickInterval) {
                clearInterval(clickInterval);
            }
        });
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
