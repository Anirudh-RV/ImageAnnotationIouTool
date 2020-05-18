import os
import time
import ast
import numpy as np
import cv2
import math
import matplotlib.pyplot as plt
import tensorflow as tf
print(tf.__version__)
import numpy as np
from darkflow.net.build import TFNet
yolo9000 = {"model" : "cfg/yolo9000.cfg", "load" : "yolo9000.weights", "threshold": 0.01}
tfnet = TFNet(yolo9000)


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

def yolo(img,coordinates):
    try :
        imagename = img
        print("coordinates : "+coordinates)
        print("image : "+img)
        start_time = time.time()
        IoU = []
        coordinates = coordinates.split("\n")
        print(coordinates)
        coordinates.pop(0)
        print(coordinates)
        numberofannotations = len(coordinates)
        img = cv2.imread("images/"+img)
        img = np.array(img)
        img_h = img.shape[0]
        img_w = img.shape[1]
        imgcv = img
        result = tfnet.return_predict(imgcv)
        count = 0
        for res in result:
            if res["label"] == "whole":
                continue
            elif res["label"] == "person":
                count = count + 1
                color = int(255 * res["confidence"])
                top = (res["topleft"]["x"],res["topleft"]["y"])
                bottom = (res["bottomright"]["x"],res["bottomright"]["y"])
                # for each person
                print("top and bottom")
                print(top)
                print(bottom)
                topstr = "("+str(res["topleft"]["x"])+","+str(res["topleft"]["y"])+")"
                bottomstr = "("+str(res["bottomright"]["x"])+","+str(res["bottomright"]["y"])+")"
                fileentry = topstr+" "+bottomstr
                print("file entry : ")
                print(fileentry)
                f = open("mloutput/mloutput_"+imagename+".txt", "a+")
                f.write(fileentry+"\n")
                f.close()


                # Calculate IoU here with top and bottom, compare each drawn image with top and bottom, select the max IoU
                bb2 = {}
                bb2['x1'] = top[0]
                bb2['x2'] = bottom[0]
                bb2['y1'] = top[1]
                bb2['y2'] = bottom[1]

                currentIou = 0
                for boxes in coordinates:
                    boxesarr = boxes.split(" ")
                    top = ast.literal_eval(boxesarr[0])
                    bottom = ast.literal_eval(boxesarr[1])
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

        print("person count : "+str(count))
        print("person annotations : "+str(numberofannotations))

        if count != numberofannotations:
            difference = numberofannotations-count
            for i in range(0,difference):
                IoU.append(0)

        print("IoU : ")
        print(IoU)
        averageIoU = np.mean(IoU)
        print("Average : "+str(averageIoU))
        if math.isnan(averageIoU):
            # do nothing
            pass
        else:
            # save averageIoU in IoU.txt
            with open("IoU/Iou.txt","a+") as myfile:
                myfile.write(str(averageIoU)+"\n")

        elapsed_time = time.time() - start_time
        print("Performace measure : "+str(elapsed_time))
        print("Backend Process Complete")
    except:
        print("Skipping image...\n")

def main():
    count = 0
    listofimages = os.listdir("images")
    print(len(listofimages))
    for images in listofimages:
        if images != ".DS_Store":
            try :
                with open("output/output_"+images+".txt") as f:
                    coordinates = f.read()
                print("images : "+images)
                print("coordinates : \n"+coordinates)
                yolo(images,coordinates)
                count = count + 1
            except FileNotFoundError:
                print("File not saved...\nSkipping image\n")
    print("total count : "+str(count))
main()
