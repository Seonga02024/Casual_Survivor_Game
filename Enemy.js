class MoveBehavior {
    move(enemy, blocks) {
        throw new Error("move() must be implemented.");
    }
}

class DistanceCalculator {
    calculate(currentBlock, target) {
        throw new Error("calculate() must be implemented.");
    }
}

// 장애물 고려한 움직임
class SimpleMove extends MoveBehavior {
    move(enemy, blocks) {
        let closeBlock = null;
        let closeBlockNum = -1;
        
        if (enemy.blockMap[enemy.currentPos].forwardB) {
            closeBlockNum = enemy.calculateDistance(closeBlockNum, closeBlock, enemy.blockMap[enemy.currentPos].forwardB);
            closeBlock = blocks[closeBlockNum];
        }
        if (enemy.blockMap[enemy.currentPos].backB) {
            closeBlockNum = enemy.calculateDistance(closeBlockNum, closeBlock, enemy.blockMap[enemy.currentPos].backB);
            closeBlock = blocks[closeBlockNum];
        }
        if (enemy.blockMap[enemy.currentPos].leftB) {
            closeBlockNum = enemy.calculateDistance(closeBlockNum, closeBlock, enemy.blockMap[enemy.currentPos].leftB);
            closeBlock = blocks[closeBlockNum];
        }
        if (enemy.blockMap[enemy.currentPos].rightB) {
            closeBlockNum = enemy.calculateDistance(closeBlockNum, closeBlock, enemy.blockMap[enemy.currentPos].rightB);
            closeBlock = blocks[closeBlockNum];
        }

        enemy.moveBlock(blocks[enemy.currentPos], closeBlock, closeBlockNum);
    }
}

// 장애물 고려하지 않은 움직임
class FollowPlayerMove extends MoveBehavior {
    move(enemy, blocks) {
        let closestBlock = null;
        let minDistance = Infinity;
        for (let i = 0; i < blocks.length; i++) {
            let distance = blocks[i].position.distanceTo(enemy.player.position);
            if (distance < minDistance) {
                minDistance = distance;
                closestBlock = blocks[i];
            }
        }
        enemy.moveBlock(blocks[enemy.currentPos], closestBlock, closestBlock);
    }
}

// 맨하탄 거리 계산법
class ManhattanDistanceCalculator extends DistanceCalculator {
    calculate(currentBlock, target) {
        return Math.abs(currentBlock.position.x - target.position.x) + Math.abs(currentBlock.position.z - target.position.z);
    }
}

// 유클리드 거리 계산법
class EuclideanDistanceCalculator extends DistanceCalculator {
    calculate(currentBlock, target) {
        let dx = currentBlock.position.x - target.position.x;
        let dz = currentBlock.position.z - target.position.z;
        return Math.sqrt(dx * dx + dz * dz); 
    }
}

class EnemyAnimation {
    static moveBlock(enemy, startB, endB, nextPos) {
        enemy.time = 0;
        enemy.isAnimationFinish = false;
        const tween = new TWEEN.Tween({ x: startB.position.x, y: startB.position.y + 2, z: startB.position.z })
            .to({ x: endB.position.x, y: endB.position.y + 2, z: endB.position.z }, 1500 / enemy.moveSpeed)
            .onUpdate(({ x, y, z }) => {
                const currentHeight = Math.sin(enemy.time * 2 * enemy.moveSpeed) * 5;
                enemy.object.position.set(x, y + currentHeight, z);
            })
            .onComplete(() => {
                enemy.currentPos = nextPos;
                GLOBAL.GameSound.playEnermyFootSFX();
                enemy.isAnimationFinish = true;
                // 플레이어랑 가까이 있으면 카메라 흔들리는 효과 줌 
                let distanceToPlayer = enemy.object.position.distanceTo(enemy.player.position);
                if (distanceToPlayer < 8) {
                    REDBRICK.Signal.send("SHAKE_CAMERA", {
                        shakeDuration: 200, // 흔들리는 시간 500
                        shakeMagnitude: 0.4, // 흔들림 크기
                        shakeSize: 0.5
                    });
                }
            })
            .start();
    }
}

class Enermy {
    constructor(id, obj, currentPos, movingTerm, moveSpeed, blocks, blockMap, player) {
        this.id = id;
        this.object = obj;
        this.movingTerm = movingTerm;
        this.moveSpeed = moveSpeed;
        this.blocks = blocks;
        this.blockMap = blockMap;
        this.currentPos = currentPos;
        this.player = player;
        
        this.initMovingTerm = movingTerm;
        this.initMoveSpeed = moveSpeed;

        this.time = 0;
        this.currentTime = 0;
        this.isGameStart = false;
        this.isCatchPlayer = false;
        
        this.currentlevelUpTime = 0;
        this.levelUpTime = 30;
        this.level = 0;
        this.isAnimationFinish = true;

        this.moveBehavior = new SimpleMove(); // 기본 이동 방식
        this.distanceCalculator = new EuclideanDistanceCalculator(); // 기본 거리 계산 방식
        this.object.position.set(this.blocks[this.currentPos].position.x , this.blocks[this.currentPos].position.y+2, this.blocks[this.currentPos].position.z);
        this.init();
    }

    init() {
        this.time = 0;
        this.currentTime = 0;
        this.isGameStart = false;
        this.isCatchPlayer = false;
        this.isAnimationFinish = true;
        this.movingTerm = this.initMovingTerm;
        this.moveSpeed = this.initMoveSpeed;
        
        console.log("enemy init : " + this.initMovingTerm + " " + this.initMoveSpeed);
    }

    setMoveBehavior(moveBehavior) {
        this.moveBehavior = moveBehavior;
    }

    setDistanceCalculator(distanceCalculator) {
        this.distanceCalculator = distanceCalculator;
    }

    calculateDistance(currentCloseBlockNum, currentCloseBlock, otherBlockNum) {
        if (currentCloseBlockNum !== -1) {
            let obj = this.blocks[otherBlockNum - 1];
            let diff1 = this.distanceCalculator.calculate(currentCloseBlock, this.player);
            let diff2 = this.distanceCalculator.calculate(obj, this.player);
            if (diff1 > diff2) {
                return otherBlockNum - 1;
            } else {
                return currentCloseBlockNum;
            }
        } else {
            return otherBlockNum - 1;
        }
    }

    move() {
        this.moveBehavior.move(this, this.blocks);
    }

    update(dt) {
        if (this.isGameStart) {
            this.time += dt;
            this.currentTime += dt;
            this.currentlevelUpTime += dt;
            if (this.currentTime > this.movingTerm && this.isAnimationFinish) {
                this.move();
                this.currentTime = 0;
            }
            let distanceToPlayer = this.object.position.distanceTo(this.player.position);
            if (distanceToPlayer < 3 && this.isCatchPlayer === false) {
                this.isCatchPlayer = true;
                GLOBAL.GameSound.catchPlayerSFX();
                REDBRICK.Signal.send("GAME_OVER", {
                    enemyID: this.id
                });
            }
            if (this.currentlevelUpTime > this.levelUpTime) {
                this.level += 1;
                this.currentlevelUpTime = 0;
                if (this.movingTerm > 1.5) this.movingTerm -= 0.05;
                if (this.moveSpeed > 1.5) this.moveSpeed -= 0.1;
            }
        }
    }

    moveBlock(StartB, endB, nextPos) {
        EnemyAnimation.moveBlock(this, StartB, endB, nextPos);
    }
}

GLOBAL.Enermy = Enermy;
