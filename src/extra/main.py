# Python program to demonstrate
# command line arguments


# import sys

# # total arguments
# n = len(sys.argv)
# print("Total arguments passed:", n-1)
# args = sys.argv[1:]

# def getArgs(args, argsList):
#     data = {}
#     for x in argsList:
#         if x in args:
#             index = args.index(x)
#             data[x] = args[index+1]

#     return data

# data = {}

# if ("-data") in args:
#     y = args.index("-data")
#     data["-data"] = args[y+1]
# y = getArgs(args=args, argsList=["-pass", "-data"])

# import json
# jsonObj = json.dumps(y, indent=3)
# print(jsonObj)

# Arguments passed
# print("\nName of Python script:", sys.argv[0])s

# print("\nArguments passed:", end = " ")
# for i in range(1, n):
# 	print(sys.argv[i], end = " ")
	
# # Addition of numbers
# Sum = 0
# # Using argparse module
# for i in range(1, n):
# 	Sum += int(sys.argv[i])
	
# print("\n\nResult:", Sum)




# import sys
# import json

# args = sys.argv[1:]

# print(args)

# def getArgs(args, argsList):
#     data = {}
#     for x in argsList:
#         if x in args:
#             index = args.index(x)
#             string = ""
#             data[x] = args[index+1]

#     return data


# y = getArgs(args=args, argsList=["-pass", "-data"])

# jsonObj = json.dumps(y, indent=3)
# print(jsonObj)


import os
from PyPDF2 import PdfReader, PdfWriter
from pdf2jpg import pdf2jpg

def pdf_splitter(path):
    fname = os.path.splitext(os.path.basename(path))[0]
    newfilename = f"{fname}.pdf"

    pdf = PdfReader(path)
    # for page in range(len(pdf.pages)):
    writer = PdfWriter()
    writer.add_page(pdf.pages[0])
    with open(newfilename, 'wb') as coverpage:
        writer.write(coverpage)

    # inputpath = newfilename
    # outputpath = r""
    # result = pdf2jpg.convert_pdf2jpg(inputpath,outputpath, pages="ALL")
        
if __name__ == '__main__':
    path = 'artof.pdf'
    pdf_splitter(path)