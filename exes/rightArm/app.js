let video;
let poseNet;
let pose;
function setup() {
  createCanvas(innerWidth, innerHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  const options = {
    flipHorizontal: false
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
      pose.pose.keypoints[5],
      pose.pose.keypoints[7],
      pose.pose.keypoints[9]
    ];
    parts.forEach((part) => {
      ellipse(part.position.x, part.position.y, 15);
    });
    drawSkeleton(parts);
    console.log("Left Angle: ", getLeftAngle());
    if (getLeftAngle() > 75 && getLeftAngle() < 90) {
      console.log("go up!");
    } else if (getLeftAngle() > 25) {
      console.log("perfect");
    }
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

const getLeftAngle = () => {
  let leftW = pose.pose.leftWrist;
  let leftE = pose.pose.leftElbow;
  let leftS = pose.pose.leftShoulder;
  let m1 = (leftW.y - leftE.y) / (leftW.x - leftE.x);
  let m2 = (leftS.y - leftE.y) / (leftS.x - leftE.x);
  let angle = -atan((m1 - m2) / (1 + m1 * m2)) * (180 / PI);
  return angle;
};

// Id	Part
// 5	leftShoulder
// 7	leftElbow
// 9	leftWrist
