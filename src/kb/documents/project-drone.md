# Project: Autonomous Fire Detection & Extinguishing Drone

Graduation project (مشروع التخرج), six-person team, academic year 2023/2024. Grade: A+. Closed-source academic project — no public repository; all facts come from the official project report/presentation.

## What it does

Autonomous quadcopter detects fire in real time using a custom-trained YOLOv8 model running on a Raspberry Pi 3, sends alerts with bounding-box locations, and was engineered around an AFO fire-extinguishing-ball payload for suppression (درون لكشف الحرائق وإطفائها).

## AI / computer vision

YOLOv8 object detection trained on a prepared fire dataset. Verified metrics: mAP@50 ≈ 0.824, Precision ≈ 0.83, ~754 validation images. Workflow: data collection → data processing → model training → loading onto the drone → system testing. Real-time inference onboard.

## Hardware

Raspberry Pi 3 (primary compute), APM 2.8 flight controller running ArduCopter (stabilized flight, position hold, waypoint missions), 4× 2200kV brushless motors, 4× ESCs with PWM control, LiPo battery, power distribution board, voltage regulator, aluminum frame, Raspberry Pi camera module.

## Software

Python, YOLOv8, OpenCV, Mission Planner (motor/ESC/axis/compass calibration and ground station), Pygame + pySerial for PS4 controller manual override linked to the APM 2.8 through the Pi, serial telemetry.

## Extinguishing payload design

AFO Fire Extinguishing Ball: activates automatically within 3–5 seconds of flame contact, disperses SGS-approved non-toxic ABC dry powder, covers up to ~4 square meters. Honest limitation: the ball could not be procured — the vendor restricted sales to specific institutions and the price was high — so suppression remained a designed subsystem documented in the report, while detection flew for real.

## Challenges documented

Model overfitting risk on training data; propeller safety precautions; high initial cost; extinguishing ball procurement restrictions.

## Why it matters

Unusual combination of AI + computer vision + robotics + embedded systems + hardware integration — software meeting the physical world.
