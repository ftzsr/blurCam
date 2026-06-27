const videoElement = document.querySelector(".input_video");
const status = document.getElementById("status");

function fingerUp(tip, pip){
    return tip.y < pip.y;
}

function detectPeace(landmarks){

    const indexUp = fingerUp(landmarks[8], landmarks[6]);

    const middleUp = fingerUp(landmarks[12], landmarks[10]);

    const ringDown =
        landmarks[16].y > landmarks[14].y;

    const pinkyDown =
        landmarks[20].y > landmarks[18].y;

    return (
        indexUp &&
        middleUp &&
        ringDown &&
        pinkyDown
    );
}

function onResults(results){

    let peaceDetected = false;

    if(results.multiHandLandmarks){

        for(const landmarks of results.multiHandLandmarks){

            if(detectPeace(landmarks)){
                peaceDetected = true;
                break;
            }

        }

    }

    if(peaceDetected){

        videoElement.classList.add("blur");
        status.innerHTML = "";

    }else{

        videoElement.classList.remove("blur");

        if(results.multiHandLandmarks){
            status.innerHTML = "";
        }else{
            status.innerHTML = "Waiting for hand...";
        }

    }

}

const hands = new Hands({

    locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});

hands.setOptions({

    maxNumHands:1,

    modelComplexity:1,

    minDetectionConfidence:0.7,

    minTrackingConfidence:0.7

});

hands.onResults(onResults);

const camera = new Camera(videoElement,{

    onFrame: async ()=>{

        await hands.send({
            image: videoElement
        });

    },

    width:1280,
    height:720

});

camera.start();