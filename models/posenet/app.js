let video;
let poseNet;
let pose;
function setup() {
  createCanvas(innerWidth, innerHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  const options = {
    // imageScaleFactor: 0.3,
    // outputStride: 16,
    flipHorizontal: true
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
  console.log("Model loded");
}
function draw() {
  image(video, 0, 0, width, height);
  fill(25, 78, 49);
  if (pose) {
    pose.pose.keypoints.forEach((part) => {
      ellipse(part.position.x, part.position.y, 15);
    });
    drawSkeleton(pose.pose.keypoints);
    console.log("Right Angle: ", getRightAngle());
    if (getRightAngle() > 75) {
      console.log("perfect");
    }
    console.log("Left Angle: ", getLeftAngle());
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
  for (let i = 5; i < 14; i += 2) {
    line(
      parts[i].position.x,
      parts[i].position.y,
      parts[i + 2].position.x,
      parts[i + 2].position.y
    );
    line(
      parts[i + 1].position.x,
      parts[i + 1].position.y,
      parts[i + 3].position.x,
      parts[i + 3].position.y
    );
    if (i == 7) i = 9;
    if (i == 5 || i == 11)
      line(
        parts[i].position.x,
        parts[i].position.y,
        parts[i + 1].position.x,
        parts[i + 1].position.y
      );
    if (i == 5 || i == 6) {
      line(
        parts[i].position.x,
        parts[i].position.y,
        parts[i + 6].position.x,
        parts[i + 6].position.y
      );
      line(
        parts[i + 1].position.x,
        parts[i + 1].position.y,
        parts[i + 7].position.x,
        parts[i + 7].position.y
      );
    }
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

const getLeftAngle = () => {
  let leftW = pose.pose.leftWrist;
  let leftE = pose.pose.leftElbow;
  let leftS = pose.pose.leftShoulder;
  let m1 = (leftW.y - leftE.y) / (leftW.x - leftE.x);
  let m2 = (leftS.y - leftE.y) / (leftS.x - leftE.x);
  let angle = atan((m1 - m2) / (1 + m1 * m2)) * (180 / PI);
  return angle;
};

// Id	Part
// 0	nose
// 1	leftEye
// 2	rightEye
// 3	leftEar
// 4	rightEar
// 5	leftShoulder
// 6	rightShoulder
// 7	leftElbow
// 8	rightElbow
// 9	leftWrist
// 10	rightWrist
// 11	leftHip
// 12	rightHip
// 13	leftKnee
// 14	rightKnee
// 15	leftAnkle
// 16	rightAnkle
