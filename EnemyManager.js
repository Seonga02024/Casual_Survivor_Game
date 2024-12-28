// 적 관리 인터페이스 (적 추가, 초기화, 게임 상태 설정 등)
class IEnemyManager {
    AddEnemy(type, movingTerm, moveSpeed) {}
    Update(dt) {}
    SetGameStart(isActive) {}
    Reset() {}
}

class EnemyManager extends IEnemyManager {
    constructor(currentBlocks, currentBlockMap, player, currentPlayerPos){
        super();
        this.currentBlocks = currentBlocks;
        this.currentBlockMap = currentBlockMap;
        this.player = player;
        this.currentPlayerPos = currentPlayerPos;
        
        this.enemyList = [];
        this.enemyObjList = [];
        this.enemyPosList = [];
        for(let i=1; i<=2; i++){
            this.enemyObjList.push(WORLD.getObject("enemyObj" + i)); 
            this.enemyPosList.push(-1);
        }
        this.enemyObjList.forEach((enemy) => {
            enemy.kill();
        });  
        this.currentEnemyNum = 0;
        this.isGameStart = false;
        
        this.init();
    }
    init(){
        this.enemyList = [];
        this.isGameStart = false;
        this.currentEnemyNum = 0;
    }
    Update(dt){
        if(this.isGameStart){
            this.enemyList.forEach((enemy) => {
                enemy.update(dt);
            });  
        }
    }
    // 몬스터 추가 
    AddEnemy(type, moveingTerm, moveSpeed){ // type 몬스터 오브젝트 종류 
        this.currentEnemyNum += 1;
        let randomPos = Math.floor( Math.random(0, this.currentBlocks.length)*10);
        let distanceToPlater = this.currentBlocks[randomPos].position.distanceTo(this.currentBlocks[this.currentPlayerPos].position);
        // 플레이어랑 붙어있지 않도록
        while (distanceToPlater < 10 || this.currentBlocks[randomPos].hasWall == true || this.CheckAlreadySetPos(this.enemyPosList, randomPos)){
            randomPos = Math.floor( Math.random(0, this.currentBlocks.length)*10);
            distanceToPlater = this.currentBlocks[randomPos].position.distanceTo(this.currentBlocks[this.currentPlayerPos].position);
        }
        const enemy = new GLOBAL.Enermy(this.currentEnemyNum, this.enemyObjList[type], randomPos, moveingTerm, moveSpeed, this.currentBlocks, this.currentBlockMap, this.player);
        this.enemyList.push(enemy);
        this.enemyObjList[type].revive();
        this.enemyPosList[type] = randomPos;
    }
    CheckAlreadySetPos(list, randomPos) { // 이미 다른 몬스터가 자리를 선점했는지 확인 
        if (list.includes(randomPos)) {
            return true; 
        } else {
            return false;
        }
    }
    SetGameStart(isActive){ // 게임 시작하면 몬스터 움직임 
        if(isActive){
            this.isGameStart = true;
            this.enemyList.forEach((enemy) => {
                //enemy.object.revive();
                enemy.isGameStart = true;
            });
        }else{
            this.isGameStart = false;
            this.enemyList.forEach((enemy) => {
                //enemy.object.kill();
                enemy.isGameStart = false;
            }); 
        }
    }
    Reset(){
        console.log("enemyManager reset");
        this.enemyList.forEach((enemy) => {
            enemy.init();
        });  
        for(let i=0; i<this.enemyPosList.length; i++){
            this.enemyPosList[i] = -1;
        }
    }
    ChangeEnemySpeed(num){ // 중간에 몬스터 속도 바꾸는 함수 
        this.enemyList.forEach((enemy) => {
            enemy.movingTerm += num;
            enemy.movingSpeed += num;
        });  
    }
}

GLOBAL.EnemyManager = EnemyManager;