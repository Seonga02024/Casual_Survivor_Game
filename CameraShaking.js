// 카메라 관련 스크립트 
const camera = WORLD.getObject("MainCamera");

function Start() {
	REDBRICK.Signal.addListener("SHAKE_CAMERA", function(params) {
        t_shakeCamera(params.shakeDuration, params.shakeMagnitude, params.shakeSize); // 적을 타격할 때 카메라 흔들기
    });
}

// 카메라 흔들기
function t_shakeCamera(shakeDuration, shakeMagnitude, shakeSize) {
    const originalPosition = camera.position.clone(); // 원래 카메라 위치 저장
    const startTime = performance.now(); // 애니메이션 시작 시간

    function updateShake() {
        const elapsed = performance.now() - startTime; // 경과 시간 계산

        if (elapsed < shakeDuration) {
            // 흔드는 효과 적용
            const x = (Math.random() - shakeSize) * shakeMagnitude;
            const y = (Math.random() - shakeSize) * shakeMagnitude;

            camera.position.set(
                originalPosition.x + x,
                originalPosition.y + y,
                originalPosition.z
            );

            requestAnimationFrame(updateShake); // 다음 프레임에 업데이트
        } else {
            // 원래 위치로 복구
            camera.position.copy(originalPosition);
        }
    }

    updateShake(); // 흔들기 시작
}
