class MapSetText {
    SetText(num1, num1num2) {
        throw new Error("MapSetText() must be implemented.");
    }
}

class Map1SetText extends MapSetText{
    SetText(pistolPiece, knifePiece, pistolBullet){
        return "current pistolPiece : " + pistolPiece + "\n" +
            "current knifePiece : " + knifePiece + "\n"+
            "current pistolBullet : " + pistolBullet + "\n";
    }
}

class Map2SetText extends MapSetText{
    SetText(key1, key2, key3){
        return "current key1 : " + key1 + "\n" +
            "current key2 : " + key2 + "\n"+
            "current key3 : " + key3 + "\n";
    }
}

class Map3SetText extends MapSetText{
    SetText(medicineNum){
        return "current medicineNum : " + medicineNum + "\n";
    }
}

class Map4SetText extends MapSetText{
    SetText(riflePiece, pipePiece, rifleBullet){
        return "current riflePiece : " + riflePiece + "\n" +
            "current pipePiece : " + pipePiece + "\n"+
            "current rifleBullet : " + rifleBullet + "\n";
    }
}

class Map5SetText extends MapSetText{
    SetText(sniperPiece, axePiece, sniperBullet){
        return "current sniperPiece : " + sniperPiece + "\n" +
            "current axePiece : " + axePiece + "\n" +
            "current sniperBullet : " + sniperBullet + "\n";
    }
}

class Map6SetText extends MapSetText{
    SetText(foodNum, waterNum){
        return "current foodNum : " + foodNum + "\n" +
            "current waterNum : " + waterNum + "\n";
    }
}

class GameGUI{
    constructor(){
        //ui object
        this.background = GUI.getObject("background");
        this.gameBtns = [];
        for(let i=1; i<=6; i++){
            this.gameBtns.push(GUI.getObject("game" + i + "Btn")); 
        }
        this.gameCounts = [];
        for(let i=1; i<=3; i++){
            this.gameCounts.push(GUI.getObject("num" + i)); 
            this.gameCounts[i-1].visible = false;
        }
        this.playerInfo = GUI.getObject("playerInfo");
        this.startBtn = GUI.getObject("startBtn");
        
        this.manImg = GUI.getObject("manImg");
        this.endText = GUI.getObject("endText"); 
        this.EndImg = GUI.getObject("EndImg");
        this.retryBtn = GUI.getObject("retryBtn");
        this.homeBtn = GUI.getObject("homeBtn");
        this.LoadingImg = GUI.getObject("LoadingImg");
        
        this.itemBoard = GUI.getObject("itemBoard");
        
        this.randomBoard = GUI.getObject("randomBoard");
        this.randomText = GUI.getObject("randomText");
        
        // value
        this.isSetGame = false;
        this.currentGameNum = 0;
        this.clickGameStart = false;
        
        this.map1SetText = new Map1SetText();
        this.map2SetText = new Map2SetText();
        this.map3SetText = new Map3SetText();
        this.map4SetText = new Map4SetText();
        this.map5SetText = new Map5SetText();
        this.map6SetText = new Map6SetText();
        
        this.init();
    }
    
    init(){
        this.hideAllGUI();
        this.startGUI();
        this.SettingBasicInfoText();
        
        this.isSetGame = false;
        this.currentGameNum = 0;
        this.randomText.setText("");
        
        this.gameBtns.forEach((gameBtn, index) => {
            gameBtn.onClick(() => {
                this.isSetGame = true;
                this.currentGameNum = index+1;
                this.SettingSelectGameText(this.currentGameNum);
                REDBRICK.Signal.send("SET_GAME", {id:this.currentGameNum});
            });
        });
        this.startBtn.onClick(() => {
            if(this.clickGameStart) return;
            this.clickGameStart = true;
            
            if(this.isSetGame === false){
                REDBRICK.Signal.send("SET_GAME", {id:1});
            }
            REDBRICK.Signal.send("GAME_START");
        });
        this.retryBtn.onClick(() => {
            this.hideAllGUI();
            REDBRICK.Signal.send("GAME_RETRY");
        });
        this.homeBtn.onClick(() => {
            this.hideAllGUI();
            this.startGUI();
        });
    }
    // 전체 UI 없애기 
    hideAllGUI(){
        this.randomBoard.hide();
        this.background.hide();
        this.manImg.hide();
        this.endText.hide();
        this.retryBtn.hide();
        this.homeBtn.hide();
        this.LoadingImg.hide();
        this.itemBoard.hide();
        this.EndImg.hide();
    }
    // 로딩 UI
    LoadingGUI(){
        this.hideAllGUI();
        this.LoadingImg.show();
    }
    // 맨 처음 게임 UI
    startGUI(){
        this.hideAllGUI();
        this.background.show();
    }
    // 진짜 게임 시작 UI
    GameStartGUI(mapNumber){
        this.hideAllGUI();
        this.ShowEndText(this.gameCounts, 2, 1000); // 진짜 게임 시작 후 3, 2, 1 카운트 다운 UI
        this.itemBoard.show();
        this.ShowItemBoard(mapNumber);
        this.randomBoard.show();
    }
    // 게임 끝 UI
    GameEndUI(){
        this.hideAllGUI();
        this.manImg.show();
        this.endText.show();
        this.retryBtn.show();
        this.homeBtn.show();
        this.EndImg.show();
        this.clickGameStart = false;
    }
    // 맨 처음 게임 UI 에서 어떤 건물 선택했는지 보여주는 UI
    SettingSelectGameText(num){
        this.playerInfo.setText("current setting game num : " + num);
    }
    // 맨 처음 게임 UI에서 플레이어가 가지고 있는 소지품 UI
    SettingBasicInfoText(){
        this.playerInfo.setText(
            this.map1SetText.SetText(GLOBAL.DataManager.pistolPiece, GLOBAL.DataManager.knifePiece, GLOBAL.DataManager.pistolBullet) + 
            this.map2SetText.SetText(GLOBAL.DataManager.key1, GLOBAL.DataManager.key2, GLOBAL.DataManager.key3) + 
            this.map3SetText.SetText(GLOBAL.DataManager.medicineNum) + 
            this.map4SetText.SetText(GLOBAL.DataManager.riflePiece, GLOBAL.DataManager.pipePiece, GLOBAL.DataManager.rifleBullet) + 
            this.map5SetText.SetText(GLOBAL.DataManager.sniperPiece, GLOBAL.DataManager.axePiece, GLOBAL.DataManager.sniperBullet) + 
            this.map6SetText.SetText(GLOBAL.DataManager.foodNum, GLOBAL.DataManager.waterNum)
        );
    }
    // 진짜 게임 시작 후 3, 2, 1 카운트 다운 UI
    ShowEndText(list, num, time){
        setTimeout(() => {
            if(num === -1){
                list[num+1].visible = false;
                REDBRICK.Signal.send("MOVE_START");
            }else{
                if(num != 2) list[num+1].visible = false;
                list[num].visible = true;
                num -= 1;  
                this.ShowEndText(list, num, time);
                GLOBAL.GameSound.countdownSFX();
            }
        }, time);
    }
    // 각 건물에 따른 아이템 소지 UI 
    ShowItemBoard(mapNumber){
        switch(mapNumber) {
        case 1:
            this.itemBoard.setText(this.map1SetText.SetText(GLOBAL.DataManager.pistolPiece, GLOBAL.DataManager.knifePiece, GLOBAL.DataManager.pistolBullet));
            break;
        case 2:
            this.itemBoard.setText(this.map6SetText.SetText(GLOBAL.DataManager.foodNum, GLOBAL.DataManager.waterNum));
            break;
        case 3:
            this.itemBoard.setText(this.map3SetText.SetText(GLOBAL.DataManager.medicineNum));
            break;
        case 4:
            this.itemBoard.setText(this.map4SetText.SetText(GLOBAL.DataManager.riflePiece, GLOBAL.DataManager.pipePiece, GLOBAL.DataManager.rifleBullet));
            break;
        case 5:
            this.itemBoard.setText(this.map5SetText.SetText(GLOBAL.DataManager.sniperPiece, GLOBAL.DataManager.axePiece, GLOBAL.DataManager.sniperBullet));
            break;
        case 6:
            this.itemBoard.setText(this.map2SetText.SetText(GLOBAL.DataManager.key1, GLOBAL.DataManager.key2, GLOBAL.DataManager.key3));
            break;
        default:
            break;
        }
    }
    // 랜덤 효과 보여주는 UI
    ShowRandomBuff(isActive, str){
        //console.log(isActive + " " + str);
        if(isActive) this.randomText.setText(str);
        else this.randomText.setText("");
    }
}

GLOBAL.GameGUI = GameGUI;