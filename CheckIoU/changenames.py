import os
import cv2

def main():
    count = 0
    listofimages = os.listdir("dummy_images")
    for images in listofimages:
        if images != ".DS_Store":
            count = count + 1
            try :
                filename = "dummy_output/output_"+images+".txt"
                print("filename : "+filename)
                with open("dummy_output/output_"+images+".txt") as f:
                    coordinates = f.read()
                print("images : "+images)
                print("coordinates : \n"+coordinates)

                imgcv = cv2.imread("dummy_images/"+images)
                cv2.imwrite("newdummy3/road_"+images,imgcv)

                f = open("newdummyoutput/output_road_"+images+".txt", "a+")
                f.write(coordinates+"\n")
                f.close()

            except FileNotFoundError:
                print("File not saved...\nSkipping image\n")
        
    print("total count : "+str(count))
main()
