
function updateCourseLineChart(){
    // var course = "SNA COMMUNITY";
    var course = document.getElementById('groupFilter').value;
    var duration = document.getElementById('timeFilter').value;
    console.log(course);
    var dataPointsReceived = [];
    fetch('/getGraphDataByCourse?course='+course+'&duration='+duration)
    .then(
        (response) => response.json().then(
            (value) => {
                dataPointsReceived = value;
                var CourseLineChart = new CanvasJS.Chart("CourseLineChart", {
                    animationEnabled: true,
                    theme: "light2",
                    title:{
                        text: "Students enrollment by date"
                    },
                    data: [{        
                        type: "line",
                        indexLabelFontSize: 16,
                        dataPoints: dataPointsReceived
                    }]
                });
                CourseLineChart.render();
            }
        )
    );
    
}


function updateCoursePieChart() {
    fetch('/getCourseEnrollmentPercentage')
    .then(
        (response) => response.json().then(
            (value) => {
                dataPointsReceived = value;
                var CoursePieChart = new CanvasJS.Chart("CoursePieChart", {
                    animationEnabled: true,
                    title: {
                        text: "Course Pie Chart"
                    },
                    data: [{
                        type: "pie",
                        startAngle: 240,
                        yValueFormatString: "##0.00\"%\"",
                        indexLabel: "{label} {y}",
                        dataPoints: dataPointsReceived
                    }]
                });
                CoursePieChart.render();
            }
        )
    )
    
}


function populateGroupOptions(jsonData) {
    const groupSet = new Set();
    jsonData.forEach(item => {
      Object.values(item.groups).forEach(group => {
        if (group) groupSet.add(group);
      });
    });
    const groupFilter = document.getElementById('groupFilter');
    groupSet.forEach(group => {
      groupFilter.add(new Option(group, group));
    });
  }




window.onload = function() {

    updateCourseLineChart();
    fetch('/getStudentsData').then(
        (response) => response.json().then((value) => {
          populateGroupOptions(value);
        })
      );
    updateCoursePieChart();
}

// var CoursePieChart = new CanvasJS.Chart("chartContainer2", {
// 	animationEnabled: true,
// 	title: {
// 		text: "Desktop Search Engine Market Share - 2016"
// 	},
// 	data: [{
// 		type: "pie",
// 		startAngle: 240,
// 		yValueFormatString: "##0.00\"%\"",
// 		indexLabel: "{label} {y}",
// 		dataPoints: [
// 			{y: 79.45, label: "Google"},
// 			{y: 7.31, label: "Bing"},
// 			{y: 7.06, label: "Baidu"},
// 			{y: 4.91, label: "Yahoo"},
// 			{y: 1.26, label: "Others"}
// 		]
// 	}]
// });

