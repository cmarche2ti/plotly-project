function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then(function(d) {
    var sampleMetadata = d3.select('#sample-metadata');
    sampleMetadata.html("");
    Object.entries(d).forEach(function ([key, value]) {
      var row = sampleMetadata.append("p");
      row.text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
  
  // Build a Pie Chart
    var pieTrace = {
      labels: data.otu_ids.slice(0,10),
      values: data.sample_values.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      type: "pie"
    }
    var layout ={
      height: 500,
      width: 700
    }
    var pieData = [pieTrace]    
    Plotly.newPlot("pie", pieData, layout);
    })
    d3.json(`/samples/${sample}`).then(function(data){
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        color:  data.otu_ids,
        size: data.sample_values
        }
    }
    var bubbleData = [bubbleTrace];
  
    var layout = {
      xaxis: {title: 'OTU ID'}
    };

    Plotly.newPlot('bubble', bubbleData, layout);
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
