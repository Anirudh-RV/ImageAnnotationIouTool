'''
# Documentation of how tracking is done

1. Initialising people mapping to 0
2. Each iteration, the boxes are checked with previous coordinates
3. The IoU is checked for each new box with the previous coordinates
4. The Maximum IoU is considered as the same box being moved from one place to another
5. If new boxes appear, the people index is increased
6. The algorithm follows a person by checking the previous location

**Note**
1. The tracking is not completely error proof
2. Gaps in detection in yolo can make the algorithm think new people have appeard
3. Close boxes appear to change indices between them
4. Solve this by considering error cases and let the algorithm take more precaution before assinging new indices or even with transferring indices after a couple of frames of consistent results

**NOTE**
1. Place the images in the images folder
2. Place the annotations in the mloutput folder

Process to get Manual annotation tracking output :
1. Run the Tracking algorithm on the manual annoated images
2. PeopleMapping.txt is obtained
3. Now run the code to go through the PeopleMapping.txt file and draw outputs
4. Finally make a final video using these images to get the output video

Run gettrackingoutput.py in CheckIoU folder
'''
import cv2
import time
import os
import numpy as np
import ast

def get_iou(bb1, bb2):
    try:
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
    except AssertionError:
        return 0


def runTracking():
# Video Capture using OpenCV VideoCapture
    start_time = time.time()
    previousCoordinates = ""
    peopleindex = 0
    peoplemapping = {}
    print("STARTING PROCESS...")
    imageArray = os.listdir("Dividedframes")
    print("imageArray : "+str(imageArray))
    print("Size : "+str(len(imageArray)))
    strPeopleMapping = ""
    index = 2
    while index < len(imageArray):
        if index == 54:
            index = index + 1
        name = 'Dividedframes/'+'output_twoPeopleWalking_'+str(index)+'.jpeg'
        frame = cv2.imread('Dividedframes/'+'output_twoPeopleWalking_'+str(index)+'.jpeg')
        if frame is not None:
            currentCoordinates = ""

            img1 = frame
            coordinates = previousCoordinates.split("\n")
            coordinates.pop()
            #print(coordinates)
            # YOLO-9000 : Drawing Boxes
            peopleCount = 0
            with open("mloutput/output_"+'output_twoPeopleWalking_'+str(index)+'.jpeg'+".txt") as f:
                newcoordinates = f.read()

            newcoordinates = newcoordinates.split("\n")
            newcoordinates.pop(0)
            #print("newcoordinates: "+str(newcoordinates))
            for boxes in newcoordinates:
                if boxes is None:
                    continue
                else:
                    peopleCount  = peopleCount + 1
                    boxesarr = boxes.split(" ")
                    top = ast.literal_eval(boxesarr[0])
                    bottom = ast.literal_eval(boxesarr[1])
                    coordinatesStr = {}
                    coordinatesStr['x1'] = top[0]
                    coordinatesStr['x2'] = bottom[0]
                    coordinatesStr['y1'] = top[1]
                    coordinatesStr['y2'] = bottom[1]

                    topstr = "("+str(coordinatesStr['x1'])+","+str(coordinatesStr['y1'])+")"
                    bottomstr = "("+str( coordinatesStr['x2'])+","+str(coordinatesStr['y2'])+")"

                    currentValue = str(topstr)+" "+str(bottomstr)
                    #print("currenValue : "+currentValue)
                    # IOU PART - BEGIN
                    currentCoordinates = currentCoordinates+str(topstr)+" "+str(bottomstr)+"\n"
                    #print("currentCoordinates: "+currentCoordinates)

                    # Calculate IoU here with top and bottom, compare each drawn image with top and bottom, select the max IoU
                    if previousCoordinates != "":
                        bb2 = {}
                        bb2['x1'] = top[0]
                        bb2['x2'] = bottom[0]
                        bb2['y1'] = top[1]
                        bb2['y2'] = bottom[1]

                        currentIou = 0
                        iouIndex = 0

                        #print("comparing now : "+str(bb2))
                        for currentIndex,boxes in enumerate(coordinates):
                            boxesarr = boxes.split(" ")
                            top = ast.literal_eval(boxesarr[0])
                            bottom = ast.literal_eval(boxesarr[1])
                            bb1 = {}
                            bb1['x1'] = top[0]
                            bb1['x2'] = bottom[0]
                            bb1['y1'] = top[1]
                            bb1['y2'] = bottom[1]
                            #print("with bb1 : "+str(bb1))
                            result = get_iou(bb1,bb2)
                            #print("result : "+str(result))
                            temp = currentIou
                            currentIou = max(result,currentIou)
                            if temp != currentIou:
                                iouIndex = currentIndex

                        #print("Current coordinate : "+str(bb2))
                        #print("MAX IoU : "+str(currentIou))
                        #print("Max IoU Index :"+str(iouIndex))
                        #print("Previous coordinate : "+str(coordinates[iouIndex]))
                        if currentIou != 0:
                            #print("transfering index :"+str(peoplemapping[coordinates[iouIndex]]))
                            peoplemapping[currentValue] = peoplemapping[coordinates[iouIndex]]
                        #check for index:
                        try:
                            if peoplemapping[currentValue]:
                                pass
                                #print("person taken into account : "+str(peoplemapping[currentValue]))
                        except:
                            peopleindex = peopleindex + 1
                            peoplemapping[currentValue] = peopleindex
                            #print("person accounted: "+str(peoplemapping[currentValue]))
                    else:
                        print("adding people here : ")
                        try:
                            if peoplemapping[currentValue]:
                                #print("person taken into account : "+str(peoplemapping[currentValue]))
                                pass
                        except:
                            print("Name : "+str(name))
                            print("people index : "+str(peopleindex))
                            peopleindex = peopleindex + 1
                            peoplemapping[currentValue] = peopleindex
                            #print("person coordinate : "+str(currentValue))
                            #print("person accounted: "+str(peoplemapping[currentValue]))

                    # IOU PART - END
                    strPeopleMapping = strPeopleMapping+currentValue+":"+str(peoplemapping[currentValue])+"|"

            #print("previousCoordinates : "+previousCoordinates)
            #print("currentcoordinates : "+currentCoordinates)
            #print("People Count : "+str(peopleCount))
            #print("peoplemapping: "+str(peoplemapping))
            previousCoordinates = currentCoordinates
            index = index + 1
            print("image count : "+str(index))
            strPeopleMapping = strPeopleMapping+"\n"
            print("people count : "+str(peopleindex))
        else:
            break


    print("FINAL PEOPLEMAPPING IS : "+strPeopleMapping)
    with open("peopleMapping.txt","a+") as myfile:
                myfile.write(strPeopleMapping)

    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))

def drawboxes(imagename,img1,boxes,currentPersonIndex):
    print("IN DRAWBOXES boxes: "+str(boxes))
    print("IN DRAWBOXES currentPeronIndex: "+str(currentPersonIndex))
    # Reading an image in default mode
    imgcv = img1
    boxesarr = boxes.split(" ")

    top = ast.literal_eval(boxesarr[0])
    bottom = ast.literal_eval(boxesarr[1])
    color = (255, 0, 0)
    thickness = 1

    cv2.rectangle(imgcv, top, bottom, (255,0,0) , 2)
    cv2.putText(imgcv,"index: "+str(currentPersonIndex),top,cv2.FONT_HERSHEY_DUPLEX,1.0,(0,0,255))
    cv2.imwrite(r"mlimages/"+imagename,imgcv)

def trackingOutput():
    start_time = time.time()
    count = 0
    imageArray = os.listdir("Dividedframes")
    #print("imageArray : "+str(imageArray))
    print("Size : "+str(len(imageArray)))
    strPeopleMapping = ""
    index = 2
    with open("peopleMapping.txt") as f:
        coordinates = f.read()
    #print("Values: \n"+coordinates)
    coordinates = coordinates.split("\n")
    coordinates.pop()
    #print("Coordinate array : "+str(coordinates))
    peoplemappingindex =0
    while index < len(imageArray):
        if index == 54:
            index = index + 1
        imagename = 'output_twoPeopleWalking_'+str(index)+'.jpeg'
        img1 = cv2.imread('Dividedframes/'+'output_twoPeopleWalking_'+str(index)+'.jpeg')
        eachImage = coordinates[peoplemappingindex].split("|")
        eachImage.pop()
        #print("eachImage: "+str(eachImage))
        for eachBox in eachImage:
            eachPerson = eachBox.split(":")
            #print("eachperson : "+str(eachPerson))
            boxes = eachPerson[0]
            currentPersonIndex = eachPerson[1]
            print("boxes: "+str(boxes))
            print("Index: "+str(currentPersonIndex))
            drawboxes(imagename,img1,boxes,currentPersonIndex)
        peoplemappingindex = peoplemappingindex + 1
        index = index + 1
    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))
    print("total count : "+str(count))


def makeVideo():
    # variables
    vid_name = "manualAnnotation"
    vid_file = "twoPeopleWalking.mp4"
    cap = cv2.VideoCapture(vid_file)
    frame_array = []
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    frame_array = []
    framecount = 0
    out = cv2.VideoWriter('FINALOUTPUT_'+vid_name+'.avi',cv2.VideoWriter_fourcc('M','J','P','G'), 30, (frame_width,frame_height))

    # Video Capture using OpenCV VideoCapture
    start_time = time.time()

    # Check if the webcam is opened correctly
    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    previousCoordinates = ""
    peopleindex = 0
    peoplemapping = {}
    print("STARTING PROCESS...")

    imageArray = os.listdir("mlimages")
    print("imageArray : "+str(imageArray))
    print("Size : "+str(len(imageArray)))

    index = 2
    while index < len(imageArray):
        if index == 54:
            index = index + 1
        img1 = cv2.imread('mlimages/'+'output_twoPeopleWalking_'+str(index)+'.jpeg')
        index = index + 1
        if img1 is not None:
            out.write(img1)
        else:
            break


    elapsed_time = time.time() - start_time
    print("Performace measure : "+str(elapsed_time))

    # When everything done, release the video capture and video write objects
    cap.release()
    out.release()

    # Closes all the frames
runTracking()
trackingOutput()
makeVideo()
