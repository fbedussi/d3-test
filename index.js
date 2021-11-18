// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 40, left: 50}
const width = 520 - margin.left - margin.right
const height = 520 - margin.top - margin.bottom
const xLabelDistance = 30

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + (xLabelDistance * 2))
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top + (xLabelDistance * 2)})`)

// Add the grey background that makes ggplot2 famous
svg
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", height)
    .style("fill", "#fff")


function createYAxis(y) {
  const yAxis = svg.append("g")
    .call(d3.axisLeft(y).tickSize(0).ticks(5))
    
  yAxis.select(".domain").remove()

  yAxis.selectAll('text').attr('fill', 'white').attr('font-size', 15)

  const labelBoxWidth = 15
  const labelBoxHeight = 80
  yAxis.selectAll('.tick')
    .insert('rect', ":first-child")
    .attr('x', function(tickText,index,rects){return rects[index].getBBox().x - labelBoxWidth})
    .attr('y', function(tickText,index,rects){return rects[index].getBBox().y - (labelBoxHeight/2)})
    .attr('width', function(tickText,index,rects){return rects[index].getBBox().width + labelBoxWidth})
    .attr('rx', 5)
    .attr('height', labelBoxHeight)
    .style('stroke', 'none')
    .style('fill', 'lightgrey')

  return yAxis
}

function draw(data) {
  // Add X axis
  const x = d3.scaleLinear()
    .domain([-29.9, 29.9])
    .range([ 0, width ])
    
  const xLabelOffset = 10
  const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height + 0})`)
    .call(d3.axisBottom(x).tickSize(-height - xLabelOffset).ticks(30))
  
  xAxis.select(".domain").remove()
  
  xAxis.selectAll('line').attr('stroke-width', (a) =>{ 
    if(a === 0) {
        return 5
    } else if (a % 10 === 0) {
      return 2
    } else {
      return 0.5
    }
  })

  xAxis.selectAll('text')
    .attr('transform', `translate(0, ${xLabelDistance})`)
    .style('display', d => d % 10 === 0 ? 'block' : 'none')

  const xAxisTop = svg.append("g")
    .attr("transform", `translate(0,${-xLabelDistance - xLabelOffset})`)
    .call(d3.axisTop(x).tickSize(0).ticks(30))
  xAxisTop.select(".domain").remove()
  xAxisTop.selectAll('text')
    .style('display', d => d % 10 === 0 ? 'block' : 'none')


  const line0Offset = 20
  xAxis.selectAll("line")
    .attr("y2", function(d){
      return -(height + xLabelOffset + (d === 0 ? line0Offset : 0 ))
    })
    .attr("y1", function(d){
      return d === 0 ? line0Offset : 0
    });

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([1.01, 5*1.01])
    .range([ height - 40, -20])
    .nice()
  const yAxisLeft = createYAxis(y)
  const yAxisRight = createYAxis(y)
  
  yAxisLeft
    .style('transform', `translateX(${-5}px)`)  
  yAxisRight
    .style('transform', `translateX(${width + 20}px)`)
    
  // Customization
  svg.selectAll(".tick line").attr("stroke", "black")

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 5)
      .style("fill", function(d) {return d.eye === 'R' ? '#ff0000' : '#00ff00'})

}

draw([{x: -20, y: 1, eye: 'L'}, {x: -10, y: 2, eye: 'R'}])
