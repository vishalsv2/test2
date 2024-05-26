import pymongo
from datetime import datetime
from flask import request, Flask, send_file
from json import load, dumps
import os

app = Flask('StudentDetails')

MongoClient = pymongo.MongoClient("mongodb+srv://vishal:User123@test1.qveospq.mongodb.net/")


ROOT_PATH = os.path.dirname(__file__)

def getAllStudentsData():    
    db = MongoClient.mystudents
    collection = db.students 
    StudentsData = list(collection.find({}))
    for student in StudentsData:
        for group in student['groups'].keys():
            if student['groups'][group] in [None,'None']:
                student['groups'][group] = 'SNA COMMUNITY'    

    return StudentsData


@app.route("/")
def index():
    return open(os.path.join(ROOT_PATH,r'template/index.html')).read()  


@app.route("/reports")
def reports():
    return open(os.path.join(ROOT_PATH,r'template/chart.html')).read()

@app.route("/getGraphDataByCourse")
def getGraphDataForMonth():
    course = request.args.get("course")
    duration = request.args.get("duration")
    
    StudentsData = getAllStudentsData()
    DateWiseCounter = {}
    dataPoints = []
    for student in StudentsData:
        if course in student['groups'].values() or course == "":
            if duration == 'week':
                deltaDays = 7
            elif duration == 'month':
                deltaDays = 30
            elif duration == '6months':
                deltaDays = 6 * 30
            else:
                deltaDays = 12 * 30
            enrolledDate = datetime.fromtimestamp(student['epoctime'])
            if (datetime.now() - enrolledDate).days > deltaDays:
                continue
            dateVal = enrolledDate.strftime("%y-%m-%d")
            if dateVal in DateWiseCounter.keys():
                DateWiseCounter[dateVal] += 1
            else:
                DateWiseCounter[dateVal] = 1
    for date,count in DateWiseCounter.items():
        dataPoints.append(
            {
                "y": count,
                "label": date
            }
        )
    dataPoints.sort(key=lambda obj: int(obj['label'].replace('-','')))
    return dumps(dataPoints)
    



@app.route("/getStudentsData")
def getStudentsData():
    return dumps(getAllStudentsData(),default=str)

     
@app.route("/<path:path>")
def renderFile(path):
    print(path)
    return send_file(os.path.join(ROOT_PATH,path))

@app.route("/getCourseEnrollmentPercentage")
def getCourseEnrollmentPercentage():
    
    StudentsData = getAllStudentsData()
    CoursesDict = {}
    
    for student in StudentsData:
        for course in student['groups'].values():            
            if type(course) is not str:
                course = str(course)
            if course.lower() == 'sna community':
                continue
            if course in CoursesDict.keys():
                CoursesDict[course] += 1
            else:
                CoursesDict[course] = 1

    dataPoints = []
    for course in CoursesDict.keys():
        dataPoints.append(
            {
                "y": CoursesDict[course]*100/sum(CoursesDict.values()),
                "label": course
            }
        )
    return dataPoints

if __name__ == '__main__':
    app.run()