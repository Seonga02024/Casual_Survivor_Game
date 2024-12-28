// Block class 
// 값이 없으면 null, 값이 있으면 그 볼록 인덱스 번호가 들어가 있음 
class Block{
    constructor(id, rightB = null, leftB = null, forwardB = null, backB = null) {
        this.id = id; // 순서 
        this.rightB = rightB; // 왼쪽 블록 
        this.forwardB = forwardB; // 위쪽 블록 
        this.backB = backB; // 밑 블록 
        this.leftB = leftB; // 왼쪽 블록 
    }
}

GLOBAL.Block = Block;