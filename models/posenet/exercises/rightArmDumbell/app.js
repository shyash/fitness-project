let video;
let poseNet;
let pose;
function setup() {
  createCanvas(innerWidth, innerHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  const options = {
    // imageScaleFactor: 0.1,
    // outputStride: 16,
    flipHorizontal: false
    // minConfidence: 0.5,
    // maxPoseDetections: 5,
    // scoreThreshold: 0.5,
    // nmsRadius: 20,
    // detectionType: 'single',
    // multiplier: 0.75,
  };
  poseNet = ml5.poseNet(video, options, modelLoaded);
  poseNet.on("pose", gotPoses);
  video.hide();
}

function gotPoses(poses) {
  if (poses.length) {
    pose = poses[0];
  }
}

function modelLoaded() {
  console.log("Model loaded");
}
function draw() {
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  fill(25, 78, 49);
  if (pose) {
    const parts = [
      pose.pose.keypoints[6],
      pose.pose.keypoints[8],
      pose.pose.keypoints[10]
    ];
    parts.forEach((part) => {
      ellipse(part.position.x, part.position.y, 15);
    });
    drawSkeleton(parts);
    console.log("Right Angle: ", getRightAngle());
    if (getRightAngle() > 75 && getRightAngle() < 90) {
      console.log("go up!");
    } else if (getRightAngle() > 25) {
      console.log("perfect");
    }
    // console.log("Left Angle: ", getLeftAngle());
    // let leftW = pose.pose.leftWrist

    // if (abs(leftW.x-rightW.x) < 500) {
    //     fill(0,255,0)
    //     ellipse((leftW.x+rightW.x)/2,leftW.y-10-150,300)
    // }
  }
}
function drawSkeleton(parts) {
  stroke(255);
  strokeWeight(3);

  for (let i = 0; i < parts.length - 1; i++) {
    line(
      parts[i].position.x,
      parts[i].position.y,
      parts[i + 1].position.x,
      parts[i + 1].position.y
    );
  }
}

const getRightAngle = () => {
  let rightW = pose.pose.rightWrist;
  let rightE = pose.pose.rightElbow;
  let rightS = pose.pose.rightShoulder;
  let m1 = (rightW.y - rightE.y) / (rightW.x - rightE.x);
  let m2 = (rightS.y - rightE.y) / (rightS.x - rightE.x);
  let angle = atan((m1 - m2) / (1 + m1 * m2)) * (180 / PI);
  return angle;
};

// const getLeftAngle = () => {
//   let leftW = pose.pose.leftWrist;
//   let leftE = pose.pose.leftElbow;
//   let leftS = pose.pose.leftShoulder;
//   let m1 = Math.abs((leftW.y - leftE.y) / (leftW.x - leftE.x));
//   let m2 = Math.abs((leftS.y - leftE.y) / (leftS.x - leftE.x));
//   let angle = atan((m1 - m2) / (1 + m1 * m2)) * (180 / PI);
//   return angle;
// };

// Id	Part
// 6	rightShoulder
// 8	rightElbow
// 10	rightWrist
