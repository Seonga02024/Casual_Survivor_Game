// objecct
const camera = WORLD.getObject("MainCamera");
const player = WORLD.getObject("ghost");
const leftImg = WORLD.getObject("leftImg");
const upImg = WORLD.getObject("upImg");
const rightImg = WORLD.getObject("rightImg");
const downImg = WORLD.getObject("downImg");
const Portal = WORLD.getObject("Portal");
const StartLocation = WORLD.getObject("StartLocation");
const avatar = REDBRICK.AvatarManager.createDefaultAvatar();

// player values
const height = 5; // 포물선의 높이
let isPlayerMoving = false;
let currentPlayerPos = 4;
let playerTime = 0;
let playerSpeed = 1;

// game value
const keyImgs = [];
const currentRandomMoveList = [3, 2, 1, 0];
let isGameStart = false;
let isGameStartClick = false;

// singleTon
let ItemManager = null;
let EventManager = null;
let EnemyManager = null;
let GameGUI = null;

// map setting value
let currentMapNumber = 1;
let currentBlocks = null;
let currentBlockMap = null;
let currentItems = null;
let currentItemsParcent = null;
let currentItemsId = null;

// event
let haveEvent = false;
let currentEventName = "";
let currentMoveblock = null;
let isEnemyMove = false;
let isPlayerStopMove = false;

function Start() {
    keyImgs.push(upImg);
    keyImgs.push(downImg);
    keyImgs.push(leftImg);
    keyImgs.push(rightImg);
    
    GameGUI = new GLOBAL.GameGUI();
    
    REDBRICK.Signal.addListener("SET_GAME", (params)=>{
        currentMapNumber = params.id;
    });
    REDBRICK.Signal.addListener("GAME_START", ()=>{
        if(isGameStartClick) return;
        isGameStartClick = true;
        Loading(currentMapNumber);
    });
    REDBRICK.Signal.addListener("GAME_OVER", (params)=>{
        GameStart(false);
    });
    REDBRICK.Signal.addListener("MOVE_START", (params)=>{
        GameStart(true);
    });
    REDBRICK.Signal.addListener("GET_ITEM", (params)=>{
        ItemManager.getItem(currentMapNumber, params.itemID);
    });
    REDBRICK.Signal.addListener("GAME_RETRY", ()=>{
        if(isGameStartClick) return;
        isGameStartClick = true;
        Loading(currentMapNumber);
    });
    REDBRICK.Signal.addListener("READY_MAP", (params)=>{
        CreateMapInfo();
    });
    REDBRICK.Signal.addListener("CreateEvent", (params)=>{
        const moveblock = params.moveblock !== undefined ? params.moveblock : 1;
        EventManage(params.eventName, params.isActive, moveblock);
    });
}

function Update(dt){
    if(isGameStart){
        playerTime += dt;
        if(ItemManager) ItemManager.Update(dt);
        if(EnemyManager && isEnemyMove) EnemyManager.Update(dt);
        if(EventManager) EventManager.Update(dt);
        if(isPlayerMoving == false){
            player.position.set(currentBlocks[currentPlayerPos].position.x, currentBlocks[currentPlayerPos].position.y + 2, currentBlocks[currentPlayerPos].position.z);
        }
    }
}

function init(mapNumber){
    console.log("init : " + mapNumber);
    
    isPlayerMoving = false;
    playerTime = 0;
    isGameStart = false;
    isEnemyMove = false;
    isPlayerStopMove = false;
    keyImgs.forEach((img) => {
        img.visible = true;
    });
    
    // 건물이 바뀔 때마다 재 설정 필요 
    currentBlocks = GLOBAL.blocks;
    currentBlockMap = GLOBAL.blockMapInfo;
    currentItems = GLOBAL.rewardObjectList;
    currentItemsParcent = GLOBAL.rewardPercentList;
    currentItemsId = GLOBAL.rewardIdList;
    
    switch(mapNumber){
        case 1:
            playerSpeed = 2.3;
            break;
        case 2:
            playerSpeed = 2.3;
            break;
        case 3:
            playerSpeed = 2.3;
            break;
        case 4:
            playerSpeed = 2.7;
            break;
        case 5:
            playerSpeed = 2.7;
            break;
        case 6:
            playerSpeed = 2.7;
            break;
        default:
            break;
    }
    
    // first player setting
    // plyer
    currentPlayerPos = Math.floor( Math.random(0, currentBlocks.length)*10);
    while(currentBlocks[currentPlayerPos].hasWall == true){
        currentPlayerPos = Math.floor( Math.random(0, currentBlocks.length)*10);
    }
    player.position.set(currentBlocks[currentPlayerPos].position.x, currentBlocks[currentPlayerPos].position.y + 2, currentBlocks[currentPlayerPos].position.z);
    CheckDirectionImg(currentBlocks, currentBlockMap);
    // item
    if(ItemManager){
        ItemManager.Reset();
    }
    ItemManager = new GLOBAL.ItemManager(currentItems, currentItemsParcent, currentItemsId, currentBlocks, player, 8);
    if(EventManager){
        EventManager.Reset();
    }
    EventManager = new GLOBAL.EventManager(currentBlocks, player, 10);
    // enemy
    if(EnemyManager){
        EnemyManager.Reset();
    }
    EnemyManager = new GLOBAL.EnemyManager(currentBlocks, currentBlockMap, player, currentPlayerPos);
    // 건물에 따른 적 생성 
    switch(mapNumber){
        case 1:
            EnemyManager.AddEnemy(0, 2, 2); // 0번째 적 오브젝트 , 2 : moveingTerm , 2 : moveingSpeed
            break;
        case 2:
            EnemyManager.AddEnemy(0, 1.5, 2);
            break;
        case 3:
            EnemyManager.AddEnemy(0, 1.5, 1.5);
            break;
        case 4:
            EnemyManager.AddEnemy(0, 2, 2);
            EnemyManager.AddEnemy(1, 2, 2);
            break;
        case 5:
            EnemyManager.AddEnemy(0, 1.5, 2);
            EnemyManager.AddEnemy(1, 2, 2);
            break;
        case 6:
            EnemyManager.AddEnemy(0, 1.5, 2);
            EnemyManager.AddEnemy(1, 1.5, 1.5);
            break;
        default:
            break;
    }

    // gameGUI
    GameGUI.GameStartGUI(currentMapNumber);
}

// 맵 세팅하는데 시간이 걸려서 바로 보여주면 맵 바뀌는 거 보여서 로딩창 만들어 놓음
function Loading(mapNumber){
    currentMapNumber = mapNumber;
    REDBRICK.Signal.send("LOADING", {mapNumber:mapNumber});
    GameGUI.LoadingGUI();
    console.log("Loading");
}

function CreateMapInfo(){
    SettingBlock(GLOBAL.blocks, GLOBAL.blockMapInfo);
    setTimeout(() => {
        init(currentMapNumber);
    }, 4000)
}

// 이벤트 발생에 대한 조치 
function EventManage(eventName, isActive, moveblock){
    currentEventName = eventName;
    console.log(eventName + " " + isActive);
    switch(eventName){
        case "BlackHole":
            if(isActive){
                GameGUI.ShowRandomBuff(true, "텔레포트 생성");
            }else{
                if(haveEvent) return;
                haveEvent = true;
                currentMoveblock = moveblock;
            }
            break;
        case "StopEnemy":
            if(isActive){
                isEnemyMove = false;
                GameGUI.ShowRandomBuff(true, "몬스터 이동 금지");
            }else{
                isEnemyMove = true;
                EventManager.resetEvent();
                GameGUI.ShowRandomBuff(false, "");
            }
            break;
        case "SpeedUpEnemy":
            GameGUI.ShowRandomBuff(isActive, "몬스터 속도 증가");
            if(isActive){
                EnemyManager.ChangeEnemySpeed(-0.5);
            }else{
                EnemyManager.ChangeEnemySpeed(0.5);
                EventManager.resetEvent();
            }
            break;
        case "SpeedDownEnemy":
            GameGUI.ShowRandomBuff(isActive, "몬스터 속도 감소");
            if(isActive){
                EnemyManager.ChangeEnemySpeed(0.5);
            }else{
                EnemyManager.ChangeEnemySpeed(-0.5);
                EventManager.resetEvent();
            }
            break;
        case "StopPlayer":
            GameGUI.ShowRandomBuff(isActive, "플레이어 이동 금지");
            if(isActive){
                haveEvent = true;
                isPlayerStopMove = true;
                keyImgs.forEach((img) => {
                    img.visible = false;
                });
            }else{
                hasPlayerStopEvent(false);
            }
            break;
        case "SpeedUpPlayer":
            GameGUI.ShowRandomBuff(isActive, "플레이어 속도 증가");
            if(isActive){
                playerSpeed += 1;
            }else{
                playerSpeed -= 1;
                EventManager.resetEvent();
            }
            break;
        case "SpeedDownPlayer":
            GameGUI.ShowRandomBuff(isActive, "플레이어 속도 감소");
            if(isActive){
                playerSpeed -= 1;
            }else{
                playerSpeed += 1;
                EventManager.resetEvent();
            }
            break;
        default:
            break;
    }
}

function GameStart(isActive){
    if(isActive){
        if(ItemManager) ItemManager.isGameStart = true;
        if(EnemyManager) EnemyManager.SetGameStart(true);
        if(EventManager) EventManager.isGameStart = true;
        isGameStart = true;
        isEnemyMove = true;
    }else{
        if(ItemManager) ItemManager.isGameStart = false;
        if(EnemyManager) EnemyManager.SetGameStart(false);
        if(EventManager) EventManager.isGameStart = false;
        isGameStart = false;
        isGameStartClick = false;
        isEnemyMove = false;
        GameGUI.GameEndUI();
    }
}

function ShowDirectionImg(num, obj, isActive){
    switch(num){
        case 0:
            if(isActive){
                upImg.visible = true;
                upImg.position.set(obj.position.x, obj.position.y + 0.6, obj.position.z);
            }else{
                upImg.visible = false;
            }
            break;
        case 1:
            if(isActive){
                downImg.visible = true;
                downImg.position.set(obj.position.x, obj.position.y + 0.6, obj.position.z);
            }else{
                downImg.visible = false;
            }
            break;
        case 2:
            if(isActive){
                leftImg.visible = true;
                leftImg.position.set(obj.position.x, obj.position.y + 0.6, obj.position.z);
            }else{
                leftImg.visible = false;
            }
            break;
        case 3:
            if(isActive){
                rightImg.visible = true;
                rightImg.position.set(obj.position.x, obj.position.y + 0.6, obj.position.z);
            }else{
                rightImg.visible = false;
            }
            break;
    }
}

function CheckDirectionImg(blocks, blockMap){
    if(blockMap[currentPlayerPos].rightB){ // up
        let obj = blocks[blockMap[currentPlayerPos].rightB-1];
        ShowDirectionImg(currentRandomMoveList.indexOf(0), obj, true);
    }else{
        ShowDirectionImg(currentRandomMoveList.indexOf(0), null, false);
    }
    if(blockMap[currentPlayerPos].leftB){
        let obj = blocks[blockMap[currentPlayerPos].leftB-1];
        ShowDirectionImg(currentRandomMoveList.indexOf(1), obj, true);
    }else{
        ShowDirectionImg(currentRandomMoveList.indexOf(1), null, false);
    }
    if(blockMap[currentPlayerPos].forwardB){
        let obj = blocks[blockMap[currentPlayerPos].forwardB-1];
        ShowDirectionImg(currentRandomMoveList.indexOf(2), obj, true);
    }else{
        ShowDirectionImg(currentRandomMoveList.indexOf(2), null, false);
    }
    if(blockMap[currentPlayerPos].backB){
        let obj = blocks[blockMap[currentPlayerPos].backB-1];
        ShowDirectionImg(currentRandomMoveList.indexOf(3), obj, true);
    }else{
        ShowDirectionImg(currentRandomMoveList.indexOf(3), null, false);
    }
}

// 블록 정보 설정해주는 함수 
function SettingBlock(blocks, blockMap){
    // 블록의 위치를 기준으로 좌표를 X, Z로 분리하여 저장
    const blockPositions = blocks.map(block => ({
        x: block.position.x,
        z: block.position.z,
        block: block
    }));
    
    blocks.forEach((block, index1) => {
        let rightB = null, leftB = null, forwardB = null, backB = null;
        blockPositions.forEach((otherblock, index2) => {
            if(index1 !== index2 && otherblock.block.hasWall == false){ // && otherblock.block.hasWall == false
                let distance = block.position.distanceTo(otherblock.block.position);
                let diffX = block.position.x - otherblock.x;
                let diffZ = block.position.z - otherblock.z;
                if(distance < 7){
                    if(Math.abs(diffX) < 2){
                        if(diffZ < 0 ){
                            leftB = index2+1;
                        }else{
                            rightB = index2+1;
                        }   
                    }
                    
                    if(Math.abs(diffZ) < 2){
                        if(diffX < 0){
                            backB = index2+1;
                        }else{
                            forwardB = index2+1;
                        }   
                    }
                }
            }
        });
        blockMap.push(new GLOBAL.Block(index1+1, rightB, leftB, forwardB, backB));
    })
}

function MovePortal(){
    StartLocation.kill();
}

function OnKeyDown(event) {
    if(isPlayerStopMove) return;
    switch (event.code) {
        case "ArrowUp":
            CheckMoveBlock(0);
            break;
        case 'ArrowDown':
            CheckMoveBlock(1);
            break;
        case 'ArrowLeft':
            CheckMoveBlock(2);
            break;
        case 'ArrowRight':
            CheckMoveBlock(3);
            break;
        case 'KeyE':
            if(isGameStart){
                GameStart(false);
            }else{
                GameStart(true);
            }
            break;
        case 'KeyQ':
            MovePortal();
            break;
    }
}

function CheckMoveBlock(keyNum){
    switch(currentRandomMoveList[keyNum]){
        case 0: // ArrowUp
            //console.log(currentBlockMap[currentPlayerPos].rightB)
            if(currentBlockMap[currentPlayerPos].rightB){
                MoveBlock(currentBlocks[currentPlayerPos], currentBlocks[currentBlockMap[currentPlayerPos].rightB-1], currentBlockMap[currentPlayerPos].rightB-1);
            }
            break;
        case 1: // ArrowDown
            //console.log(currentBlockMap[currentPlayerPos].leftB)
            if(currentBlockMap[currentPlayerPos].leftB){
                MoveBlock(currentBlocks[currentPlayerPos], currentBlocks[currentBlockMap[currentPlayerPos].leftB-1], currentBlockMap[currentPlayerPos].leftB-1);
            }
            break;
        case 2: // ArrowLeft
            //console.log(currentBlockMap[currentPlayerPos].forwardB)
            if(currentBlockMap[currentPlayerPos].forwardB){
                MoveBlock(currentBlocks[currentPlayerPos], currentBlocks[currentBlockMap[currentPlayerPos].forwardB-1], currentBlockMap[currentPlayerPos].forwardB-1);
            }
            break;
        case 3: // ArrowRight
            //console.log(currentBlockMap[currentPlayerPos].backB)
            if(currentBlockMap[currentPlayerPos].backB){
                MoveBlock(currentBlocks[currentPlayerPos], currentBlocks[currentBlockMap[currentPlayerPos].backB-1], currentBlockMap[currentPlayerPos].backB-1);
            }
            break;
    }
}

// 배열 섞는 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 플레이어 이동 애니메이션 
function MoveBlock(StartB, endB, nextPos){
    if(isGameStart == false) return;
    if(isPlayerMoving) return;
    isPlayerMoving = true;
    playerTime = 0;
    
    let initSpeed = playerSpeed;
    
    const tween = new TWEEN.Tween({ x: StartB.position.x, y: StartB.position.y + 2, z: StartB.position.z })
    .to({ x: endB.position.x, y: endB.position.y + 2, z: endB.position.z }, 1500/initSpeed)
    .onUpdate(({ x, y, z }) => {
        const progress = (endB.position.x - player.position.x) / 3;
        const currentHeight = Math.sin(playerTime * 2 * initSpeed) * 5;
        player.position.set(x, y + currentHeight, z);
    })
    .onComplete(() => {
        isPlayerMoving = false;
        currentPlayerPos = nextPos;
        shuffleArray(currentRandomMoveList);
        if(haveEvent == false) CheckDirectionImg(currentBlocks, currentBlockMap);
        //GLOBAL.GameSound.playEnermyFootSFX();
        if(haveEvent){
            triggerCurrentEvent();
        }
    })
    .start();
}

// 플레이어 이미 움직였다면 다 움직이고 나서 이벤트 발생 
function triggerCurrentEvent(){
    switch(currentEventName){
        case "BlackHole":
            hasTeleportBlockEvent();
            break;
        case "StopPlayer":
            hasPlayerStopEvent(true);
            break;
        default:
            break;
    }
}

// 텔레포트 이벤트 관련 함수 
function hasTeleportBlockEvent()
{
    haveEvent = false;
    currentPlayerPos = currentMoveblock;
    CheckDirectionImg(currentBlocks, currentBlockMap);
    player.position.set(currentBlocks[currentMoveblock].position.x, currentBlocks[currentMoveblock].position.y + 2, currentBlocks[currentMoveblock].position.z);
    EventManager.resetEvent();
    GameGUI.ShowRandomBuff(false, "텔레포트 생성");
}

// 플레이어 멈추기 관련 함수 
function hasPlayerStopEvent(isActive){
    haveEvent = false;
    if(isActive){
        isPlayerStopMove = true;
        keyImgs.forEach((img) => {
            img.visible = false;
        });
    }else{
        isPlayerStopMove = false;
        EventManager.resetEvent();
        CheckDirectionImg(currentBlocks, currentBlockMap);
    }
}