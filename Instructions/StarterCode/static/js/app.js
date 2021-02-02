var global_data = [];

$(document).ready(function() {
    onInit();

    $('#selDataset').change(function() {
        doWork();
    });
});

function onInit() {
    d3.json("samples.json").then((data) => {
        global_data = data;

        makeFilters(data);
        doWork();
    });
}

function doWork() {
    $('#progress_gif').show();
    $('#plots').hide();

    var sample = parseInt($("#selDataset").val());

    var metadata = global_data.metadata.filter(x => x.id === sample)[0];

    var sample_data = global_data.samples.filter(x => x.id == sample)[0];

    makePanel(metadata);
    makePlots(sample_data, metadata);
}

function makePlots(sample_data, metadata) {
    $('#progress_gif').hide();
    $('#plots').show();

    makeBar(sample_data);
    makeBubble(sample_data);
    makeGauge(metadata);
}

function makeFilters(data) {
    data.names.forEach(function(val) {
        var newOption = `<option>${val}</option>`;
        $('#selDataset').append(newOption);
    });
}

function makePanel(metadata) {
    $("#sample-metadata").empty();

    Object.entries(metadata).forEach(function(key_value, index) {
        var entry = `<span><b>${key_value[0]}:</b> ${key_value[1]}</span><br>`;
        $("#sample-metadata").append(entry);
    });
}

function makeBar(sample_data) {
    var y_labels = sample_data.otu_ids.slice(0, 10).reverse().map(x => `OTU ID: ${x}`); // make string
    var trace = {
        x: sample_data.sample_values.slice(0, 10).reverse(),
        y: y_labels,
        text: sample_data.otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: "h"
    };

    var layout = {
        title: "Populous Belly Button Bacteria",
        xaxis: { title: "Amount of Bacteria" },
        yaxis: { title: "Bacteria" }
    }

    var traces = [trace];

    Plotly.newPlot('bar', traces, layout);
}

function makeBubble(sample_data) {
    var trace = {
        x: sample_data.otu_ids,
        y: sample_data.sample_values,
        mode: 'markers',
        marker: {
            size: sample_data.sample_values,
            color: sample_data.otu_ids
        },
        text: sample_data.otu_labels
    };

    var traces = [trace];

    var layout = {
        title: "Belly Button Bacteria",
        xaxis: { title: "Bacteria" },
        yaxis: { title: "Amount of Bacteria" }
    }

    Plotly.newPlot('bubble', traces, layout);
}

function makeGauge(metadata) {
    var max_wfreq = 10;

    var trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: metadata.wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        gauge: {
            axis: { range: [null, max_wfreq] },
            steps: [
                { range: [0, 7], color: "pink" },
                { range: [7, 10], color: "blue" }
            ],
            threshold: {
                line: { color: "black", width: 5 },
                thickness: 0.60,
                value: 2
            }
        },
        mode: "gauge+number"
    };
    var traces = [trace];

    var layout = {}
    Plotly.newPlot('gauge', traces, layout);
}