from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.template import Context, loader
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.template import Context, loader
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_exempt
import json

# to read images from urls
import os
import time
import ast
import urllib.request

# to read images from urls
import PIL
from PIL import Image
import cv2
import random
import requests
from darkflow.net.build import TFNet
import tensorflow as tf
print(tf.__version__)
import numpy as np
from timeit import default_timer as timer

# textbox++ models
from tbpp_model import TBPP512, TBPP512_dense
from tbpp_utils import PriorUtil

# ssd for help
from ssd_data import preprocess
from sl_utils import rbox3_to_polygon, polygon_to_rbox, rbox_to_polygon
from io import BytesIO
from ssd_data import preprocess

#for yolo9000
yolo9000 = {"model" : "cfg/yolo9000.cfg", "load" : "yolo9000.weights", "threshold": 0.01}
tfnet = TFNet(yolo9000)

# Starting the model here.1
Model = TBPP512_dense
input_shape = (512,512,3)
weights_path = 'weights.022.h5'
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
weights_path = 'weights.022.h5'

def get_iou(bb1, bb2):
    """
    Calculate the Intersection over Union (IoU) of two bounding boxes.

    Parameters
    ----------
    bb1 : dict
        Keys: {'x1', 'x2', 'y1', 'y2'}
        The (x1, y1) position is at the top left corner,
        the (x2, y2) position is at the bottom right corner
    bb2 : dict
        Keys: {'x1', 'x2', 'y1', 'y2'}
        The (x, y) position is at the top left corner,
        the (x2, y2) position is at the bottom right corner

    Returns
    -------
    float
        in [0, 1]
    """
    assert bb1['x1'] < bb1['x2']
    assert bb1['y1'] < bb1['y2']
    assert bb2['x1'] < bb2['x2']
    assert bb2['y1'] < bb2['y2']

    # determine the coordinates of the intersection rectangle
    x_left = max(bb1['x1'], bb2['x1'])
    y_top = max(bb1['y1'], bb2['y1'])
    x_right = min(bb1['x2'], bb2['x2'])
    y_bottom = min(bb1['y2'], bb2['y2'])

    if x_right < x_left or y_bottom < y_top:
        return 0.0

    # The intersection of two axis-aligned bounding boxes is always an
    # axis-aligned bounding box
    intersection_area = (x_right - x_left ) * (y_bottom - y_top )

    # compute the area of both AABBs
    bb1_area = (bb1['x2'] - bb1['x1'] ) * (bb1['y2'] - bb1['y1'] )
    bb2_area = (bb2['x2'] - bb2['x1'] ) * (bb2['y2'] - bb2['y1'] )

    # compute the intersection over union by taking the intersection
    # area and dividing it by the sum of prediction + ground-truth
    # areas - the interesection area
    iou = intersection_area / float(bb1_area + bb2_area - intersection_area)
    assert iou >= 0.0
    assert iou <= 1.0
    return iou

@csrf_exempt
def dividetheframes(request):
    decodeddata = request.body.decode('utf-8')
    dictdata = ast.literal_eval(decodeddata)
    username = dictdata["userName"]

    # Video input
    vid_name = dictdata["videoName"]
    vid_url = dictdata["videoUrl"]
    #provide the image type
    img_type = dictdata["imageType"]
    #provide the random range in secs
    low = int(dictdata["low"])
    high = int(dictdata["high"])

    print("username : " + username)
    print("vid_url : "+vid_url)
    print("vid_name :"+vid_name)
    print("img_type : "+img_type)
    print("low : "+str(low))
    print("high : "+str(high))

    # for storing all the image names
    image_names = []

    # reading video file
    cap = cv2.VideoCapture(vid_url)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    # getting the frame length of the video
    position = 1
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print( length )
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
        print("skip : "+str(skip))

        while current_count != skip:
            ret, frame = cap.read()
            frame_count = frame_count + 1
            current_count = current_count + 1

        print("current_count : "+str(current_count))
        ret, frame = cap.read()
        frame_count = frame_count + 1
        if frame is not None:
            image_names.append("output_"+str(vid_name)+"_"+str(position)+"."+img_type)
            cv2.imwrite("assets/output_"+str(vid_name)+"_"+str(position)+"."+img_type, frame)
            position = position + 1

        print("frame_count : "+str(frame_count))

    print("Images derived :")
    print(image_names)
    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))

    for images in image_names:
        print("Sending to back end...")
        print("image name : "+images)
        files = {'file': open('assets/'+images, 'rb')}
        headers = {
            'username': username,
        }
        response = requests.request("POST", 'http://localhost:4000/upload', files=files, headers=headers)
        print(response)

    sendImageDataToApi = username
    for images in image_names:
        sendImageDataToApi = sendImageDataToApi + ","+images

    print("data being sent to Go API: "+sendImageDataToApi)
    response = requests.request("POST","http://localhost:8080/insertimagedata",data = sendImageDataToApi)
    print(response)

    print("Backend Process Complete")
    context = {"data":"data"}
    return render(request, 'index.html', context)

@csrf_exempt
def yolo(request):
    decodeddata = request.body.decode('utf-8')
    dictdata = ast.literal_eval(decodeddata)
    username = dictdata["userName"]
    imagename = dictdata["imageName"]
    imageurl = dictdata["imageUrl"]
    coordinates = dictdata["Coordinates"]
    imagetype = imagename.split('.')[1]
    print("ImageUrl: "+imageurl)
    print("ImageType: "+imagetype)
    saveimageindjango = 'assets/mloutput_'+username+"_"+imagename
    print("coordinates : "+coordinates)

    start_time = time.time()
    IoU = []
    coordinates = coordinates.split("\n")
    coordinates.pop(0)
    numberofannotations = len(coordinates)

    # img1 will be entry from user
    url = imageurl
    req = urllib.request.urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1) # 'Load it as it is'

    print("SHAPE OF IMAGE (BEFORE): "+str(img.shape))
    img_h = img.shape[0]
    img_w = img.shape[1]
    img_d = img.shape[2]

    if imagetype == "png" or img_d == 4:
        cv2.imwrite(saveimageindjango, img)

    img = cv2.imread(saveimageindjango)
    print("SHAPE OF IMAGE (AFTER): "+str(img.shape))

    imgcv = img

    result = tfnet.return_predict(imgcv)
    count = 0

    for res in result:
        if res["label"] == "whole":
            continue
        elif res["label"] == "person":
            print("Deteced person")
            count = count + 1
            color = int(255 * res["confidence"])
            top = (res["topleft"]["x"], res["topleft"]["y"])
            bottom = (res["bottomright"]["x"], res["bottomright"]["y"])
            cv2.rectangle(imgcv, top, bottom, (255,0,0) , 2)

            # Calculate IoU here with top and bottom, compare each drawn image with top and bottom, select the max IoU
            bb2 = {}
            bb2['x1'] = top[0]
            bb2['x2'] = bottom[0]
            bb2['y1'] = top[1]
            bb2['y2'] = bottom[1]

            currentIou = 0
            for boxes in coordinates:
                print("box: "+str(boxes))
                boxesarr = boxes.split(" ")
                top = ast.literal_eval(boxesarr[0])
                bottom = ast.literal_eval(boxesarr[1])
                bb1 = {}
                bb1['x1'] = top[0]
                bb1['x2'] = bottom[0]
                bb1['y1'] = top[1]
                bb1['y2'] = bottom[1]
                result = get_iou(bb1,bb2)
                currentIou = max(result,currentIou)

            print("IoU: "+str(currentIou))
            IoU.append(currentIou)
            crop_img = imgcv[res["topleft"]["y"]:res["bottomright"]["y"],res["topleft"]["x"]:res["bottomright"]["x"]]

            print(res["label"])
            if len(crop_img) != 0:
                #print("results/crp_"+res["label"]+"_"+str(count)+str(imgname))
                pass
            #cv2.putText(imgcv, res["label"], top, cv2.FONT_HERSHEY_DUPLEX, 1.0, (0,0,255))
            print(count)

    print("count : "+str(count))
    print("annotations : "+str(numberofannotations))

    if count != numberofannotations:
        difference = numberofannotations-count
        if difference > 0:
            print("difference: "+str(difference))
            for i in range(0,difference):
                IoU.append(0)

    print("IoU : ")
    print(IoU)
    averageIoU = np.mean(IoU)
    print("Average : "+str(averageIoU))

    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))
    print("Sending to back end...")
    saveimageindjango = 'assets/mloutput_'+username+"_"+imagename
    cv2.imwrite(saveimageindjango, imgcv)
    files = {'file': open(saveimageindjango, 'rb')}
    headers = {
        'username': username,
    }
    response = requests.request("POST", 'http://localhost:4000/upload', files=files, headers=headers)
    print(response)

    headers = {
        'username': username,
        'data' : str(averageIoU),
    }
    response = requests.request("POST", 'http://localhost:4000/saveIoU',files=files,headers=headers)
    print(response)

    print("Backend Process Complete")
    context = {"data":"data"}
    return render(request, 'index.html', context)


@csrf_exempt
def index(request):
    decodeddata = request.body.decode('utf-8')
    dictdata = ast.literal_eval(decodeddata)
    username = dictdata["username"]
    imagename = dictdata["imagename"]
    imageurl = dictdata["imageurl"]

    start_time = time.time()
    # Final TextBox++ Code : (Works on just image)
    input_size = input_shape[:2]
    print(input_size)
    # getting the image
    url = imageurl
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    img = np.array(img)
    img_h = img.shape[0]
    img_w = img.shape[1]
    img1 = np.copy(img)
    img2 = np.zeros_like(img)

    # model to predict
    x = np.array([preprocess(img, input_size)])

    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))

    #Model start
    start_time = time.time()
    with sl_graph.as_default():
        with sl_session.as_default():
            y = sl_model.predict(x)

    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))
    #Model end


    start_time = time.time()
    result = prior_util.decode(y[0], confidence_threshold)

    if len(result) > 0:
        bboxs = result[:,0:4]
        quads = result[:,4:12]
        rboxes = result[:,12:17]
        boxes = np.asarray([rbox3_to_polygon(r) for r in rboxes])
        xy = boxes
        xy = xy * [img_w, img_h]
        xy = np.round(xy)
        xy = xy.astype(np.int32)
        cv2.polylines(img1, tuple(xy), True, (0,0,255))
        rboxes = np.array([polygon_to_rbox(b) for b in np.reshape(boxes, (-1,4,2))])
        bh = rboxes[:,3]
        rboxes[:,2] += bh * 0.1
        rboxes[:,3] += bh * 0.2
        boxes = np.array([rbox_to_polygon(f) for f in rboxes])
        boxes = np.flip(boxes, axis=1) # TODO: fix order of points, why?
        boxes = np.reshape(boxes, (-1, 8))
        boxes_mask_a = np.array([b[2] > b[3] for b in rboxes]) # width > height, in square world
        boxes_mask_b = np.array([not (np.any(b < 0) or np.any(b > 512)) for b in boxes]) # box inside image
        boxes_mask = np.logical_and(boxes_mask_a, boxes_mask_b)
        boxes = boxes[boxes_mask]
        rboxes = rboxes[boxes_mask]
        xy = xy[boxes_mask]
        if len(boxes) == 0:
            boxes = np.empty((0,8))

    # draw
    saveimageindjango = 'assets/mloutput_'+username+"_"+imagename
    cv2.imwrite(saveimageindjango, img1)
    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))
    print("Sending to back end...")
    files = {'file': open(saveimageindjango, 'rb')}
    headers = {
        'username': username,
    }
    response = requests.request("POST", 'http://localhost:4000/upload', files=files, headers=headers)
    print(response)
    print("Backend Process Complete")
    context = {"data":"data"}
    return render(request, 'index.html', context)

@csrf_exempt
def runmodel(request):
    context = {"data":"data"}
    return render(request, 'index.html', context)
