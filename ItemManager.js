class ItemManager{
    constructor(itemList, itemListPercent, itemIDList, blocks, player, spawnTime){
        this.itemList = itemList;
        this.itemListPercent = itemListPercent;
        this.itemIDList = itemIDList;
        this.blocks = blocks;
        this.player = player;
        this.spawnTime = spawnTime;
        
        this.currentTime = 0;
        this.isGameStart = false;
        this.itemInfoList = []; // 아이템 정보 들어있는 배열 
        this.getItemNum = 0;
        this.finialItemNum = itemList.length - 1; // 이 건물에서 나오는 아이템 갯수 저장 => 다 먹으면 끝내기 위한 
        
        this.GameGUI = new GLOBAL.GameGUI();
        
        itemList.forEach((obj, index) => {
            const itemInfo = new Item(obj, player, itemIDList[index]);
            this.itemInfoList.push(itemInfo);
        })
        
        //this.init();
        this.itemInfoList.forEach((item) => {
            item.isGet = false;
        });
    }
    // init(){
    //     this.currentTime = 0;
    //     this.isGameStart = false;
    //     this.itemInfoList.forEach((item) => {
    //         item.isGet = false;
    //     });
    // }
    Update(dt){
        if(this.isGameStart){
            this.currentTime += dt;
            if(this.currentTime > this.spawnTime){
                this.SpawnReward();
                this.currentTime = 0;
            }   
            this.itemInfoList.forEach((item) => {
                 item.Update(dt);
            })
        }
    }
    // 아이템 스폰 
    SpawnReward(){
        let randomObjectNum = this.getRandomObject(this.itemList, this.itemListPercent);
        while(randomObjectNum !== -1 && this.itemInfoList[randomObjectNum].isGet === true){
            randomObjectNum = this.getRandomObject(this.itemList, this.itemListPercent);
        }
        // 아이템 남아있으면 삭제 
        this.itemInfoList.forEach((itemInfo) => {
            if(itemInfo.onGame === true){
                itemInfo.Delete();
            }
        })
        if(randomObjectNum !== -1){ // 꽝이 아닐시 
            // 장애물 빼고 무작위한 위치를 골라서 
            let randomIndex = Math.floor(Math.random() * this.blocks.length);
            while(this.blocks[randomIndex].hasWall == true){
                randomIndex = Math.floor(Math.random() * this.blocks.length);
            }
            this.itemList[randomObjectNum].position.set(this.blocks[randomIndex].position.x, this.blocks[randomIndex].position.y + 2, this.blocks[randomIndex].position.z);
            this.itemInfoList[randomObjectNum].Create();
            this.itemInfoList[randomObjectNum].onGame = true;
            GLOBAL.GameSound.playSpwanItemSFX();
        }
    }
    // 확률 따져서 아이템 선택 
    getRandomObject(itemList, itemListPercent) {
        const randomValue = Math.random() * 100;
        let cumulativeProbability = 0;
        for (let i = 0; i < itemList.length; i++) {
            cumulativeProbability += itemListPercent[i];
            if (randomValue < cumulativeProbability) {
                if(i !== itemList.length-1) return i;
                else return -1;
            }
        }
    }
    Reset(){
        this.itemInfoList.forEach((itemInfo) => {
            if(itemInfo.onGame === true){
                itemInfo.Delete();
            }
        });
    }
    // 아이템 획득했을 경우 
    getItem(mapNumber, num){
        GLOBAL.GameSound.playGetItemSFX();
        this.getItemNum += 1;
        console.log("mapNumber : " + mapNumber + " this.getItemNum : "+ this.getItemNum);
        // 모든 아이템 먹었을 경우, 게임 끝 
        if(this.getItemNum === this.finialItemNum){
            REDBRICK.Signal.send("GAME_OVER", {
                enemyID: -1
            }); 
        }
        
        // 데이터 저장 
        switch(mapNumber) {
            case 1:
                if(num == 0) GLOBAL.DataManager.addMap1Data(1, 0, 0);
                if(num == 1) GLOBAL.DataManager.addMap1Data(2, 0, 0);
                if(num == 2) GLOBAL.DataManager.addMap1Data(3, 0, 0);
                if(num == 3) GLOBAL.DataManager.addMap1Data(0, 1, 0);
                if(num == 4) GLOBAL.DataManager.addMap1Data(0, 2, 0);
                if(num == 5) GLOBAL.DataManager.addMap1Data(0, 3, 0);
                if(num == 6) GLOBAL.DataManager.addMap1Data(0, 0, 5);
                break;
            case 2:
                if(num == 0) GLOBAL.DataManager.addMap6Data(1, 0);
                if(num == 1) GLOBAL.DataManager.addMap6Data(2, 0);
                if(num == 2) GLOBAL.DataManager.addMap6Data(3, 0);
                if(num == 3) GLOBAL.DataManager.addMap6Data(0, 1);
                if(num == 4) GLOBAL.DataManager.addMap6Data(0, 2);
                if(num == 5) GLOBAL.DataManager.addMap6Data(0, 3);
                break;
            case 3:
                if(num == 0) GLOBAL.DataManager.addMap3Data(1);
                if(num == 1) GLOBAL.DataManager.addMap3Data(2);
                break;
            case 4:
                if(num == 0) GLOBAL.DataManager.addMap4Data(1, 0, 0);
                if(num == 1) GLOBAL.DataManager.addMap4Data(2, 0, 0);
                if(num == 2) GLOBAL.DataManager.addMap4Data(3, 0, 0);
                if(num == 3) GLOBAL.DataManager.addMap4Data(0, 1, 0);
                if(num == 4) GLOBAL.DataManager.addMap4Data(0, 2, 0);
                if(num == 5) GLOBAL.DataManager.addMap4Data(0, 3, 0);
                if(num == 6) GLOBAL.DataManager.addMap4Data(0, 0, 5);
                break;
            case 5:
                if(num == 0) GLOBAL.DataManager.addMap5Data(1, 0, 0);
                if(num == 1) GLOBAL.DataManager.addMap5Data(2, 0, 0);
                if(num == 2) GLOBAL.DataManager.addMap5Data(3, 0, 0);
                if(num == 3) GLOBAL.DataManager.addMap5Data(0, 1, 0);
                if(num == 4) GLOBAL.DataManager.addMap5Data(0, 2, 0);
                if(num == 5) GLOBAL.DataManager.addMap5Data(0, 3, 0);
                if(num == 6) GLOBAL.DataManager.addMap5Data(0, 0, 5);
                break;
            case 6:
                if(num == 0) GLOBAL.DataManager.addMap2Data(1, 0, 0);
                if(num == 1) GLOBAL.DataManager.addMap2Data(0, 1, 0);
                if(num == 2) GLOBAL.DataManager.addMap2Data(0, 0, 1);
                break;
            default:
                break;
        }
        // GUI 표시 
        this.GameGUI.ShowItemBoard(mapNumber);
    }
}

class Item{
    constructor(object, player, itemID){
        this.object = object;
        this.player = player;
        this.itemID = itemID;
        this.isGet = false; // 현재 플레이어가 아이템을 먹었는지 아닌지 확인 (1번만 실행시키기 위해)
        this.speed = 3;
        this.onGame = false; // 현재 스폰된 상태인지 아닌지 
    }
    Create(){
        this.onGame = false;
        this.object.revive();
    }
    Update(dt){
        if(this.onGame){
            this.object.rotation.y += dt * this.speed; 
            // 플레이어 거리 체크해서 획득 여부 판단 
            let distanceToPlater = this.object.position.distanceTo(this.player.position);
            if(distanceToPlater < 3 && this.isGet === false){
                this.isGet = true;
                this.object.kill();
                this.onGame = false;
                REDBRICK.Signal.send("GET_ITEM", {
                    itemID: this.itemID
                });  
            }   
        }
    }
    Delete(){
        this.onGame = false;
        this.object.kill();
    }
}

GLOBAL.ItemManager = ItemManager;