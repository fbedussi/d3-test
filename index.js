// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 40, left: 50}
const width = 520 - margin.left - margin.right
const height = 520 - margin.top - margin.bottom
const xLabelDistance = 30

// append the svg object to the body of the page
const svg = d3.select("#graph")
  .append("svg")
    .attr("viewBox", `0 0 300 600`)
  .append("g")
    .attr("transform", `translate(${-(margin.left + 10)}, ${margin.top + (xLabelDistance * 2)})`)

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

  yAxis.selectAll('text').attr('fill', 'black').attr('font-size', 15)

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
  xAxis.selectAll('text').attr('font-size', 15)

  
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
  xAxisTop.selectAll('text').attr('font-size', 15)


  const line0Offset = 20
  xAxis.selectAll("line")
    .attr("y2", d => -(height + xLabelOffset + (d === 0 ? line0Offset : 0 )))
    .attr("y1", d => d === 0 ? line0Offset : 0);

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
    
  svg.selectAll(".tick line").attr("stroke", "black")

  const getColor = d => d.eye === 'R' ? '#a34eff' : '#2fa59e'

  const firstPointsThreshold = 2

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append('g')
    .attr('class', (d, index) => `points ${index < firstPointsThreshold ? 'first ' : ''}`)
    .append("circle")
      .attr('class', d => {
        return d.eye === 'R' ? `purple-shadow` : `green-shadow`
      })
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", (_, index) => index < firstPointsThreshold ? 6 : 7)
      .style("stroke", getColor)
      .style("stroke-width", (_, index) => index < firstPointsThreshold ? 2 : 1)
      .style("fill", '#fff')

  svg.selectAll(".points")
    .append("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", (_, index) => index < firstPointsThreshold ? 2 : 5)
    .style("fill", getColor)

  const svgImage = '<path d="M114.8,161v808.5c0,5.7,2.4,10.3,5.9,13.7c4.8,4.6,9.5,6.9,15.5,6.9h41.6c5.9,0,10.7-2.3,15.5-6.9c3.6-3.4,5.9-8,5.9-13.7V161c28.6-16,42.8-38.9,42.8-69.7c0-22.9-8.3-42.3-25-58.3C200.5,18,180.2,10,157.7,10c-23.8,0-44,8-60.7,22.9c-16.6,16-25,35.5-25,58.3C72,122.1,86.3,145,114.8,161L114.8,161z M251.3,734.2c5.8,8,12.5,12.6,20.9,12.6c5,0,10-2.3,15-5.7c84.4-61.9,157.1-92.8,216.4-92.8c22.6,0,45.1,4.6,66.8,13.7c20.9,9.2,39.3,19.5,53.5,31c14.2,11.5,30.9,21.8,51,30.9c19.2,9.2,38.4,13.8,56.8,13.8c48.5,0,105.3-25.2,172.1-74.5c8.4-5.8,15-11.5,18.4-17.2c4.2-5.7,5.8-13.7,5.8-25.2V133.5c0-11.5-2.5-20.6-8.3-28.7c-5.8-8-13.4-12.6-20.9-12.6c-4.2,0-12.5,4.6-25.9,13.7c-12.5,9.2-26.7,18.3-40.9,29.8c-14.2,11.4-31.7,20.6-51,29.8c-20.1,9.2-38.4,13.8-55.2,13.8c-15,0-29.2-4.6-40.9-12.6c-39.2-25.2-72.7-43.6-101.9-56.2c-29.2-12.6-60.1-18.3-93.6-18.3c-57.7,0-122.8,25.2-196.3,76.8c-17.6,12.6-30.1,21.8-36.8,27.5c-9.2,9.2-14.2,21.8-14.2,35.5v473.4C242.1,717,245.5,726.2,251.3,734.2L251.3,734.2z"/>'
  svg.selectAll(".first")
    .append('svg')
    .attr("x", d => x(d.x) - 10)
    .attr("y", d => y(d.y) - 45)
    .attr("height","32")
    .attr("width","32")
    .attr("viewBox","0 0 1000 1000")
    .style("fill", getColor)
    .html(svgImage)
}

const data = [{sphere: -20, eye: 'L'}, {sphere: -10, eye: 'R'}, {sphere: 0, eye: 'L'}, {sphere: 10, eye: 'R'}].map(({sphere, eye}, index) => ({x: sphere, y: Math.floor(index / 2) + ((index + 1) % 2 === 0 ? 1.2 : 0.8), eye}))
draw(data)

