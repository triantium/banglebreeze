// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
// position on screen
const X = g.getWidth() / 2, Y = 70;


let bands = require("Storage").readJSON('runningorder.json', true); // just check undefined afterwards

if (bands === undefined ) {
    bands = [];
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}


function drawBands( bands){

    // clear up bandspace
    g.clearRect(0 , Y + 24 ,175 , 175);

    for (let index in bands) {
        if (index >= 9) break;
        band = bands[index];
        let starttime = `${zeroPad(band.starttime.getHours(), 2)}:${zeroPad(band.starttime.getMinutes(), 2)}`;
        g.setFont("6x8");
        g.setFontAlign(-1, 1); // align center bottom
        let vertPos = Y + (24 + (10 * index));
        g.drawString(starttime, 0, vertPos, true /*clear background*/);
        g.drawString(band.stage.substring(0, 4), 35, vertPos, true /*clear background*/);
        if (band.highlight) {
            g.drawRect(60, vertPos - 7, 64, vertPos - 2);
        } else {
            g.clearRect(60, vertPos - 7, 64, vertPos - 2);
        }
        let bandpadded = band.band.padEnd(20);
        g.drawString(bandpadded, 69, vertPos, true /*clear background*/);
    }
}

for (var band in bands) {
    bands[band].starttime = new Date(bands[band].start);
    bands[band].endtime = new Date(bands[band].end);
}



function draw() {
    // work out how to display the current time
    const d = new Date();
    const h = d.getHours(), m = d.getMinutes();
    const time = (" " + h).substr(-2) + ":" + ("0" + m).substr(-2);
    // Reset the state of the graphics library
    g.reset();
    // Set Background black
    g.setBgColor(0,0,0);
    // draw the current time (4x size 7 segment)
    g.setFont("7x11Numeric7Seg", 4);
    g.setFontAlign(0, 1);
    g.drawString(time, X, Y, true /*clear background*/);
    // draw the date, in a normal font
    g.setFont("6x8");
    g.setFontAlign(0, 1); // align center bottom
    // pad the date - this clears the background if the date were to change length
    var dateStr = "    " + require("locale").date(d) + "    ";
    g.drawString(dateStr, g.getWidth() / 2, Y + 15, true /*clear background*/);

    let filtered = bands.filter((a) => {
        return (a.endtime.getTime() > d.getTime());
    });

    filtered.sort((a, b) => {
        let order = a.starttime - b.starttime;
        if (order === 0){
            return a.endtime - b.endtime;
        }
        return order;
    });

    drawBands(filtered);

}

// Clear the screen once, at startup
g.clear();
// draw immediately at first
draw();
var secondInterval = setInterval(draw, 30000);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower', on => {
    if (secondInterval) clearInterval(secondInterval);
    secondInterval = undefined;
    if (on) {
        secondInterval = setInterval(draw, 30000);
        draw(); // draw immediately
    }
});
// Show launcher when middle button pressed
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();