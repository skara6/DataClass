// from data.js
var tableData = data;
console.log(tableData);


// Get a reference to the table body
var tbody = d3.select("tbody");

//Console.log the weather data from data.js
//console.log(data);
 // Step 1: Loop Through `data` and console.log each weather report object
tableData.forEach(function(ufoReport) {
   console.log(ufoReport);
   });

   
 
tableData.forEach((ufoReport) => {
  var row = tbody.append("tr");
  Object.entries(ufoReport).forEach(([key, value]) => {
    var cell = tbody.append("td");
    cell.text(value);
  });
});





var inputText = d3.select("#datetime").property("value");
var button = d3.select("filter-btn").on("click", handleClick);

// filter data with desired date
function handleClick(){
    d3.event.preventDefault();
    console.log(inputText.property("value"));
    var new_table = tableData.filter(row => row.datetime===inputText.property("value"));
    console.log(new_table);
    
};

