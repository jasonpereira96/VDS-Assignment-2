import {select, zoom, create, geoPath, json, zoomIdentity, pointer, zoomTransform, geoAlbers, scaleSqrt} from "d3";
import { scaleSequential, interpolatePiYG, interpolatePuRd, range } from "d3";
import us_data from "./data/counties-albers-10m.json";
import { getFreqByState, getFreqBySex, getFreqByCity } from "./process"
import circlarLegend from "./circularLegend"
import stateMapping from "./data/stateCodes"
import legend from "./legend";
import pieChart from "./piechart"
import app from "./app";
import "./css/index.css"
// import { createApp } from "vue"
const topojson = require("topojson-client");

let us = us_data

// create path variable

const _d3 = {
    select, zoom, create, geoPath, json, zoomIdentity, pointer, zoomTransform
}

// var projection = geoMercator();
// var path = gepath()
    // .projection(projection);
const path = geoPath();
let projection = geoAlbers().scale(1300).translate([487.5, 305]);
    
console.log(getFreqBySex())
const deathsBySex = getFreqBySex();
const deathsByCity = getFreqByCity();


window.app = {
    
}

/*
Features to use
hotspots: differently sized circles
pie chart for male/female | color encoding as a precent for male/female

*/

let radius = scaleSqrt([0, Math.max(...getFreqByCity().map(r => r.count))], [0, 40]); // 40 is maxRadius




console.log("wew")
console.log(radius(1))

const stateFreq = getFreqByState();

let chart = () => {
    const width = 975;
    const height = 610;
  
    const zoom = _d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);
  
    const svg = _d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);
  
    const g = svg.append("g");

    var cScale = scaleSequential()
        .domain([Math.min(...Object.values(stateFreq)), Math.max(...Object.values(stateFreq))])
        .interpolator(interpolatePuRd);

  
    const states = g.append("g")
        .attr("cursor", "pointer")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .join("path")
        .attr("fill", (d, i) => { 
            return cScale(stateFreq[stateMapping[d.properties.name]]); 
        })
        .on("click", onClick)
        .attr("d", path);
    
    states.append("title")
        .text(d => d.properties.name);
  
    g.append("path")
        .attr("fill", "none")
        .attr("stroke", "white")
        // .attr("fill", (d, i) => color(50))
        .attr("stroke-linejoin", "round")
        .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)))


    // svg.append("path")
    //     .datum(getHotspots())
    //     .attr("d", _d3.geoPath(projection).pointRadius(20));

    // add circles to svg
    svg.selectAll("circle")
		// .data([aaa, bbb]).enter()
		.data(deathsByCity).enter()
		.append("circle")
		.attr("cx", function (d) { return projection([d.lng, d.lat])[0]; })
		.attr("cy", function (d) { return projection([d.lng, d.lat])[1]; })
		.attr("r", function (d) { return radius(d.count) })
		.attr("fill", "red")
        .attr("fill-opacity", 0.5)
        .append("title").text(d => d.city);
    
    circlarLegend(svg, {
        width,
        height,
        radius: radius
    });

    /*
    svg.append("g")
        .attr("fill", "red")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        // .attr("stroke-opacity", strokeOpacity)
        .selectAll("circle")
        // .data(range(data.length))
        .data(getFreqByCity()).enter()
        //   .filter(i => P[i])
        //   .sort((i, j) => d3.descending(V[i], V[j])))
      .join("circle")
        // .attr("transform", projection == null
        //     ? i => `translate(${P[i]})`
        //     : i => `translate(${projection(P[i])})`)
        .attr("r", i => radius(i > i.count))
        // .call(T ? circle => circle.append("title").text(i => T[i]) : () => {}); */

    // svg.selectAll(".pin")
    //     .data(getHotspots())
    //     .enter().append("circle", ".pin")
    //     .attr("r", 20)
    //     .attr("transform", function(d) {
    //     return "translate(" + projection([
    //         d.long,
    //         d.lat
    //     ]) + ")"
    //     });
  
    // svg.call(zoom);
  
    function reset() {
      states.transition().style("fill", null);
      svg.transition().duration(750).call(
        zoom.transform,
        _d3.zoomIdentity,
        _d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }
  
    function onClick(event, d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      console.log(d)
    }
  
    function zoomed(event) {
      const {transform} = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }
  
    return svg.node();
  }

  function barChart() {
    
  }



async function init() {

    // app.mount("#app");

    let c = chart();
    document.getElementById("viz").append(c);
    let l = legend({
        color: scaleSequential([0, 100], interpolatePiYG),
        title: "Gun death by state"
    });
    document.getElementById("legend").append(l);
    let data = [{
        category: "Male",
        value: deathsBySex.IL.M
    }, {
        category: "Female",
        value: deathsBySex.IL.F
    }]
    const sideViz = pieChart(data, {
        name: d => d.category,
        value: d => d.value,
        colors: ["cornflowerblue", "pink"]
    });
    document.getElementById("viz2").append(sideViz);

}

function main() {
    init();
}

main();