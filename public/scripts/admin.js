"use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const axios = __importDefault(require("axios"));
// html
const loginContainer = document.querySelector("#loginContainer");
const loginIdContainer = loginContainer.querySelector("#login_id");
const loginPasswordContainer = loginContainer.querySelector("#login_password");
const loginBtn = loginContainer.querySelector("#loginBtn");
const header = document.querySelector("#header");
const mazeListModalOpenBtn = header.querySelector("#mazeListModalOpenBtn");
const currentMazeLevelContainer = header.querySelector("#currentMazeLevelContainer");
const currentMazeSideContainer = header.querySelector("#currentMazeSideContainer");
const currentMazeStartYCoordContainer = header.querySelector("#currentMazeStartYCoordContainer");
const currentMazeStartXCoordContainer = header.querySelector("#currentMazeStartXCoordContainer");
const currentMazeDestinationYCoordContainer = header.querySelector("#currentMazeDestinationYCoordContainer");
const currentMazeDestinationXCoordContainer = header.querySelector("#currentMazeDestinationXCoordContainer");
const mazeCreateBtn = header.querySelector("#mazeCreateBtn");
const currentMazeSaveBtn = header.querySelector("#currentMazeSaveBtn");
const currentMazeDeleteBtn = header.querySelector("#currentMazeDeleteBtn");
const logoutBtn = header.querySelector("#logoutBtn");
const mazeBody = document.querySelector("#mazeBody");
const outOfMazeListModal = document.querySelector("#outOfMazeListModal");
const mazeListModal = document.querySelector("#mazeListModal");
const mazeList = mazeListModal.querySelector("#mazeList");
const outOfAlertModal = document.querySelector("#outOfAlertModal");
const alertModal = document.querySelector("#alertModal");
const outOfLoadingModal = document.querySelector("#outOfLoadingModal");
const loadingModal = document.querySelector("#loadingModal");
// common
let loadInterval = null;
let reload = false;
let currentYCoord = 0;
let currentXCoord = 0;
let drawMode = "erase";
let mazesInfo = [];
let currentMazeInfo = {
    level: 0,
    side: 0,
    startYCoord: 0,
    startXCoord: 0,
    destinationYCoord: 0,
    destinationXCoord: 0,
    mazeData: [],
};
const upBlockRooms = [0, 2, 4, 6, 8, 10, 12, 14];
const downBlockRooms = [0, 1, 4, 5, 8, 9, 12, 13];
const leftBlockRooms = [0, 1, 2, 3, 8, 9, 10, 11];
const rightBlockRooms = [0, 1, 2, 3, 4, 5, 6, 7];
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
// func
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
        const res = await axios.default.post("/admin/login", { id, password });
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
        else if (answer === "not admin") {
            alertByModal("출입 불가!");
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
const checkAdminLoginCode = async () => {
    try {
        const loginCode = localStorage.getItem("LOGIN_CODE");
        if (!loginCode) {
            header.style.display = "none";
            mazeBody.style.display = "none";
            loginContainer.style.display = "flex";
            return;
        }
        showLoading();
        const res = await axios.default.post("/admin/checkLoginCode", {
            loginCode,
        });
        stopLoading();
        const { data } = res;
        const { answer } = data;
        if (answer === "error") {
            throw new Error();
        }
        if (answer === "no user") {
            localStorage.removeItem("LOGIN_CODE");
            stopLoading();
            header.style.display = "none";
            mazeBody.style.display = "none";
            loginContainer.style.display = "flex";
            return;
        }
        if (answer === "not admin") {
            localStorage.removeItem("LOGIN_CODE");
            stopLoading();
            header.style.display = "none";
            mazeBody.style.display = "none";
            loginContainer.style.display = "flex";
            return;
        }
        const { newLoginCode, mazes } = data;
        localStorage.setItem("LOGIN_CODE", newLoginCode);
        mazesInfo = mazes;
        renderMazeList();
        mazeListModalOpenBtn.click();
        stopLoading();
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다!");
    }
};
const renderMazeList = () => {
    mazeList.innerHTML = "";
    for (const maze of mazesInfo) {
        const { level, side, startYCoord, startXCoord, destinationYCoord, destinationXCoord, } = maze;
        const mazeBtn = document.createElement("button");
        mazeBtn.classList.add("mazeListModal_mazeBtn");
        mazeBtn.classList.add(`${level}`);
        mazeBtn.innerText = `${level}\n(${side}*${side})\nS(${startYCoord},${startXCoord})\nD(${destinationYCoord},${destinationXCoord})`;
        mazeList.append(mazeBtn);
    }
    const newMazeBtn = document.createElement("button");
    newMazeBtn.classList.add("mazeListModal_mazeBtn");
    newMazeBtn.classList.add("newMazeBtn");
    newMazeBtn.innerText = "+";
    mazeList.append(newMazeBtn);
};
const openMazeListModal = () => {
    if (loadInterval)
        return;
    mazeListModal.style.display = "flex";
    outOfMazeListModal.style.display = "flex";
};
const createMaze = () => {
    if (loadInterval)
        return;
    const currentMazeLevel = Number(currentMazeLevelContainer.value);
    const currentMazeSide = Number(currentMazeSideContainer.value);
    const currentMazeStartYCoord = Number(currentMazeStartYCoordContainer.value);
    const currentMazeStartXCoord = Number(currentMazeStartXCoordContainer.value);
    const currentMazeDestinationYCoord = Number(currentMazeDestinationYCoordContainer.value);
    const currentMazeDestinationXCoord = Number(currentMazeDestinationXCoordContainer.value);
    if (currentMazeLevel > 0 &&
        [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(currentMazeSide) &&
        currentMazeStartYCoord >= 0 &&
        currentMazeStartYCoord < currentMazeSide &&
        currentMazeStartXCoord >= 0 &&
        currentMazeStartXCoord < currentMazeSide &&
        currentMazeDestinationYCoord >= 0 &&
        currentMazeDestinationYCoord < currentMazeSide &&
        currentMazeDestinationXCoord >= 0 &&
        currentMazeDestinationXCoord < currentMazeSide) {
        currentMazeInfo.level = currentMazeLevel;
        currentMazeInfo.side = currentMazeSide;
        currentMazeInfo.startYCoord = currentMazeStartYCoord;
        currentMazeInfo.startXCoord = currentMazeStartXCoord;
        currentMazeInfo.destinationYCoord = currentMazeDestinationYCoord;
        currentMazeInfo.destinationXCoord = currentMazeDestinationXCoord;
        currentMazeInfo.mazeData = "0".repeat(currentMazeSide ** 2).split("");
        renderMaze();
    }
    else {
        alertByModal(`미로 정보 이상!\n\nlevel:${currentMazeLevel}\nside:${currentMazeSide}\nstartYCoord:${currentMazeStartYCoord}\nstartXCoord:${currentMazeStartXCoord}\ndestinationYCoord:${currentMazeDestinationYCoord}\ndestinationXCoord:${currentMazeDestinationXCoord}`);
    }
};
const saveCurrentMaze = async () => {
    if (loadInterval)
        return;
    const { level, side, startYCoord, startXCoord, destinationYCoord, destinationXCoord, mazeData, } = currentMazeInfo;
    if (level === 0) {
        alertByModal("현재 미로 없음!");
        mazeListModalOpenBtn.click();
        return;
    }
    if (![10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(side) ||
        startYCoord < 0 ||
        startYCoord >= side ||
        startXCoord < 0 ||
        startXCoord >= side ||
        destinationYCoord < 0 ||
        destinationYCoord >= side ||
        destinationXCoord < 0 ||
        destinationXCoord >= side ||
        mazeData.length !== side ** 2) {
        alertByModal(`미로 정보 이상!\n\nlevel:${level}\nside:${side}\nstartYCoord:${startYCoord}\nstartXCoord:${startXCoord}\ndestinationYCoord:${destinationYCoord}\ndestinationXCoord:${destinationXCoord}`);
        return;
    }
    if (mazeData.length !== side ** 2) {
        alertByModal("미로 정보 이상! 콘솔 확인 필요!");
        console.log("mazeData", mazeData);
        return;
    }
    try {
        const previousMaze = mazesInfo.find((maze) => maze.level === level);
        const loginCode = localStorage.getItem("LOGIN_CODE");
        showLoading();
        const res = await axios.default.post(`/admin/${previousMaze ? "updateMaze" : "addMaze"}`, {
            loginCode,
            level,
            side,
            startYCoord,
            startXCoord,
            destinationYCoord,
            destinationXCoord,
            mazeData: mazeData.join(""),
        });
        stopLoading();
        const { data } = res;
        const { answer } = data;
        if (answer === "error") {
            throw new Error();
        }
        if (previousMaze) {
            previousMaze.side = side;
            previousMaze.startYCoord = startYCoord;
            previousMaze.startXCoord = startXCoord;
            previousMaze.destinationYCoord = destinationYCoord;
            previousMaze.destinationXCoord = destinationXCoord;
            alertByModal("미로 업데이트 완료!");
        }
        else {
            mazesInfo.push({
                level,
                side,
                startYCoord,
                startXCoord,
                destinationYCoord,
                destinationXCoord,
            });
            mazesInfo.sort((mazeA, mazeB) => {
                return mazeA.level - mazeB.level;
            });
            renderMazeList();
            alertByModal("미로 생성 완료!");
        }
        currentYCoord = 0;
        currentXCoord = 0;
        currentMazeInfo = {
            level: 0,
            side: 0,
            startYCoord: 0,
            startXCoord: 0,
            destinationYCoord: 0,
            destinationXCoord: 0,
            mazeData: [],
        };
        mazeBody.innerHTML = "";
        mazeListModalOpenBtn.click();
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다!");
    }
};
const deleteMaze = async () => {
    if (loadInterval)
        return;
    const { level } = currentMazeInfo;
    if (level === 0) {
        alertByModal("현재 미로 없음!");
        mazeListModalOpenBtn.click();
        return;
    }
    const targetMaze = mazesInfo.find((maze) => maze.level === level);
    if (!targetMaze) {
        alertByModal("현재 미로 없음!");
        mazeListModalOpenBtn.click();
        return;
    }
    try {
        const loginCode = localStorage.getItem("LOGIN_CODE");
        showLoading();
        const res = await axios.default.post(`/admin/deleteMaze`, {
            loginCode,
            level,
        });
        stopLoading();
        const { data } = res;
        const { answer } = data;
        if (answer === "error") {
            throw new Error();
        }
        mazesInfo = mazesInfo.filter((maze) => maze.level !== level);
        renderMazeList();
        currentMazeInfo = {
            level: 0,
            side: 0,
            startYCoord: 0,
            startXCoord: 0,
            destinationYCoord: 0,
            destinationXCoord: 0,
            mazeData: [],
        };
        mazeBody.innerHTML = "";
        mazeListModalOpenBtn.click();
    }
    catch (err) {
        stopLoading();
        reload = true;
        alertByModal("오류가 발생하여 재접속합니다!");
    }
};
const logout = () => {
    localStorage.removeItem("LOGIN_CODE");
    location.reload();
};
const renderMaze = () => {
    mazeBody.innerHTML = "";
    const { side, startYCoord, startXCoord, destinationYCoord, destinationXCoord, } = currentMazeInfo;
    mazeBody.style.width = `${side * 50.5}px`;
    mazeBody.style.height = `${side * 50.5}px`;
    for (let i = 0; i < side ** 2; i++) {
        const mazeRoom = document.createElement("button");
        mazeRoom.classList.add("mazeRoom");
        if ((i + 1) / 10 === Math.ceil((i + 1) / 10)) {
            mazeRoom.classList.add("rightMarginRoom");
        }
        let bottomMargin = false;
        for (let j = 1; j <= side / 10; j++) {
            if (i >= side * 10 * j - side && i < side * 10 * j) {
                bottomMargin = true;
                break;
            }
        }
        if (bottomMargin) {
            mazeRoom.classList.add("bottomMarginRoom");
        }
        if (i === side * startYCoord + startXCoord) {
            mazeRoom.id = "startRoom";
            mazeRoom.style.backgroundColor = "red";
            drawMode = "erase";
            currentYCoord = startYCoord;
            currentXCoord = startXCoord;
        }
        if (i === side * destinationYCoord + destinationXCoord) {
            mazeRoom.id = "destinationRoom";
        }
        mazeBody.append(mazeRoom);
    }
};
const renderMazeByMazeData = () => {
    const { mazeData } = currentMazeInfo;
    const mazeRooms = Array.from(mazeBody.querySelectorAll(".mazeRoom"));
    for (let i = 0; i < mazeData.length; i++) {
        const targetRoom = parseInt(mazeData[i], 16);
        const targetRoomInMazeBody = mazeRooms[i];
        if (!upBlockRooms.includes(targetRoom)) {
            targetRoomInMazeBody.classList.add("upAvailableRoom");
        }
        if (!downBlockRooms.includes(targetRoom)) {
            targetRoomInMazeBody.classList.add("downAvailableRoom");
        }
        if (!leftBlockRooms.includes(targetRoom)) {
            targetRoomInMazeBody.classList.add("leftAvailableRoom");
        }
        if (!rightBlockRooms.includes(targetRoom)) {
            targetRoomInMazeBody.classList.add("rightAvailableRoom");
        }
    }
};
const clickMazeBody = (event) => {
    if (loadInterval)
        return;
    const target = event.target;
    if (!target.classList.contains("mazeRoom")) {
        return;
    }
    const mazeRooms = Array.from(mazeBody.querySelectorAll(".mazeRoom"));
    const currentRoomIndex = mazeRooms.indexOf(target);
    const { side } = currentMazeInfo;
    const currentRoomYCoord = Math.floor(currentRoomIndex / side);
    const currentRoomXCoord = currentRoomIndex % side;
    if (currentYCoord === currentRoomYCoord &&
        currentXCoord === currentRoomXCoord) {
        if (drawMode === "draw") {
            drawMode = "erase";
            target.style.backgroundColor = "red";
        }
        else {
            drawMode = "draw";
            target.style.backgroundColor = "blue";
        }
        return;
    }
    const targetRoomsInMazeBody = mazeBody.querySelectorAll(".mazeRoom");
    if (currentYCoord === currentRoomYCoord) {
        const smallX = currentXCoord > currentRoomXCoord ? currentRoomXCoord : currentXCoord;
        const bigX = currentXCoord > currentRoomXCoord ? currentXCoord : currentRoomXCoord;
        for (let x = smallX; x <= bigX; x++) {
            const targetRoomIndex = side * currentYCoord + x;
            let targetRoom = parseInt(currentMazeInfo.mazeData[targetRoomIndex], 16);
            const targetRoomInMazeBody = targetRoomsInMazeBody[targetRoomIndex];
            if (x !== bigX &&
                drawMode === "erase" &&
                rightBlockRooms.includes(targetRoom)) {
                targetRoom += 8;
                targetRoomInMazeBody.classList.add("rightAvailableRoom");
            }
            else if (x !== bigX &&
                drawMode === "draw" &&
                !rightBlockRooms.includes(targetRoom)) {
                targetRoom -= 8;
                targetRoomInMazeBody.classList.remove("rightAvailableRoom");
            }
            if (x !== smallX &&
                drawMode === "erase" &&
                leftBlockRooms.includes(targetRoom)) {
                targetRoom += 4;
                targetRoomInMazeBody.classList.add("leftAvailableRoom");
            }
            else if (x !== smallX &&
                drawMode === "draw" &&
                !leftBlockRooms.includes(targetRoom)) {
                targetRoom -= 4;
                targetRoomInMazeBody.classList.remove("leftAvailableRoom");
            }
            currentMazeInfo.mazeData[targetRoomIndex] = targetRoom.toString(16);
        }
    }
    else if (currentXCoord === currentRoomXCoord) {
        const smallY = currentYCoord > currentRoomYCoord ? currentRoomYCoord : currentYCoord;
        const bigY = currentYCoord > currentRoomYCoord ? currentYCoord : currentRoomYCoord;
        for (let y = smallY; y <= bigY; y++) {
            const targetRoomIndex = side * y + currentXCoord;
            let targetRoom = parseInt(currentMazeInfo.mazeData[targetRoomIndex], 16);
            const targetRoomInMazeBody = targetRoomsInMazeBody[targetRoomIndex];
            if (y !== bigY &&
                drawMode === "erase" &&
                downBlockRooms.includes(targetRoom)) {
                targetRoom += 2;
                targetRoomInMazeBody.classList.add("downAvailableRoom");
            }
            else if (y !== bigY &&
                drawMode === "draw" &&
                !downBlockRooms.includes(targetRoom)) {
                targetRoom -= 2;
                targetRoomInMazeBody.classList.remove("downAvailableRoom");
            }
            if (y !== smallY &&
                drawMode === "erase" &&
                upBlockRooms.includes(targetRoom)) {
                targetRoom += 1;
                targetRoomInMazeBody.classList.add("upAvailableRoom");
            }
            else if (y !== smallY &&
                drawMode === "draw" &&
                !upBlockRooms.includes(targetRoom)) {
                targetRoom -= 1;
                targetRoomInMazeBody.classList.remove("upAvailableRoom");
            }
            currentMazeInfo.mazeData[targetRoomIndex] = targetRoom.toString(16);
        }
    }
    const previousRoom = targetRoomsInMazeBody[side * currentYCoord + currentXCoord];
    previousRoom.style.backgroundColor = "";
    currentYCoord = currentRoomYCoord;
    currentXCoord = currentRoomXCoord;
    if (drawMode === "draw") {
        target.style.backgroundColor = "blue";
    }
    else {
        target.style.backgroundColor = "red";
    }
};
const clickMazeList = async (event) => {
    if (loadInterval)
        return;
    const target = event.target;
    if (!target.classList.contains("mazeListModal_mazeBtn")) {
        return;
    }
    if (target.classList.contains("newMazeBtn")) {
        currentMazeLevelContainer.value = `${mazesInfo.length === 0 ? 1 : mazesInfo[mazesInfo.length - 1].level + 1}`;
        currentMazeSideContainer.value = "";
        currentMazeStartYCoordContainer.value = "";
        currentMazeStartXCoordContainer.value = "";
        currentMazeDestinationYCoordContainer.value = "";
        currentMazeDestinationXCoordContainer.value = "";
    }
    else {
        try {
            const level = Number(Array.from(target.classList).find((className) => !isNaN(Number(className))));
            const loginCode = localStorage.getItem("LOGIN_CODE");
            showLoading();
            const res = await axios.default.post(`/admin/getMazeData`, {
                loginCode,
                level,
            });
            const { data } = res;
            const { answer, mazeData } = data;
            if (answer === "error") {
                throw new Error();
            }
            stopLoading();
            const targetMazeInfo = mazesInfo.find((mazeInfo) => mazeInfo.level === level);
            const { side, startYCoord, startXCoord, destinationYCoord, destinationXCoord, } = targetMazeInfo;
            currentMazeLevelContainer.value = `${level}`;
            currentMazeSideContainer.value = `${side}`;
            currentMazeStartYCoordContainer.value = `${startYCoord}`;
            currentMazeStartXCoordContainer.value = `${startXCoord}`;
            currentMazeDestinationYCoordContainer.value = `${destinationYCoord}`;
            currentMazeDestinationXCoordContainer.value = `${destinationXCoord}`;
            mazeCreateBtn.click();
            currentMazeInfo.mazeData = mazeData.split("");
            renderMazeByMazeData();
        }
        catch (err) {
            stopLoading();
            reload = true;
            alertByModal("오류가 발생하여 재접속합니다!");
        }
    }
    mazeListModal.style.display = "none";
    outOfMazeListModal.style.display = "none";
};
const alertByModal = (msg) => {
    alertModal.innerText = msg;
    alertModal.style.display = "flex";
    outOfAlertModal.style.display = "block";
};
const showLoading = () => {
    loadingModal.style.display = "flex";
    outOfLoadingModal.style.display = "block";
    loadInterval = 1;
};
const stopLoading = () => {
    loadingModal.style.display = "none";
    outOfLoadingModal.style.display = "none";
    loadInterval = null;
};
// event listener
loginBtn.addEventListener("click", login);
mazeListModalOpenBtn.addEventListener("click", openMazeListModal);
mazeCreateBtn.addEventListener("click", createMaze);
currentMazeSaveBtn.addEventListener("click", saveCurrentMaze);
currentMazeDeleteBtn.addEventListener("click", deleteMaze);
logoutBtn.addEventListener("click", logout);
mazeBody.addEventListener("click", clickMazeBody);
mazeList.addEventListener("click", clickMazeList);
outOfMazeListModal.addEventListener("click", () => {
    mazeListModal.style.display = "none";
    outOfMazeListModal.style.display = "none";
});
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
window.onload = checkAdminLoginCode;
