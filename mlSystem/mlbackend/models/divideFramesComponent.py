from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

# to read images from urls
import os
import time
import ast
import urllib.request
from io import BytesIO

# to read images from urls
import PIL
from PIL import Image
import cv2
import random
import requests
import numpy as np

@csrf_exempt
def dividetheframes(request):
    decodeddata = request.body.decode('utf-8')
    dictdata = ast.literal_eval(decodeddata)
    username = dictdata["userName"]
    serverurl = dictdata["server"]
    apiurl = dictdata["api"]

    # Video input
    vid_name = dictdata["videoName"]
    vid_url = dictdata["videoUrl"]
    #provide the image type
    img_type = dictdata["imageType"]
    #provide the random range in secs
    low = int(dictdata["low"])
    high = int(dictdata["high"])

    # for storing all the image names
    imagenames = []

    # reading video file
    cap = cv2.VideoCapture(vid_url)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    # getting the frame length of the video
    position = 1
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_count = 1

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
        while current_count != skip:
            ret, frame = cap.read()
            frame_count = frame_count + 1
            current_count = current_count + 1

        ret, frame = cap.read()
        frame_count = frame_count + 1

        # Saving the retrieved frames
        if frame is not None:
            imagenames.append("output_"+str(vid_name)+"_"+str(position)+"."+img_type)
            cv2.imwrite("assets/output_"+str(vid_name)+"_"+str(position)+"."+img_type, frame)
            position = position + 1

    elapsed_time = time.time() - start_time

    # Sending to NodeServer
    for images in imagenames:
        files = {'file': open('assets/'+images, 'rb')}
        headers = {
            'username': username,
        }
        response = requests.request("POST", serverurl+'/upload', files=files, headers=headers)

    # Adding to DB through API
    fileNames = ""
    for images in imagenames:
        if fileNames == "":
            fileNames = images
        else:
            fileNames = fileNames + ","+images

    sendImageDataToApi = {'username':username,'filenames':fileNames}
    response = requests.request("POST",apiurl+"/insertimagedata",json = {'username':username,'filenames':fileNames})

    context = {"data":"data"}
    return render(request, 'index.html', context)
