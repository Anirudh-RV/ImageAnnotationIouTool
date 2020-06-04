import ast
def getIou(bb1, bb2):
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

def iouForImageTextBoxPP(top,bottom,coordinates):
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
                result = getIou(bb1,bb2)
                currentIou = max(result,currentIou)
            return currentIou

def iouForImage(top,bottom,coordinates,label,annotationsLabel):
            # Calculate IoU here with top and bottom, compare each drawn image with top and bottom, select the max IoU
            # Computer Label
            bb2 = {}
            bb2['x1'] = top[0]
            bb2['x2'] = bottom[0]
            bb2['y1'] = top[1]
            bb2['y2'] = bottom[1]

            # Checking with drawn coordinates
            currentIou = 0
            flag = False
            for boxes in coordinates:
                boxesarr = boxes.split(" ")
                top = ast.literal_eval(boxesarr[0])
                bottom = ast.literal_eval(boxesarr[1])
                currentCoordinates = "("+str(top[0])+","+str(top[1])+") ("+str(bottom[0])+","+str(bottom[1])+")"

                # checking for the box with the same label to check IoU
                if annotationsLabel[currentCoordinates].lower() == label.lower():
                    flag = True
                    bb1 = {}
                    bb1['x1'] = top[0]
                    bb1['x2'] = bottom[0]
                    bb1['y1'] = top[1]
                    bb1['y2'] = bottom[1]
                    result = getIou(bb1,bb2)
                    currentIou = max(result,currentIou)
                else:
                    # not same label
                    pass
            return currentIou,flag

# Check for difference and add appropriate number of zeros to make up for algorithm not recognising all objects annotated
def balanceDifference(count,numberOfAnnotation,IoU):
    if count != numberOfAnnotation:
        difference = numberOfAnnotation-count
        if difference > 0:
            for i in range(0,difference):
                IoU.append(0)
    return IoU
