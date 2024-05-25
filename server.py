import pymongo

from flask import request, Flask, render_template
from json import load, dumps

app = Flask('StudentDetails')

@app.route("/")
def index():
    with open(r'C:\Users\visha\Desktop\GUI_Students_Data\students.json',encoding='utf-8') as StudentsFile:
        StudentsData = load(StudentsFile)
    return render_template(r'index.html',data=dumps(StudentsData))

# @app.route("/getStudentsData")
# def getStudentData():
    
#     return dumps(StudentsData)
    


if __name__ == '__main__':
    app.run()