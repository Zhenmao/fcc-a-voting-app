/* global d3, data */
// Chart
const chartRect = document.querySelector("#show-poll-card-body").getBoundingClientRect(); // Chart size according to card-body size

const margin = {top: 20, right: 30, bottom: 20, left: 30},
      width = chartRect.width - margin.left - margin.right,
      height = chartRect.height - margin.top - margin.bottom;
      
const g = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
// Scales
const xScale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(data.map(function(d) { return d.optionText; }));
const yScale = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.max(data, function(d) { return d.count; })]);
    
// Axes
g.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));
    
g.append("g")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(yScale));
    
// Bars
const bars = g.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar");
    
    // Initial bars grow transition
    bars.attr("x", function(d) { return xScale(d.optionText); })
        .attr("y", height) // Set y at the bottom for the transition effect
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // Set height 0 for the transition effect
        .transition()
        .duration(750)
        .delay(function(d, i) { return i * 250 })
        .attr("y", function(d) { return yScale(d.count); })
        .attr("height", function(d) { return height - yScale(d.count); })
    
    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip");
    bars.on("mouseover", function() {
            tooltip.transition()
                .style("opacity", 1);
        })
        .on("mousemove", function(d) {
            tooltip
                .style("left", (d3.event.pageX + 10) + "px")		
                .style("top", (d3.event.pageY - 10) + "px")
                .html("<span>Option: <strong>" + d.optionText + "</strong><br>Count: <strong>" + d.count + "</strong></span>");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .style("opacity", 0);
        });
    
      
