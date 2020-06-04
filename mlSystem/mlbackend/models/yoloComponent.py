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

# IOU Utils
from models.iouUtils import iouForImageTextBoxPP,balanceDifference

# darkflow component
from darkflow.net.build import TFNet

#for yolo9000
yolo9000 = {"model" : "cfg/yolo9000.cfg", "load" : "Weights/yolo9000.weights", "threshold": 0.01}
tfnet = TFNet(yolo9000)

@csrf_exempt
def yolo(request):
    # Decoding received data
    decodeddata = request.body.decode('utf-8')
    dictdata = ast.literal_eval(decodeddata)
    username = dictdata["userName"]
    imagename = dictdata["imageName"]
    imageurl = dictdata["imageUrl"]
    coordinates = dictdata["Coordinates"]
    serverurl = dictdata["server"]
    apiurl = dictdata["api"]
    annotationsLabel = dictdata["annotationLabels"]
    imagetype = imagename.split('.')[1]
    saveimageindjango = 'assets/yoloOutput_'+username+"_"+imagename

    # Pre-processing variables
    start_time = time.time()
    IoU = []
    coordinates = coordinates.split("\n")
    coordinates.pop(0)
    numberOfAnnotation = len(coordinates)

    # Reading image from the URL
    url = imageurl
    req = urllib.request.urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1) # 'Load it as it is'
    img_h = img.shape[0]
    img_w = img.shape[1]
    img_d = img.shape[2]

    # Converting (?,h,w,d,pngdim,1) png config to (?,h,w,d,1) jpg/jpeg config
    if imagetype == "png" or img_d == 4:
        cv2.imwrite(saveimageindjango, img)
        img = cv2.imread(saveimageindjango)

    imgcv = img
    result = tfnet.return_predict(imgcv)
    count = 0

    # Checking IoU for recognised objects
    for res in result:
        if res["label"] == "whole":
            continue
        else:
            top = (res["topleft"]["x"], res["topleft"]["y"])
            bottom = (res["bottomright"]["x"], res["bottomright"]["y"])

            # For each object recognised check IoU, Only add IoU if the objects are annotated objects
            (boxIou,flag) = iouForImage(top,bottom,coordinates,res["label"],annotationsLabel)
            if flag:
                count = count + 1
                IoU.append(boxIou)
                cv2.rectangle(imgcv, top, bottom, (255,0,0) , 2)

    # Balance the difference if the algorithm has missed any annotated objects and find average
    IoU = balanceDifference(count,numberOfAnnotation,IoU)
    averageIoU = np.mean(IoU)
    print("process complete")


    # Sending to NodeServer
    elapsed_time = time.time() - start_time
    cv2.imwrite(saveimageindjango, imgcv)
    files = {'file': open(saveimageindjango, 'rb')}
    headers = {
        'username': username,
    }
    response = requests.request("POST", serverurl+'/upload', files=files, headers=headers)

    # Saving IoU
    headers = {
        'username': username,
        'data' : str(averageIoU),
    }
    response = requests.request("POST", serverurl+'/saveIoUYolo',files=files,headers=headers)
    print("return complete")

    context = {"data":"data"}
    return render(request, 'index.html', context)
