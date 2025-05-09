// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX = 320; // 圓形初始位置 X
let circleY = 240; // 圓形初始位置 Y
let circleSize = 100; // 圓形大小
let isDragging = false; // 用於追蹤是否正在拖動圓
let previousX, previousY; // 儲存圓心的前一個位置
let isDraggingLeft = false; // 用於追蹤左手是否正在拖動圓
let paths = []; // 儲存所有畫過的軌跡
let circleColor = [0, 255, 0]; // 初始圓形顏色為綠色

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製所有已畫過的軌跡
  strokeWeight(10);
  for (let path of paths) {
    stroke(path.color);
    line(path.x1, path.y1, path.x2, path.y2);
  }

  // 繪製圓形
  fill(circleColor);
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting specific keypoints
        stroke(0);
        strokeWeight(2);

        // Connect keypoints 0 to 4
        for (let i = 0; i < 4; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 5 to 8
        for (let i = 5; i < 8; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 9 to 12
        for (let i = 9; i < 12; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 13 to 16
        for (let i = 13; i < 16; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 16 to 20
        for (let i = 16; i < 20; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // 檢查左手是否夾住圓形
        if (hand.handedness === "Left") {
          let fingertip = hand.keypoints[8];
          let thumbtip = hand.keypoints[4];
          let d1 = dist(fingertip.x, fingertip.y, circleX, circleY);
          let d2 = dist(thumbtip.x, thumbtip.y, circleX, circleY);

          if (d1 < circleSize / 2 && d2 < circleSize / 2) {
            // 更新圓形位置為食指與大拇指的中間位置
            let newX = (fingertip.x + thumbtip.x) / 2;
            let newY = (fingertip.y + thumbtip.y) / 2;

            // 如果正在拖動，記錄軌跡
            if (isDraggingLeft) {
              paths.push({
                x1: circleX,
                y1: circleY,
                x2: newX,
                y2: newY,
                color: [0, 255, 0], // 綠色
              });
              circleColor = [0, 255, 0]; // 更新圓形顏色為綠色
            }

            circleX = newX;
            circleY = newY;
            isDraggingLeft = true; // 開始畫軌跡
          } else {
            isDraggingLeft = false; // 停止畫軌跡
          }
        }

        // 檢查右手是否夾住圓形 (假設右手畫紅色線條)
        if (hand.handedness === "Right") {
          let fingertip = hand.keypoints[8];
          let thumbtip = hand.keypoints[4];
          let d1 = dist(fingertip.x, fingertip.y, circleX, circleY);
          let d2 = dist(thumbtip.x, thumbtip.y, circleX, circleY);

          if (d1 < circleSize / 2 && d2 < circleSize / 2) {
            // 更新圓形位置為食指與大拇指的中間位置
            let newX = (fingertip.x + thumbtip.x) / 2;
            let newY = (fingertip.y + thumbtip.y) / 2;

            // 如果正在拖動，記錄軌跡
            if (isDragging) {
              paths.push({
                x1: circleX,
                y1: circleY,
                x2: newX,
                y2: newY,
                color: [255, 0, 0], // 紅色
              });
              circleColor = [255, 0, 0]; // 更新圓形顏色為紅色
            }

            circleX = newX;
            circleY = newY;
            isDragging = true; // 開始畫軌跡
          } else {
            isDragging = false; // 停止畫軌跡
          }
        }
      }
    }
  } else {
    isDraggingLeft = false; // 停止畫軌跡
    isDragging = false; // 停止畫軌跡
  }
}
