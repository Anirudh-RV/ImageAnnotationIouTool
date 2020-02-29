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
from darkflow.net.build import TFNet

import os
import time
import matplotlib.pyplot as plt
import ast
# to read images from urls
import PIL
from PIL import Image
import tensorflow as tf
print(tf.__version__)
import numpy as np
import cv2
from timeit import default_timer as timer
# textbox++ models
from tbpp_model import TBPP512, TBPP512_dense
from tbpp_utils import PriorUtil
# ssd for help
from ssd_data import preprocess
from sl_utils import rbox3_to_polygon, polygon_to_rbox, rbox_to_polygon
from io import BytesIO
import matplotlib.pyplot as plt
import requests
from ssd_data import preprocess
import numpy as np

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
def yolo(request):
    decodeddata = request.body.decode('utf-8')
    dictdata = ast.literal_eval(decodeddata)
    username = dictdata["username"]
    imagename = dictdata["imagename"]
    imageurl = dictdata["imageurl"]
    coordinates = dictdata["coordinates"]
    print("coordinates : "+coordinates)
    start_time = time.time()
    IoU = []
    coordinates = coordinates.split("\n")
    print(coordinates)
    coordinates.pop(0)
    print(coordinates)

    url = imageurl
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    img = np.array(img)
    saveimageindjango = 'assets/mloutput_'+username+"_"+imagename
    cv2.imwrite(saveimageindjango, img)
    img_h = img.shape[0]
    img_w = img.shape[1]
    imgcv = cv2.imread(saveimageindjango)

    result = tfnet.return_predict(imgcv)
    count = 1

    for res in result:
        print(res["label"])
        if res["label"] == "whole":
            continue
        elif res["label"] == "person":
            color = int(255 * res["confidence"])
            top = (res["topleft"]["x"], res["topleft"]["y"])
            bottom = (res["bottomright"]["x"], res["bottomright"]["y"])
            # for each person
            print(top)
            print(bottom)

            # Calculate IoU here with top and bottom, compare each drawn image with top and bottom, select the max IoU
            bb2 = {}
            bb2['x1'] = top[0]
            bb2['x2'] = bottom[0]
            bb2['y1'] = top[1]
            bb2['y2'] = bottom[1]
            print(bb2)

            currentIou = 0
            for boxes in coordinates:
                boxesarr = boxes.split(" ")
                top = ast.literal_eval(boxesarr[0])
                bottom = ast.literal_eval(boxesarr[1])
                print("top : ")
                print(top)
                print("bottom : ")
                print(bottom)
                bb1 = {}
                bb1['x1'] = top[0]
                bb1['x2'] = bottom[0]
                bb1['y1'] = top[1]
                bb1['y2'] = bottom[1]
                result = get_iou(bb1,bb2)
                print(result)
                currentIou = max(result,currentIou)

            IoU.append(currentIou)
            crop_img = imgcv[res["topleft"]["y"]:res["bottomright"]["y"],res["topleft"]["x"]:res["bottomright"]["x"]]

            print(res["label"])
            if len(crop_img) != 0:
                #print("results/crp_"+res["label"]+"_"+str(count)+str(imgname))
                pass
            cv2.rectangle(imgcv, top, bottom, (255,0,0) , 2)
            #cv2.putText(imgcv, res["label"], top, cv2.FONT_HERSHEY_DUPLEX, 1.0, (0,0,255))
            print(count)
        count = count + 1

    print("IoU : ")
    print(IoU)
    averageIoU = np.mean(IoU)
    print("Average : "+str(averageIoU))
    # draw
    saveimageindjango = 'assets/mloutput_'+username+"_"+imagename
    cv2.imwrite(saveimageindjango, imgcv)
    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))
    print("Sending to back end...")
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
