// 전체 오브젝트 관리 + 각 건물 별 맵 세팅 정보 

class mapInfo {
    constructor({id, blockMapObjects, mapblocks, blockMapInfo, wallObjects, wallSizes, wallYvalues, wallList, wallBlockObject, rewardObjectList, rewardPercentList, rewardIdList}) {
        this.id = id;
        this.blockMapObjects = blockMapObjects; // clone 할 블록 타일 
        this.blocks = mapblocks; // 배치된 블록 타일 배열 
        this.blockMapInfo = blockMapInfo; // 블록 정보가 담긴 배열 
        this.walls = wallObjects; // 장애물 오브젝트 배열 
        this.wallSizes = wallSizes; // 장애물 사이즈 
        this.wallYvalues = wallYvalues; // 장애물 y 값 (배치할 때 땅에 안 묻칠려고)
        this.wallList = wallList; // 장애물 블록이 들어갈 배열
        this.wallBlockObject = wallBlockObject; // 장애물 바닥에 배치할 타일 블록 
        this.rewardObjectList = rewardObjectList; // 아이템 오브젝트 리스트 
        this.rewardPercentList = rewardPercentList; // 각 아이템 확률 
        this.rewardIdList = rewardIdList; // 아이템 아이디 담긴 리스트 
    }
    Reset(){
        this.blockMapInfo.splice(0, this.blockMapInfo.length);
    }
}

////////////////////////////////////////

// map 1
// 무기 빌딩 - 경찰서, 무기 상점 (하)
const blockMapObjects_1 = []; // clone 할 블록 타일 
for (let i = 1; i <= 6; i++) {
    blockMapObjects_1.push(WORLD.getObject("1block" + i)); // 타일 종류 6개
}
const blocks_1 = []; // 배치된 블록 타일 배열 - 초기 : 빈 상태 
let blockMapInfo_1 = []; // 블록 정보가 담긴 배열 - 초기 : 빈 상태 

const walls_1 = []; // 장애물 오브젝트 배열 
for (let i = 1; i <= 3; i++) {
    walls_1.push(WORLD.getObject("1wall" + i)); // 장애물 오브젝트 3개
}
const wallSizes_1 = [[1,1], [1,1], [1,1]]; // 장애물 사이즈 
const wallYvalues_1 = [2, 2.8, 1.8]; // 장애물 y 값 (배치할 때 땅에 안 묻칠려고)
let wallList_1 = []; // 장애물 블록이 들어갈 배열 - 초기 : 빈 상태 
const wallBlock_1 = WORLD.getObject("wallBlock1"); // 장애물 바닥에 배치할 타일 블록 

const rewardObjectList_1 = []; // 아이템 오브젝트 리스트 
for(let i=1; i<=7; i++){
    rewardObjectList_1.push(WORLD.getObject("1reward" + i)); 
}
rewardObjectList_1.push(null); // 꽝 
const rewardPercentList_1 = [5, 15, 5, 5, 15, 5, 20, 30]; // 각 아이템 확률 
const rewardIdList_1 = [0, 1, 2, 3, 4, 5, 6, 7]; // 아이템 아이디 담긴 리스트 

GLOBAL.mapInfo1 = new mapInfo({
    id: 1,
    blockMapObjects : blockMapObjects_1,
    mapblocks: blocks_1,
    blockMapInfo: blockMapInfo_1,
    wallObjects: walls_1,
    wallSizes: wallSizes_1,
    wallYvalues: wallYvalues_1,
    wallList: wallList_1,
    wallBlockObject: wallBlock_1,
    rewardObjectList: rewardObjectList_1,
    rewardPercentList: rewardPercentList_1,
    rewardIdList: rewardIdList_1
});

////////////////////////////////////////

//map 2
// 히든 빌딩 - 열쇠
let blockMapInfo_2 = [];
const blocks_2 = [];  // 맵 블록이 들어갈 배열
const blockMapObjects_2 = [];
for (let i = 1; i <= 7; i++) {
    blockMapObjects_2.push(WORLD.getObject("2block" + i)); // 타일 종류 6개
}

const walls_2 = []; 
for (let i = 1; i <= 4; i++) {
    walls_2.push(WORLD.getObject("2wall" + i)); // 장애물 오브젝트 3개
}
const wallSizes_2 = [[1,1], [2,1], [2,1], [1,2]]; // 사이즈
const wallYvalues_2 = [3.5, 2.5, 2.5, 2.4]; // 배치 높이
let wallList_2 = []; // 장애물 블록이 들어갈 배열
const wallBlock_2 = WORLD.getObject("wallBlock2");

const rewardObjectList_2 = [];
const rewardPercentList_2 = [5, 5, 90];
const rewardIdList_2 = [0, 1, 2];
for(let i=1; i<=2; i++){
    rewardObjectList_2.push(WORLD.getObject("2reward" + i)); 
}
rewardObjectList_2.push(null);


GLOBAL.mapInfo2 = new mapInfo({
    id: 2,
    blockMapObjects : blockMapObjects_2,
    mapblocks: blocks_2,
    blockMapInfo: blockMapInfo_2,
    wallObjects: walls_2,
    wallSizes: wallSizes_2,
    wallYvalues: wallYvalues_2,
    wallList: wallList_2,
    wallBlockObject: wallBlock_2,
    rewardObjectList: rewardObjectList_2,
    rewardPercentList: rewardPercentList_2,
    rewardIdList: rewardIdList_2
});

////////////////////////////////////////

//map 3
// 약품 빌딩 - 약국, 병원
let blockMapInfo_3 = [];
const blocks_3 = [];  // 맵 블록이 들어갈 배열
const blockMapObjects_3 = [];
for (let i = 1; i <= 6; i++) {
    blockMapObjects_3.push(WORLD.getObject("3block" + i)); // 타일 종류 6개
}

const walls_3 = []; 
for (let i = 1; i <= 5; i++) {
    walls_3.push(WORLD.getObject("3wall" + i)); // 장애물 오브젝트 3개
}
const wallSizes_3 = [[2,1], [1,1], [1,1], [1,1], [1,1]]; // 사이즈
const wallYvalues_3 = [4, 2.5, 1.8, 3.2, 3.4]; // 배치 높이
let wallList_3 = []; // 장애물 블록이 들어갈 배열
const wallBlock_3 = WORLD.getObject("wallBlock3");

const rewardObjectList_3 = [];
const rewardPercentList_3 = [40, 10, 50];
const rewardIdList_3 = [0, 1, 2];
for(let i=1; i<=2; i++){
    rewardObjectList_3.push(WORLD.getObject("3reward" + i)); 
}
rewardObjectList_3.push(null);


GLOBAL.mapInfo3 = new mapInfo({
    id: 3,
    blockMapObjects : blockMapObjects_3,
    mapblocks: blocks_3,
    blockMapInfo: blockMapInfo_3,
    wallObjects: walls_3,
    wallSizes: wallSizes_3,
    wallYvalues: wallYvalues_3,
    wallList: wallList_3,
    wallBlockObject: wallBlock_3,
    rewardObjectList: rewardObjectList_3,
    rewardPercentList: rewardPercentList_3,
    rewardIdList: rewardIdList_3
});

////////////////////////////////////////

//map 4
// 무기 빌딩 - 경찰서, 무기 상점 (중)
let blockMapInfo_4 = [];
const blocks_4 = [];  // 맵 블록이 들어갈 배열
const blockMapObjects_4 = [];
for (let i = 1; i <= 9; i++) {
    blockMapObjects_4.push(WORLD.getObject("4block" + i)); // 타일 종류 6개
}

const walls_4 = []; 
for (let i = 1; i <= 4; i++) {
    walls_4.push(WORLD.getObject("4wall" + i)); // 장애물 오브젝트 3개
}
const wallSizes_4 = [[1,1], [1,1], [2,2], [2,1]]; // 사이즈
const wallYvalues_4 = [2, 2, 1.7, 2.7]; // 배치 높이
let wallList_4 = []; // 장애물 블록이 들어갈 배열
const wallBlock_4 = WORLD.getObject("wallBlock4");

const rewardObjectList_4 = [];
const rewardPercentList_4 = [5, 15, 5, 5, 15, 5, 20, 30];
const rewardIdList_4 = [0, 1, 2, 3, 4, 5, 6, 7];
for(let i=1; i<=7; i++){
    rewardObjectList_4.push(WORLD.getObject("4reward" + i)); 
}
rewardObjectList_4.push(null);


GLOBAL.mapInfo4 = new mapInfo({
    id: 4,
    blockMapObjects : blockMapObjects_4,
    mapblocks: blocks_4,
    blockMapInfo: blockMapInfo_4,
    wallObjects: walls_4,
    wallSizes: wallSizes_4,
    wallYvalues: wallYvalues_4,
    wallList: wallList_4,
    wallBlockObject: wallBlock_4,
    rewardObjectList: rewardObjectList_4,
    rewardPercentList: rewardPercentList_4,
    rewardIdList: rewardIdList_4
});

////////////////////////////////////////

//map 5
// 무기 빌딩 - 경찰서, 무기 상점 (상)
let blockMapInfo_5 = [];
const blocks_5 = [];  // 맵 블록이 들어갈 배열
const blockMapObjects_5 = [];
for (let i = 1; i <= 7; i++) {
    blockMapObjects_5.push(WORLD.getObject("5block" + i)); // 타일 종류 6개
}

const walls_5 = []; 
for (let i = 1; i <= 5; i++) {
    walls_5.push(WORLD.getObject("5wall" + i)); // 장애물 오브젝트 3개
}
const wallSizes_5 = [[1,2], [3,3], [2,1], [1,1], [1,1]]; // 사이즈
const wallYvalues_5 = [2.6, 3.5, 2, 1.3, 1.3]; // 배치 높이
let wallList_5 = []; // 장애물 블록이 들어갈 배열
const wallBlock_5 = WORLD.getObject("wallBlock5");

const rewardObjectList_5 = [];
const rewardPercentList_5 = [5, 15, 5, 5, 15, 5, 20, 30];
const rewardIdList_5 = [0, 1, 2, 3, 4, 5, 6, 7];
for(let i=1; i<=7; i++){
    rewardObjectList_5.push(WORLD.getObject("5reward" + i)); 
}
rewardObjectList_5.push(null);

GLOBAL.mapInfo5 = new mapInfo({
    id: 5,
    blockMapObjects : blockMapObjects_5,
    mapblocks: blocks_5,
    blockMapInfo: blockMapInfo_5,
    wallObjects: walls_5,
    wallSizes: wallSizes_5,
    wallYvalues: wallYvalues_5,
    wallList: wallList_5,
    wallBlockObject: wallBlock_5,
    rewardObjectList: rewardObjectList_5,
    rewardPercentList: rewardPercentList_5,
    rewardIdList: rewardIdList_5
});

////////////////////////////////////////

//map 6 
// 식량 빌딩 - 마트, 편의점
let blockMapInfo_6 = [];
const blocks_6 = [];  // 맵 블록이 들어갈 배열
const blockMapObjects_6 = [];
for (let i = 1; i <= 6; i++) {
    blockMapObjects_6.push(WORLD.getObject("6block" + i)); // 타일 종류 6개
}

const walls_6 = []; 
for (let i = 1; i <= 5; i++) {
    walls_6.push(WORLD.getObject("6wall" + i)); // 장애물 오브젝트 3개
}
const wallSizes_6 = [[2,1], [1,2], [1,1], [1,1], [1,1]]; // 사이즈
const wallYvalues_6 = [1.8, 1.6, 2.4, 2, 2.5]; // 배치 높이
let wallList_6 = []; // 장애물 블록이 들어갈 배열
const wallBlock_6 = WORLD.getObject("wallBlock6");

const rewardObjectList_6 = [];
const rewardPercentList_6 = [20, 10, 5, 20, 10, 5, 30];
const rewardIdList_6 = [0, 1, 2, 3, 4, 5, 6];
for(let i=1; i<=6; i++){
    rewardObjectList_6.push(WORLD.getObject("6reward" + i)); 
}
rewardObjectList_6.push(null);


GLOBAL.mapInfo6 = new mapInfo({
    id: 6,
    blockMapObjects : blockMapObjects_6,
    mapblocks: blocks_6,
    blockMapInfo: blockMapInfo_6,
    wallObjects: walls_6,
    wallSizes: wallSizes_6,
    wallYvalues: wallYvalues_6,
    wallList: wallList_6,
    wallBlockObject: wallBlock_6,
    rewardObjectList: rewardObjectList_6,
    rewardPercentList: rewardPercentList_6,
    rewardIdList: rewardIdList_6
});

