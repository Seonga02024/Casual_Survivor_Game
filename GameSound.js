class GameSound{
    constructor(){ 
        // bgm
        this.background1 = WORLD.getObject('background1').getAudio();
        
        // foot step
        this.footstep1 = WORLD.getObject('footstep1').getAudio();
        this.foodstep2 = WORLD.getObject('foodstep22').getAudio();
        this.footstep3 = WORLD.getObject('footstep3').getAudio();
        this.footstep4 = WORLD.getObject('footstep4').getAudio();
        // item
        this.itemPickUp = WORLD.getObject('itemPickUp').getAudio();
        this.itemRespawn = WORLD.getObject('itemRespawn').getAudio();
        
        this.countdown = WORLD.getObject('countdown').getAudio();
        this.catchPlayer = WORLD.getObject('catchPlayer').getAudio();
        this.enermyFootSound = [];
        this.enermyFootSound.push(this.footstep1);
        this.enermyFootSound.push(this.foodstep2);
        
        this.randomNumFootSound = 0;
        
        this.init();
    }
    init(){
        this.randomNumFootSound = 0;
        if(this.background1.isPlaying === false) this.background1.play();
    }
    // playMainBGM(isActive){
    //     if(isActive){
    //         if(this.mainBGM.isPlaying === false) this.mainBGM.play();
    //     }else{
    //         if(this.mainBGM.isPlaying === true) this.mainBGM.stop();
    //     }
    // }
    playEnermyFootSFX(){
        this.randomNumFootSound = Math.floor(Math.random(0, this.enermyFootSound.length-1));
        if(this.enermyFootSound[this.randomNumFootSound].isPlaying) {
            this.enermyFootSound[this.randomNumFootSound].stop();
        }
        this.enermyFootSound[this.randomNumFootSound].play();
    }
    playPlayerFootSFX(){
        if(this.enermyFootSound[3].isPlaying) {
            this.enermyFootSound[3].stop();
        }
        this.enermyFootSound[3].play();
    }
    playGetItemSFX(){
        this.itemPickUp.play();
    }
    playSpwanItemSFX(){
        this.itemRespawn.play();
    }
    catchPlayerSFX(){
        if(this.catchPlayer.isPlaying) {
            this.catchPlayer.stop();
        }
        this.catchPlayer.play();
    }
    countdownSFX(){
        this.countdown.play();
    }
}

GLOBAL.GameSound = new GameSound();