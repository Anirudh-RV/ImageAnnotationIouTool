def getaverage(iou):
    split_iou = iou.split("\n")
    split_iou.pop()

    lenght = len(split_iou)
    sum = 0
    for i in split_iou:
        sum = sum + float(i)

    print("size : "+str(lenght))
    print("sum : "+str(sum))
    average = sum/lenght
    print("average : "+str(average))
    with open("IoU/average.txt","a+") as f:
        f.write(str(average))

def main():
    try :
        with open("IoU/IoU.txt") as f:
            iou = f.read()
        print("IoU : \n"+iou)
        getaverage(iou)
    except FileNotFoundError:
        print("File not saved...\nSkipping image\n")

main()
