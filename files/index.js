var width = 1500;
var height = 500;

// create color scales
var color = d3.scaleThreshold().domain([1,2])
  .range(['red', 'purple', 'blue'])

// us map projection
var projection = d3.geoAlbersUsa()
  .translate([width / 2 - 300, height / 2]) // translate to center of screen
  .scale([1000]); // scale to see entire US

var path = d3.geoPath()
  .projection(projection);

// specify inital selected variable in dropdown menu
//var selectedVariable = 'ave_class'

// create svg element and append map
var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// create tooltip
var div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .attr('opacity', 0);

// load us states geojson data and merge with states data
d3.csv('../data/final_data.csv', function(data) {
  d3.json('../data/us-states.json', function(json) {
    for (var i = 0; i < data.length; i++) {
      var state = data[i].state;
      var ave_class = data[i].ave_class;
      var top_recall = data[i].top_recall;
      var recall_count = data[i].recall_count;

      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.id;
        if (state == jsonState) {
          json.features[j].properties.ave_class = ave_class;
          json.features[j].properties.top_recall = top_recall;
          json.features[j].properties.recall_count = recall_count;
          break;
        }
      }
    }

    map = svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', '#000')
      .attr('stroke-width', '0.5')
      .attr('fill', function(d) { return color(d.properties.ave_class) })
      .call(updateMap)
      .on('mouseover', function(d) {
        div.style('display', 'inline');
      })
      .on('mousemove', function(d) {
        div.html(d.properties.name + '<br>' + 'Average Classification: ' + d.properties.ave_class +
        '<br>' + 'Top Recall: ' + d.properties.top_recall + '<br>' + 'Number of Recalls: ' + d.properties.recall_count)
        .style('left', (d3.event.pageX - (parseInt(div.style('width'), 10) / 2)) + 'px')
        .style('top', (d3.event.pageY - parseInt(div.style('height'), 10) - 10) + 'px');
      })
      .on('mouseout', function(d) {
        div.style('display', 'none');
      });
  });
});

// create dropdown menu that changes map
// create dropdown menu options and map options to variable names in data
//var dropdownOptions = ['Average Classification', 'Top Recall', 'Number of Recalls'];
//var variableNames = {'Average Classification': 'ave_class', 'Top Recall': 'top_recall', 'Number of Recalls': 'recall_count'};

// handler for user selections in dropdown
//var dropdownChange = function() {
//    var variable = d3.select(this).property('value')
//    selectedVariable = variableNames[variable]
//    map.call(updateMap)
//};

//var dropdown = d3.select('body')
//  .insert('select', 'svg')
//  .on('change', dropdownChange);

//dropdown.selectAll('option')
//  .data(dropdownOptions)
//  .enter().append('option')
//  .attr('value', function (d) { return d; })
//  .text(function (d) { return d; });

function updateMap(selection) {
  selection.transition()
    .duration(500)
    .attr('fill', function(d) { 
      var value = d.properties.ave_class;
      if (value) {
        return color(value)
      } else {
        return "gray"
      }
    })
};

const legendRectSize = 30;
const legendSpacing = 10;

var legend = svg.append('g')
  .selectAll('g')
  .data(color.domain().reverse() )
  .enter()
  .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize;
      var x = 0;
      var y = i * height;
      return 'translate(' + 850 + ',' + y + ')';
    });

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .attr('fill', color)
  .attr('stroke', '#000')
  .attr('stroke-width', '1')

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; });