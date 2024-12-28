// 데이터 저장 
function saveData(data) {
    const jsonData = JSON.stringify(data); // 데이터를 JSON 문자열로 변환
    // 로컬 스토리지에 저장
    localStorage.setItem('gameData_puzzle', jsonData);
    console.log("데이터가 저장되었습니다.");
}

// 데이터 로드 
function loadData() {
    const jsonData = localStorage.getItem('gameData_puzzle'); // 로컬 스토리지에서 데이터 가져오기
    if (jsonData) {
        const data = JSON.parse(jsonData); // JSON 문자열을 객체로 변환
        console.log("데이터가 로드되었습니다:", data);
        return data;
    } else {
        console.log("저장된 데이터가 없습니다.");
        return null;
    }
}

class DataManager {
    constructor(storage = new LocalStorageDataStorage()) {
        this.storage = storage;
        this.mapData = loadData() || {}; // 로드된 데이터가 있으면 그 값을 사용, 없으면 빈 객체
        this.initData();
    }
    initData() {
        this.pistolPiece = this.mapData.pistolPiece || 0;
        this.knifePiece = this.mapData.knifePiece || 0;
        this.pistolBullet = this.mapData.pistolBullet || 0;

        this.foodNum = this.mapData.foodNum || 0;
        this.waterNum = this.mapData.waterNum || 0;

        this.medicineNum = this.mapData.medicineNum || 0;

        this.key1 = this.mapData.key1 || 0;
        this.key2 = this.mapData.key2 || 0;
        this.key3 = this.mapData.key3 || 0;

        this.riflePiece = this.mapData.riflePiece || 0;
        this.pipePiece = this.mapData.pipePiece || 0;
        this.rifleBullet = this.mapData.rifleBullet || 0;

        this.axePiece = this.mapData.axePiece || 0;
        this.sniperPiece = this.mapData.sniperPiece || 0;
        this.sniperBullet = this.mapData.sniperBullet || 0;
    }
    addMap1Data(pistolPiece, knifePiece, pistolBullet) {
        this.pistolPiece += pistolPiece;
        this.knifePiece += knifePiece;
        this.pistolBullet += pistolBullet;

        this.saveGameData();
    }
    addMap2Data(foodNum, waterNum) {
        this.foodNum += foodNum;
        this.waterNum += waterNum;

        this.saveGameData();
    }
    addMap3Data(medicineNum) {
        this.medicineNum += medicineNum;

        this.saveGameData();
    }
    addMap4Data(key1, key2, key3) {
        this.key1 += key1;
        this.key2 += key2;
        this.key3 += key3;

        this.saveGameData();
    }
    addMap5Data(riflePiece, pipePiece, rifleBullet) {
        this.riflePiece += riflePiece;
        this.pipePiece += pipePiece;
        this.rifleBullet += rifleBullet;

        this.saveGameData();
    }
    addMap6Data(axePiece, sniperPiece, sniperBullet) {
        this.axePiece += axePiece;
        this.sniperPiece += sniperPiece;
        this.sniperBullet += sniperBullet;

        this.saveGameData();
    }
    saveGameData() {
        const gameData = {
            pistolPiece: this.pistolPiece,
            knifePiece: this.knifePiece,
            pistolBullet: this.pistolBullet,

            foodNum: this.foodNum,
            waterNum: this.waterNum,

            medicineNum: this.medicineNum,

            key1: this.key1,
            key2: this.key2,
            key3: this.key3,

            riflePiece: this.riflePiece,
            pipePiece: this.pipePiece,
            rifleBullet: this.rifleBullet,

            axePiece: this.axePiece,
            sniperPiece: this.sniperPiece,
            sniperBullet: this.sniperBullet
        };
        saveData(gameData); // 데이터 저장
    }
}

class LocalStorageDataStorage {
    getItem(key) {
        return localStorage.getItem(key);
    }
    setItem(key, value) {
        localStorage.setItem(key, value);
    }
}

GLOBAL.DataManager = new DataManager();
