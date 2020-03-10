import cv2
import matplotlib.pyplot as plt
import ast
import os

def drawboxes(images,coordinates):
    # path
    path = r'images/'+images

    # Reading an image in default mode
    imgcv = cv2.imread(path)

    print(coordinates)
    coordinates = coordinates.split("\n")
    print(coordinates)
    coordinates.pop()

    for boxes in coordinates:
        boxesarr = boxes.split(" ")
        top = ast.literal_eval(boxesarr[0])
        bottom = ast.literal_eval(boxesarr[1])
        color = (255, 0, 0)
        thickness = 1
        cv2.rectangle(imgcv, top, bottom, (255,0,0) , 2)

    cv2.imwrite(r"mlimages/output_"+images,imgcv)



def main():
    count = 0
    listofimages = os.listdir("images")
    for images in listofimages:
        if images != ".DS_Store":
            count = count + 1
            try :
                with open("mloutput/mloutput_"+images+".txt") as f:
                    coordinates = f.read()
                print("images : "+images)
                print("coordinates : \n"+coordinates)
                drawboxes(images,coordinates)
            except FileNotFoundError:
                print("File not saved...\nSkipping image\n")
    print("total count : "+str(count))
main()
