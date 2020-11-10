var T = 1;
var cooling = 0.9999;
var region = 300;
var epochs = 20;
var citiesLength = region;
var cities = []
var cost;
var padding = 30;
var bestDist;
var bestPath = []
var temps = []
var citiesStates = []
var costs = []
var bestPaths = []
var width_n = 900;
var height_n = 900;


get_cities = function () {
    return cities;
}

get_best_path = function () {
    return bestPath;
}

set_best_dist = function () {
    let dist = cost_function(cities)

    if (dist < bestDist) {
        bestDist = dist;
        bestPath = [...cities]

    }
}

rand_start = function () {
    let cities = []
    for (let i = 0; i < citiesLength; i++) {
        let rand_width = Math.floor(Math.random() * (width_n - padding * 2)) + padding
        let rand_height = Math.floor(Math.random() * (height_n - padding * 2)) + padding
        cities.push({
            x: rand_width,
            y: rand_height
        })
    }
    return cities;
}

rand_neighbour = function (state) {
    // console.log(state)
    let cities = [...state]
    let i = Math.floor(Math.random() * region)
    let j = Math.floor(Math.random() * region)

    let temp = cities[i]
    cities[i] = cities[j]
    cities[j] = temp

    return cities
}

function mutate2Opt(route, i, j) {
    let neighbor = [...route]
    while (i != j) {
        let t = neighbor[j];
        neighbor[j] = neighbor[i];
        neighbor[i] = t;

        i = (i + 1) % citiesLength;
        if (i == j)
            break;
        j = (j - 1 + citiesLength) % citiesLength;
    }
    return neighbor;
}

cost_function = function (state) {

    let d = Math.sqrt(Math.pow(state[0].x - state[state.length - 1].x, 2) + Math.pow(state[0].y - state[state.length - 1].y, 2))

    state.reduce((a, b) => {
        d += Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
        return b
    })
    return d
}


randomInt = function (n) {
    return Math.floor(Math.random() * n)
}



function setup() {
    createCanvas(900, 900);
    cities = rand_start()
    cost = cost_function(cities)
    citiesStates.push(cities);
    temps.push(T);
    bestDist = cost
    var accept = false;
    var state_n;
    var cost_n;
    var count = 0;

    while (T >= 0.0001) {

        for (let i = 0; i < epochs; i++) {

            let k = randomInt(citiesLength);
            let l = (k + 1 + randomInt(citiesLength - 2)) % citiesLength;

            if (k > l) {
                let tmp = k;
                k = l;
                l = tmp;
            }

            state_n = mutate2Opt(cities, k, l)

            cost_n = cost_function(state_n)
            let delta_cost = Math.abs(cost - cost_n)

            if (cost_n < cost) {
                accept = true;
            } else {
                let p = Math.exp(-delta_cost / T);
                if (p >= Math.random()) {
                    accept = true;
                } else {
                    accept = false;
                }
            }
            if (accept == true) {
                cost = cost_n;
                cities = state_n;
                citiesStates.push(cities);
                temps.push(T);

            }
        }

        T *= cooling
    }


}



var len = 0
function draw() {

    background(255);

    text(`N=${citiesLength}, T=${temps[len]}`, 10, 10)

    fill(0);
    beginShape();
    for (let i = 0; i < citiesLength; i++) {
        ellipse(citiesStates[len][i].x, citiesStates[len][i].y, 8, 8);
    }
    endShape();

    noFill();
    stroke(100);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < citiesLength; i++) {
        vertex(citiesStates[len][i].x, citiesStates[len][i].y);
    }
    vertex(cities[0].x, cities[0].y)
    endShape();

    if (len >= citiesStates.length-1) 
        noLoop();
    len += 1;
}

