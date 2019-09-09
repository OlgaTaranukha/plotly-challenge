function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`;
  console.log(url);

  d3.json(url).then(function(sample_data){
    console.log(sample_data);

    var sample_metadata = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample_data).forEach(function([key, value]) {
      var row = sample_metadata.append("h6");
      row.text(`${key}: ${value}`);
      console.log(`${key}: ${value} \n`);
    });
  
    // BONUS: Build the Gauge Chart
    buildGauge(sample_data.WFREQ);
  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  console.log(url);

  d3.json(url).then(function(sample_data) {
    console.log(sample_data);
    // @TODO: Build a Bubble Chart using the sample data
    var x_values = sample_data.otu_ids;
    var y_values = sample_data.sample_values;
    var m_size   = sample_data.sample_values;
    var m_color = sample_data.otu_ids; 
    var text_values = sample_data.otu_labels;  
    var desired_maximum_marker_size = 100;

    var trace1 = {
      type: "bubble",
      mode: 'markers',
      x: x_values,
      y: y_values,
      text: text_values,
      marker: {
        color: m_color,
        size: m_size,
        sizeref: 2.0 * Math.max(m_size) / (desired_maximum_marker_size**2),
        //sizemode: 'area'
      } 
    }; 

    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_values = sample_data.sample_values.slice(0,10);  
    var pie_labels = sample_data.otu_ids.slice(0,10);
    var pie_hover_text = sample_data.otu_labels.slice(0,10);
         
    var data = [{ 
      type: "pie",
      height: 500,
      width: 500,
      values: pie_values, 
      labels: pie_labels,  
      hovertext: pie_hover_text  
    }];
    
    Plotly.newPlot("pie", data);
  
  });  
    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });

}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
