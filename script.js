// Configuración inicial
const width = 800;
const height = 400;
const padding = 50;

const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

// Cargar datos
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(data => {
        const dataset = data;

        // Convertir datos
        dataset.forEach(d => {
            d.Year = new Date(d.Year, 0, 1);
            d.Time = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, d.Time[0], d.Time[1]);
        });

        // Escalas
        const xScale = d3.scaleTime()
            .domain(d3.extent(dataset, d => d.Year))
            .range([padding, width - padding]);

        const yScale = d3.scaleTime()
            .domain(d3.extent(dataset, d => d.Time))
            .range([height - padding, padding]);

        // Ejes
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"));
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat("%M:%S"));

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding})`)
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);

        // Puntos
        svg.selectAll(".dot")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(d.Time))
            .attr("r", 5)
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => d.Time)
            .on("mouseover", (event, d) => {
                const [x, y] = d3.pointer(event);

                d3.select("#tooltip")
                    .style("visibility", "visible")
                    .attr("data-year", d.Year)
                    .html(`Year: ${d3.timeFormat("%Y")(d.Year)}<br>Time: ${d3.timeFormat("%M:%S")(d.Time)}`)
                    .style("left", `${x + 5}px`)
                    .style("top", `${y - 28}px`);
            })
            .on("mouseout", () => {
                d3.select("#tooltip")
                    .style("visibility", "hidden");
            });
    });
