export default function (svg, {
    maxRadius = 40,
    width, 
    height,
    legendX = width - maxRadius - 10,
    legendY = height - 10,
    radius
}) {
    const legend = svg.append("g")
        .attr("fill", "#777")
        .attr("transform", `translate(${legendX},${legendY})`)
        .attr("text-anchor", "middle")
        .style("font", "10px sans-serif")
        .selectAll("g")
        .data(radius.ticks(4).slice(1))
        .join("g");

    legend.append("circle")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("cy", d => -radius(d))
        .attr("r", radius);

    legend.append("text")
        .attr("y", d => -2 * radius(d))
        .attr("dy", "1.3em")
        .text(radius.tickFormat(4, "s"));

    return svg;
}