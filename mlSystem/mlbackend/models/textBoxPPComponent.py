from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

# textbox++ models
from textBoxPPUtils.tbpp_model import TBPP512, TBPP512_dense
from textBoxPPUtils.tbpp_utils import PriorUtil

# ssd for help
from textBoxPPUtils.ssd_data import preprocess
from textBoxPPUtils.sl_utils import rbox3_to_polygon, polygon_to_rbox, rbox_to_polygon
from textBoxPPUtils.ssd_data import preprocess
import tensorflow as tf
# General Utils
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

# Starting the model here.1
Model = TBPP512_dense
input_shape = (512,512,3)
weights_path = 'Weights/weights.022.h5'
confidence_threshold = 0.35
confidence_threshold = 0.25
sl_graph = tf.Graph()
with sl_graph.as_default():
    sl_session = tf.Session()
    with sl_session.as_default():
        sl_model = Model(input_shape)
        prior_util = PriorUtil(sl_model)
        sl_model.load_weights(weights_path, by_name=True)

input_width = 256
input_height = 32

@csrf_exempt
def textBoxPP(request):
    # Decoding data, can use annotationLabels to train Image to Text coversion algorithms (OCR algorithms)
    decodeddata = request.body.decode('utf-8')
    dictdata = ast.literal_eval(decodeddata)
    username = dictdata["userName"]
    imagename = dictdata["imageName"]
    imageurl = dictdata["imageUrl"]
    coordinates = dictdata["Coordinates"]
    annotationLabels = dictdata["annotationLabels"]
    serverurl = dictdata["server"]
    apiurl = dictdata["api"]
    imagetype = imagename.split('.')[1]

    start_time = time.time()

    # Pre-process variables
    IoU = []
    coordinates = coordinates.split("\n")
    coordinates.pop(0)
    numberOfAnnotation = len(coordinates)
    input_size = input_shape[:2]

    # Reading image from the URL
    url = imageurl
    req = urllib.request.urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1) # 'Load it as it is'
    img_h = img.shape[0]
    img_w = img.shape[1]
    img_d = img.shape[2]
    img = np.array(img)
    img1 = np.copy(img)

    # model to predict
    x = np.array([preprocess(img, input_size)])

    elapsed_time = time.time() - start_time

    #Model start
    start_time = time.time()
    with sl_graph.as_default():
        with sl_session.as_default():
            y = sl_model.predict(x)

    elapsed_time = time.time() - start_time
    #Model end

    # Check IoU for recognised boxes
    start_time = time.time()
    result = prior_util.decode(y[0], confidence_threshold)
    count = 0
    if len(result) > 0:
        count = count + 1
        bboxs = result[:,0:4]
        quads = result[:,4:12]
        rboxes = result[:,12:17]
        boxes = np.asarray([rbox3_to_polygon(r) for r in rboxes])

        xy = boxes
        xy = xy * [img_w, img_h]
        xy = np.round(xy)
        xy = xy.astype(np.int32)
        cv2.polylines(img1, tuple(xy), True, (0,0,255))

        # For each box detected, check IoU
        for values in xy:
            top = (values[0][0], values[0][1])
            bottom = (values[2][0], values[2][1])
            IoU.append(iouForImageTextBoxPP(top,bottom,coordinates))

        if len(boxes) == 0:
            boxes = np.empty((0,8))

    # Balance the difference if the algorithm has missed any annotated objects and find average
    IoU = balanceDifference(count,numberOfAnnotation,IoU)
    averageIoU = np.mean(IoU)
    print("process complete")
    # Saving to backend
    saveimageindjango = 'assets/textBoxPPOutput_'+username+"_"+imagename
    cv2.imwrite(saveimageindjango, img1)
    elapsed_time = time.time() - start_time

    files = {'file': open(saveimageindjango, 'rb')}
    headers = {
        'username': username,
    }

    # Sending to NodeServer
    response = requests.request("POST", serverurl+'/upload', files=files, headers=headers)
    headers = {
        'username': username,
        'data' : str(averageIoU),
    }
    # Saving IoU
    response = requests.request("POST", serverurl+'/saveIoUTextBoxPP',files=files,headers=headers)
    print("return complete")

    context = {"data":"data"}
    return render(request, 'index.html', context)
