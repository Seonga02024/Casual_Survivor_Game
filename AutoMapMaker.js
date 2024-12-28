// BlockManager: 맵의 블록을 관리
class BlockManager {
    constructor(blockMapObjects, blocks, startX, startY, sizeX, sizeY, xInterval, zInterval, randomY) {
        this.blockMapObjects = blockMapObjects;
        this.blocks = blocks;
        this.startX = startX;
        this.startY = startY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.xInterval = xInterval;
        this.zInterval = zInterval;
        this.randomY = randomY;
        this.isFirst = false;
    }
    createMap() { // 맵 생성
        console.log("map size : " + this.sizeX + " " + this.sizeY);
        
        if(this.blocks.length > 0){
            this.blocks.forEach(block => block.visible = true);
            this.blocks.forEach(block => block.hasWall = false);   
        }
        const totalBlocks = this.sizeX * this.sizeY;
        const originBlockLength = this.blockMapObjects.length;
        
        if (this.blocks.length < totalBlocks) {
            while (this.blocks.length < totalBlocks){
                const randomBlockIndex = Math.floor(Math.random() * originBlockLength);
                const cloneBlock = this.blockMapObjects[randomBlockIndex].clone();
                WORLD.add(cloneBlock);
                cloneBlock.main = false;
                this.blocks.push(cloneBlock);
            }
            this.blocks.forEach(block => block.hasWall = false);
        }else{
            for (let i = totalBlocks; i < this.blocks.length; i++) {
                this.blocks[i].visible = false;
                this.blocks[i].hasWall = true;
            }
        }

        this.blocks.forEach((block, index) => {
            const x = this.startX + (index % this.sizeX) * this.xInterval;
            const z = this.startY + Math.floor(index / this.sizeX) * this.zInterval;
            block.position.set(x, 0, z);
        });
        
        // seting camera 처음 블록 끝 블록 중간에서 위로 
        const camera = WORLD.getObject("MainCamera");
        let middleX = (this.blocks[0].position.x + this.blocks[totalBlocks - 1].position.x)/2;
        let middleY = 0;
        if(this.sizeY > 7){
            middleY = 50;
        }else{
            middleY = 40;
        }
        let middleZ = (this.blocks[0].position.z + this.blocks[totalBlocks - 1].position.z)/2;
        camera.position.set(middleX, middleY, middleZ);
    }
    getBlocks() { // 블록 목록 가져오기
        return this.blocks;
    }
    reset(){
        this.blocks.forEach((block) => {
            block.visible = false;
        })
    }
}

// WallManager: 벽 배치 및 관리
class WallManager {
    constructor(sizeX, sizeY, walls, wallSizes, wallYvalues, wallList, wallBlockObject) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.walls = walls;
        this.wallSizes = wallSizes;
        this.wallYvalues = wallYvalues;
        this.wallList = wallList;
        this.useWallBlockNum = 0;
        this.wallBlockObject = wallBlockObject;
    }
    placeWalls(blocks, sizeX = this.sizeX, sizeY = this.sizeY) { // 벽 배치
        
        this.walls.forEach(wall => wall.visible = true);
        this.wallList.forEach((wallBlock) => {
            wallBlock.visible = true;
        });
        this.useWallBlockNum = 0;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.walls.forEach((wall, index) => {
            const wallSize = this.wallSizes[index];
            const wallPosition = this.findValidWallPosition(blocks, wallSize);
            if (wallPosition) {
                wall.position.set(wallPosition.x, this.wallYvalues[index], wallPosition.z);
            }else{
                wall.visible = false;
            }
        });
        for (let i = this.useWallBlockNum; i < this.wallList.length; i++) {
            this.wallList[i].visible = false;
        }
    }
    // 벽 배치 가능한 위치 찾기
    findValidWallPosition(blocks, wallSize) {
        const availableBlocks = this.getRandomBlocks(blocks, wallSize);
        if (!availableBlocks) return null;
        
        availableBlocks.forEach(block => block.hasWall = true);
        const centerPos = this.getBlockGroupCenter(availableBlocks);
        this.markBlocksAsWall(availableBlocks)
        return centerPos;
    }
    // 블록 그룹의 중앙 계산
    getBlockGroupCenter(blockGroup) {
        let sumX = 0, sumZ = 0;
        blockGroup.forEach(block => {
            sumX += block.position.x;
            sumZ += block.position.z;
        });
        const centerX = sumX / blockGroup.length;
        const centerZ = sumZ / blockGroup.length;
        return { x: centerX, z: centerZ };
    }
    // 벽에 해당하는 블록들을 표시
    markBlocksAsWall(blockGroup) {
        blockGroup.forEach(block => {
            block.visible = false;
            if(this.wallList.length <= this.useWallBlockNum){
                //const wallBlock = WORLD.getObject("wallBlock");
                const cloneWallBlock = this.wallBlockObject.clone();
                WORLD.add(cloneWallBlock);
                this.wallList.push(cloneWallBlock);
            }
            this.wallList[this.useWallBlockNum].position.set(block.position.x, 0, block.position.z);
            this.useWallBlockNum += 1;
        });
    }
    // 랜덤 블록 추출 (벽 크기만큼)
    getRandomBlocks(blocks, wallSize) {
        let availableBlocks = [];
        let attempts = 0;
        const maxAttempts = 100; // 최대 시도 횟수 (무한 루프 방지)
        
        let width = wallSize[0];
        let height = wallSize[1];
        let wallTotalSize = width * height;
    
        // 최대 시도 횟수 동안 가능한 블록을 찾기
        while (attempts < maxAttempts) {
            const randomBlockIndex = Math.floor(Math.random() * blocks.length);
            const block = blocks[randomBlockIndex];
            const startX = randomBlockIndex % this.sizeX; 
            const startY = Math.floor(randomBlockIndex / this.sizeX); 
            availableBlocks = [];
    
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // 사이즈에 맞는 1차 확인 
                    const newX = startX + x;
                    const newY = startY + y;
                    // 범위 밖이면 skip
                    if(wallTotalSize == 1){
                        if (newX >= this.sizeX || newY >= this.sizeY) {
                            availableBlocks = [];
                            break; 
                        }  
                    }else{
                        if (newX >= (this.sizeX-1) || newY >= (this.sizeY-1) || newX == 0 || newY == 0) {
                            availableBlocks = [];
                            break;
                        }   
                    }
                    const blockIndex = newY * this.sizeX + newX; 
                    const block = blocks[blockIndex];
                    if (block.hasWall) {
                        availableBlocks = [];
                        break; 
                    }
                    // 주변에 다른 장애물 없는지 2차 확인 
                    const directions = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1],         [0, 1],     
                        [1, -1], [1, 0], [1, 1]    
                    ];
                    let isValid = true;
                    for (const [dx, dy] of directions) {
                        const neighborX = newX + dx;
                        const neighborY = newY + dy;
                        // 맵 범위 밖인 경우는 넘어감
                        if (neighborX < 0 || neighborX >= this.sizeX || neighborY < 0 || neighborY >= this.sizeY) {
                            continue;
                        }
                        const neighborIndex = neighborY * this.sizeX + neighborX;
                        const neighborBlock = blocks[neighborIndex];
                        if (neighborBlock.hasWall) {
                            isValid = false;
                            break;
                        }
                    }
                    if (!isValid) {
                        availableBlocks = [];
                        break; // 주변 블록에 장애물이 있으면 다시 시도
                    }
                    availableBlocks.push(block);
                }
                // 세로 방향 블록을 하나라도 찾지 못하면 중지
                if (availableBlocks.length === 0) break;
            }
            // 충분히 큰 직사각형 블록을 찾았으면 반환
            if (availableBlocks.length === wallTotalSize) {
                return availableBlocks;
            }
            attempts++;  // 시도 횟수 증가
        }
        // 주어진 크기에 맞는 블록이 없으면 null 반환-> 배치 안됨 
        return null;
    }
    reset(){
        this.walls.forEach((wall) => {
            wall.visible = false;
        });
        this.wallList.forEach((wallBlock) => {
            wallBlock.visible = false;
        })
    }
}

// AutoMapMaker: 맵과 장애물을 설정
class AutoMapMaker {
    constructor(blockMapObjects, blocks, walls, wallSizes, wallYvalues, wallList, wallBlockObject, startX, startY, sizeX, sizeY) {
        this.blockManager = new BlockManager(blockMapObjects, blocks, startX, startY, sizeX, sizeY, 5, 5, 1);
        this.wallManager = new WallManager(sizeX, sizeY,walls, wallSizes, wallYvalues, wallList, wallBlockObject);
        
        this.create();
    }
    // 맵과 벽을 생성
    create() {
        this.blockManager.createMap();
        this.wallManager.placeWalls(this.blockManager.getBlocks());
    }
    // 새로운 크기로 맵을 생성
    create2(sizeX, sizeY) {
        this.blockManager.sizeX = sizeX;
        this.blockManager.sizeY = sizeY;
        this.blockManager.createMap();
        this.wallManager.placeWalls(this.blockManager.getBlocks(), sizeX, sizeY);
    }
    reset(){
        this.blockManager.reset();
        this.wallManager.reset();
    }
}

function Start() {
    REDBRICK.Signal.addListener("LOADING", (params)=>{
        SettingMap(params.mapNumber);
    });
}

let autoMapMaker = null;
let isFirst = true;
let currentMapNumber = -1;

function SettingMap(mapNumber) {
    
    console.log("mapNumber : " + mapNumber);
    
    let randomX = Math.floor(Math.random() * 2);
    let randomY = Math.floor(Math.random() * 2);

    // 맵 정보를 동적으로 처리하는 함수
    const setUpMap = (mapInfo, randomX, randomY) => {
        if (isFirst || currentMapNumber != mapNumber) { // 처음이거나 같은 맵이 아니면 
            if(isFirst == false && currentMapNumber != mapNumber){ // 처음 아닌데 같은 맵 아니면 
                if(GLOBAL.blocks){ // 기존 맵 리셋 
                    mapInfo.Reset();
                    autoMapMaker.reset();
                }
            }
            // 새롭게 맵 만들기 
            autoMapMaker = new AutoMapMaker(
                mapInfo.blockMapObjects,
                mapInfo.blocks,
                mapInfo.walls,
                mapInfo.wallSizes,
                mapInfo.wallYvalues,
                mapInfo.wallList,
                mapInfo.wallBlockObject,
                0, 0, randomX, randomY
            );
            isFirst = false;
            currentMapNumber = mapNumber;   
            console.log("isFirst : "+ currentMapNumber);
        } else {  // 처음 아닌데 같은 맵이면 재사용해서 만들기 
            console.log("not isFirst : " + currentMapNumber);
            mapInfo.Reset();
            autoMapMaker.create2(randomX, randomY);
        }
        // 세팅 
        GLOBAL.blocks = mapInfo.blocks;
        GLOBAL.blockMapInfo = mapInfo.blockMapInfo;
        GLOBAL.rewardObjectList = mapInfo.rewardObjectList;
        GLOBAL.rewardPercentList = mapInfo.rewardPercentList;
        GLOBAL.rewardIdList = mapInfo.rewardIdList;
    };
    
    let mapSize = 1;

    // mapNumber에 따라 적절한 mapInfo를 선택
    // random 0~2
    switch(mapNumber) {
        case 1:
            mapSize = 4;
            setUpMap(GLOBAL.mapInfo1, randomX + mapSize, randomY + mapSize);
            break;
        case 2:
            mapSize = 5;
            setUpMap(GLOBAL.mapInfo6, randomX + mapSize, randomY + mapSize);
            break;
        case 3:
            mapSize = 5;
            setUpMap(GLOBAL.mapInfo3, randomX + mapSize, randomY + mapSize);
            break;
        case 4:
            mapSize = 5;
            setUpMap(GLOBAL.mapInfo4, randomX + mapSize, randomY + mapSize);
            break;
        case 5:
            mapSize = 5;
            setUpMap(GLOBAL.mapInfo5, randomX + mapSize, randomY + mapSize);
            break;
        case 6:
            mapSize = 5;
            setUpMap(GLOBAL.mapInfo2, randomX + mapSize, randomY + mapSize);
            break;
        default:
            break;
    }

    // 신호 보내기
    REDBRICK.Signal.send("READY_MAP");
}