class Event {
    constructor() {
        if (new.target === Event) {
            throw new TypeError("Cannot construct Event instances directly");
        }
    }
    trigger() {
        throw new Error("Method 'trigger()' must be implemented.");
    }
    update(dt){
        throw new Error("Method 'update()' must be implemented.");
    }
    reset(){
        throw new Error("Method 'reset()' must be implemented.");
    }
}
// 텔레포트 이벤트 
class BlockEvent1 extends Event {
    constructor(){
        super();  
        this.blockHole1 = WORLD.getObject('blockHole1');
        this.blockHole2 = WORLD.getObject('blockHole2');
        this.blockHole1.visible = false;
        this.blockHole2.visible = false;
        this.player = null;
        this.blocks = null;
        this.isTrigger = false;
        this.resetTimeout = null;
    }
    trigger(blocks, player) {
        REDBRICK.Signal.send("CreateEvent", { eventName : "BlackHole", isActive : true});
        this.isTrigger = false;
        this.player = player;
        this.blocks = blocks;
        let randomPos = Math.floor(Math.random() * this.blocks.length);
        // 플레이어랑 붙어있지 않도록
        while (this.blocks[randomPos] && this.blocks[randomPos].hasWall === true){
            randomPos = Math.floor(Math.random() * this.blocks.length);
        }
        this.blockHole1.position.set(this.blocks[randomPos].position.x, this.blocks[randomPos].position.y + 0.5, this.blocks[randomPos].position.z);
        this.blockHole1.visible = true;
    }
    update(dt){
        let distanceToPlayer = this.blockHole1.position.distanceTo(this.player.position);
        if(distanceToPlayer < 3 && this.isTrigger === false){
            this.isTrigger = true;
            let randomPos = Math.floor(Math.random() * this.blocks.length);
            // 플레이어랑 붙어있지 않도록
            while (this.blocks[randomPos] && this.blocks[randomPos].hasWall === true){
                randomPos = Math.floor(Math.random() * this.blocks.length);
            }
            this.blockHole2.visible = true;
            this.blockHole2.position.set(this.blocks[randomPos].position.x, this.blocks[randomPos].position.y + 0.5, this.blocks[randomPos].position.z);
            REDBRICK.Signal.send("CreateEvent", {
                eventName : "BlackHole",
                isActive : false,
                moveblock: randomPos
            });
        }  
    }
    reset(){
        if (this.resetTimeout) {
            clearTimeout(this.resetTimeout);  // 기존 타이머가 존재하면 취소
        }
        this.resetTimeout = setTimeout(() => {
            this.blockHole1.visible = false;
            this.blockHole2.visible = false;
        }, 1000);
    }
}
// 몬스터 멈추기 이벤트 
class EnemyEvent1 extends Event {
    trigger(blocks, player) {
        REDBRICK.Signal.send("CreateEvent", {eventName : "StopEnemy", isActive : true});
        this.isStopEnemy = true;
        this.currentTime = 0;
        this.lockTime = 2;
    }
    update(dt){
        if(this.isStopEnemy){
            this.currentTime += dt;
            if(this.currentTime > this.lockTime){
                this.currentTime = 0;
                REDBRICK.Signal.send("CreateEvent", {eventName : "StopEnemy", isActive : false});
            }   
        }
    }
    reset(){
        this.isStopEnemy = false;
        this.currentTime = 0;
    }
}
// 몬스터 속도 감소 이벤트 
class EnemyEvent2 extends Event {
    trigger(blocks, player) {
        REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedDownEnemy", isActive : true});
        this.isSpeedDownEnemy = true;
        this.currentTime = 0;
        this.lockTime = 5;
    }
    update(dt){
        if(this.isSpeedDownEnemy){
            this.currentTime += dt;
            if(this.currentTime > this.lockTime){
                this.currentTime = 0;
                REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedDownEnemy", isActive : false});
            }   
        }
    }
    reset(){
        this.isSpeedDownEnemy = false;
        this.currentTime = 0;
    }
}
// 몬스터 속도 증가 이벤트 
class EnemyEvent3 extends Event {
    trigger(blocks, player) {
        REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedUpEnemy", isActive : true});
        this.isSpeedUpEnemy = true;
        this.currentTime = 0;
        this.lockTime = 5;
    }
    update(dt){
        if(this.isSpeedUpEnemy){
            this.currentTime += dt;
            if(this.currentTime > this.lockTime){
                this.currentTime = 0;
                REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedUpEnemy", isActive : false});
            }   
        }
    }
    reset(){
        this.isSpeedUpEnemy = false;
        this.currentTime = 0;
    }
}
// 플레이어 멈추기 이벤트 
class PlayerEvent1 extends Event {
    trigger(blocks, player) {
        REDBRICK.Signal.send("CreateEvent", {eventName : "StopPlayer", isActive : true});
        this.isStopPlayer = true;
        this.currentTime = 0;
        this.lockTime = 3;
    }
    update(dt){
        if(this.isStopPlayer){
            this.currentTime += dt;
            if(this.currentTime > this.lockTime){
                this.currentTime = 0;
                REDBRICK.Signal.send("CreateEvent", {eventName : "StopPlayer", isActive : false});
            }   
        }
    }
    reset(){
        this.isStopPlayer = false;
        this.currentTime = 0;
    }
}
// 플레이어 속도 감소 이벤트 
class PlayerEvent2 extends Event {
    trigger(blocks, player) {
        REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedDownPlayer", isActive : true});
        this.isSpeedDownPlayer = true;
        this.currentTime = 0;
        this.lockTime = 5;
    }
    update(dt){
        if(this.isSpeedDownPlayer){
            this.currentTime += dt;
            if(this.currentTime > this.lockTime){
                this.currentTime = 0;
                REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedDownPlayer", isActive : false});
            }   
        }
    }
    reset(){
        this.isSpeedDownPlayer = false;
        this.currentTime = 0;
    }
}
// 플레이어 속도 증가 이벤트 
class PlayerEvent3 extends Event {
    trigger(blocks, player) {
        REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedUpPlayer", isActive : true});
        this.isSpeedUpPlayer = true;
        this.currentTime = 0;
        this.lockTime = 5;
    }
    update(dt){
        if(this.isSpeedUpPlayer){
            this.currentTime += dt;
            if(this.currentTime > this.lockTime){
                this.currentTime = 0;
                REDBRICK.Signal.send("CreateEvent", {eventName : "SpeedUpPlayer", isActive : false});
            }   
        }
    }
    reset(){
        this.isSpeedUpPlayer = false;
        this.currentTime = 0;
    }
}
// 전체 이벤트 관리 
class EventFactory {
    static createEvent(type) {
        switch(type) {
            case 'block1':
                return new BlockEvent1();
            case 'player1':
                return new PlayerEvent1();
            case 'player2':
                return new PlayerEvent2();
            case 'player3':
                return new PlayerEvent3();
            case 'enemy1':
                return new EnemyEvent1();
            case 'enemy2':
                return new EnemyEvent2();
            case 'enemy3':
                return new EnemyEvent3();
            default:
                throw new Error("Unknown event type");
        }
    }
}

class EventManager{
    constructor(blocks, player, spawnTime){
        this.blocks = blocks;
        this.player = player;
        this.spawnTime = spawnTime;
        
        this.onEvent = false;
        this.currentTime = 0;
        this.isGameStart = false;
        this.eventTypes = ['block1','player1', 'player2','player3','enemy1','enemy2','enemy3']; // 이벤트 종류 리스트
        this.event = null;
        this.currentEventType = null;
        
        this.init();
    }
    init(){
        this.currentTime = 0;
        this.isGameStart = false;
        this.onEvent = false;
        this.event = null;
    }
    Update(dt){
        if(this.isGameStart){
            this.currentTime += dt;
            if(this.currentTime > this.spawnTime){ // 이벤트 시간 확인 
                if(this.onEvent){ // 아직 이벤트 중이라면 
                    // 아래 활성화하면 없어지고 새로운 이벤트 발생 가능 
                    // 현재는 해당 이벤트가 일어날 때까지 대기 
                    // if(this.event) this.event.reset();
                    // this.event = null;
                }else{ // 이벤트 끝났다면 
                    this.createEvent(); // 새로운 아밴트 발생 
                }
                this.currentTime = 0;
            }   
            if (this.onEvent && this.event) {
                this.event.update(dt);
            }
        }
    }
    createEvent() { // 이벤트 발생 
        this.onEvent = true;
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.eventTypes.length);
        } while (this.eventTypes[randomIndex] === this.currentEventType);  // 이전과 동일한 이벤트가 연속해서 나오지 않도록
        this.currentEventType = this.eventTypes[randomIndex];
        this.event = EventFactory.createEvent(this.currentEventType);
        this.event.trigger(this.blocks, this.player); // 이벤트 발생
    }
    resetEvent(){ // 이벤트 리셋 
        this.onEvent = false;
        this.currentTime = 0;
        this.event.reset();
    }
    Reset() {
        if(this.event) this.event.reset();
        this.init();
    }
}

GLOBAL.EventManager = EventManager;