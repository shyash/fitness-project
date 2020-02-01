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
      pose.pose.keypoints[4],
      pose.pose.keypoints[6],
      pose.pose.keypoints[8],
      pose.pose.keypoints[10],
      pose.pose.keypoints[12],
      pose.pose.keypoints[14],
      pose.pose.keypoints[16]
    ];

    parts.forEach((part) => {
      ellipse(part.position.x, part.position.y, 15);
    });
    drawSkeleton(parts);
    const theta1 = calcAngle(parts[1], parts[2], parts[4]);
    if (theta1 < 70) {
      stroke(240, 0, 0);
      strokeWeight(5);
      line(
        parts[1].position.x,
        parts[1].position.y,
        parts[2].position.x,
        parts[2].position.y
      );
      line(
        parts[1].position.x,
        parts[1].position.y,
        parts[4].position.x,
        parts[4].position.y
      );

      stroke(255);
    }
    // const theta2 = calcAngle(parts[4], parts[5], parts[6]);
    // if (theta1 < 70) {
    //   stroke(240, 0, 0);
    //   strokeWeight(5);
    //   line(
    //     parts[1].position.x,
    //     parts[1].position.y,
    //     parts[2].position.x,
    //     parts[2].position.y
    //   );
    //   line(
    //     parts[1].position.x,
    //     parts[1].position.y,
    //     parts[4].position.x,
    //     parts[4].position.y
    //   );

    //   stroke(255);
    // }
    if (Math.abs(parts[1].position.x - parts[4].position.x) > 100) {
      stroke(0, 200, 0);
      strokeWeight(5);
      line(
        parts[1].position.x,
        parts[1].position.y,
        parts[4].position.x,
        parts[4].position.y
      );
      console.log("problem");
      stroke(255);
    }
    if (Math.abs(parts[1].position.x - parts[4].position.x) > 200) {
      stroke(0, 200, 0);
      strokeWeight(5);
      line(
        parts[1].position.x,
        parts[1].position.y,
        parts[4].position.x,
        parts[4].position.y
      );
      console.log("problem");
      stroke(255);
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

  for (let i = 1; i < parts.length - 1; i++) {
    if (i != 3) {
      line(
        parts[i].position.x,
        parts[i].position.y,
        parts[i + 1].position.x,
        parts[i + 1].position.y
      );
    }
  }
  stroke(25, 84, 240);
  strokeWeight(2);
  line(
    parts[0].position.x,
    parts[0].position.y,
    parts[1].position.x,
    parts[1].position.y
  );

  stroke(255);
  strokeWeight(3);
  line(
    parts[1].position.x,
    parts[1].position.y,
    parts[4].position.x,
    parts[4].position.y
  );
}
function calcAngle(p1, p2, p3) {
  let m1 = (p1.position.y - p2.position.y) / (p1.position.x - p2.position.x);

  let m2 = (p3.position.y - p2.position.y) / (p3.position.x - p2.position.x);

  let angle = atan((m1 - m2) / (1 + m1 * m2)) * (180 / PI);
  return angle;
}
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

// Id	Part

// 4	rightEar
// 6	rightShoulder
// 8	rightElbow
// 10	rightWrist
// 12	rightHip
// 14	rightKnee
// 16	rightAnkle
