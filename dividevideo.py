import os
import cv2
import matplotlib.pyplot as plt
import time
import random

# Video file should be the full video name
vid_file = "mgroad.mp4"
vid_name = "mgroad"

# for storing all the image names
image_names = []

#provide the image type, always save in jpeg, some issue with djangobackend with png files *do not change*
image_type = "jpeg"

#provide the random range in secs, *do not change*
low = 1
high = 5

# reading video file
cap = cv2.VideoCapture(vid_file)
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))

# getting the frame length of the video
position = 1
length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print( length )
frame_count = 1
number_of_pictures = 0
# Video Capture using OpenCV VideoCapture
start_time = time.time()

# Check if the webcam is opened correctly
if not cap.isOpened():
    raise IOError("Cannot open video")

# starting process
while frame_count < length - 1:
    # selecting a random number of skip frames within the range (low,high)
    # per second 30 frames
    skip = random.randint(low*30,high*30)
    current_count = 1
    print("skip : "+str(skip))

    while current_count != skip:
        ret, frame = cap.read()
        frame_count = frame_count + 1
        current_count = current_count + 1

    print("current_count : "+str(current_count))
    ret, frame = cap.read()
    frame_count = frame_count + 1
    if frame is not None:
        image_names.append("output_"+str(vid_name)+"_"+str(position)+"."+image_type)
        cv2.imwrite("Dividedframes/output_"+str(vid_name)+"_"+str(position)+"."+image_type, frame)
        number_of_pictures = number_of_pictures + 1
        position = position + 1

    print("frame_count : "+str(frame_count))

print("Images derived :")
print(image_names)
elapsed_time = time.time() - start_time
print("Performace measure : "+str(elapsed_time))
print("Number of pictures : "+str(number_of_pictures))
print("PLEASE CLEAN THE Diviedframes FOLDER AFTER EACH ITERATION")
