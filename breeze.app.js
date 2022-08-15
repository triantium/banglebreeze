

let bands = [{band:"VOODOO KISS",start:"2022-08-16T17:00:00",end:"2022-08-16T17:30:00",stage:"Party",highlight:false},{band:"CRACK UP",start:"2022-08-16T18:00:00",end:"2022-08-16T18:30:00",stage:"Party",highlight:false},{band:"APOPHIS",start:"2022-08-16T19:00:00",end:"2022-08-16T19:45:00",stage:"Party",highlight:false},{band:"FLESHCRAWL",start:"2022-08-16T20:15:00",end:"2022-08-16T21:15:00",stage:"Party",highlight:false},{band:"END OF GREEN",start:"2022-08-16T21:45:00",end:"2022-08-16T23:00:00",stage:"Party",highlight:false},{band:"RAISED FIST",start:"2022-08-17T16:10",end:"2022-08-17T17:10",stage:"Main",highlight:false},{band:"CALIBAN",start:"2022-08-17T17:40",end:"2022-08-17T18:40",stage:"Main",highlight:false},{band:"FEUERSCHWANZ",start:"2022-08-17T19:10",end:"2022-08-17T20:30",stage:"Main",highlight:false},{band:"EISBRECHER",start:"2022-08-17T21:15",end:"2022-08-17T22:45",stage:"Main",highlight:false},{band:"KORPIKLAANI",start:"2022-08-17T23:25",end:"2022-08-18T00:35",stage:"Main",highlight:false},{band:"APOK. REITER",start:"2022-08-18T01:00",end:"2022-08-18T02:00",stage:"Main",highlight:false},{band:"BLASMUSIK",start:"2022-08-17T15:00",end:"2022-08-17T16:00",stage:"T-Stage",highlight:false},{band:"PALLBEARER",start:"2022-08-17T16:50",end:"2022-08-17T17:35",stage:"T-Stage",highlight:false},{band:"EXODUS",start:"2022-08-17T18:25",end:"2022-08-17T19:10",stage:"T-Stage",highlight:false},{band:"TESTAMENT",start:"2022-08-17T20:00",end:"2022-08-17T21:00",stage:"T-Stage",highlight:false},{band:"PARADISE LOST",start:"2022-08-17T21:50",end:"2022-08-17T22:50",stage:"T-Stage",highlight:false},{band:"FLESHGOD APOCALYPSE",start:"2022-08-17T23:40",end:"2022-08-18T00:25",stage:"T-Stage",highlight:false},{band:"TURBOBIER",start:"2022-08-18T01:15",end:"2022-08-18T02:15",stage:"T-Stage",highlight:false},{band:"SIAMESE",start:"2022-08-17T16:05",end:"2022-08-17T16:45",stage:"Wera",highlight:false},{band:"URNE",start:"2022-08-17T17:40",end:"2022-08-17T18:20",stage:"Wera",highlight:false},{band:"PALEFACE",start:"2022-08-17T19:15",end:"2022-08-17T19:55",stage:"Wera",highlight:false},{band:"OUR PROMISE",start:"2022-08-17T21:05",end:"2022-08-17T21:45",stage:"Wera",highlight:false},{band:"SVALBARD",start:"2022-08-17T22:55",end:"2022-08-17T23:35",stage:"Wera",highlight:false},{band:"NYRST",start:"2022-08-18T00:30",end:"2022-08-18T01:10",stage:"Wera",highlight:false},{band:"SPASM",start:"2022-08-18T02:20",end:"2022-08-18T03:00",stage:"Wera",highlight:false},{band:"MORBID ALCOHOLICA",start:"2022-08-17T17:00",end:"2022-08-17T17:40",stage:"Party",highlight:false},{band:"GUTRECTOMY",start:"2022-08-17T18:10",end:"2022-08-17T18:50",stage:"Party",highlight:false},{band:"HAWXX",start:"2022-08-17T19:20",end:"2022-08-17T20:00",stage:"Party",highlight:false},{band:"THE PROPHECY 23",start:"2022-08-17T20:30",end:"2022-08-17T21:10",stage:"Party",highlight:false},{band:"THE OTHER",start:"2022-08-17T21:40",end:"2022-08-17T22:20",stage:"Party",highlight:false},{band:"1914",start:"2022-08-17T22:50",end:"2022-08-17T23:30",stage:"Party",highlight:true}];


function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

var d = new Date();

for (var band in bands){
    bands[band].starttime=new Date(bands[band].start);
    bands[band].endtime=new Date(bands[band].end);
}


// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
// position on screen
const X = g.getWidth()/2, Y = 70;

function draw() {
    // work out how to display the current time
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var time = (" "+h).substr(-2) + ":" + ("0"+m).substr(-2);
    // Reset the state of the graphics library
    g.reset();
    // draw the current time (4x size 7 segment)
    g.setFont("7x11Numeric7Seg",4);
    g.setFontAlign(0,1);
    g.drawString(time, X, Y, true /*clear background*/);
    // draw the date, in a normal font
    g.setFont("6x8");
    g.setFontAlign(0,1); // align center bottom
    // pad the date - this clears the background if the date were to change length
    var dateStr = "    "+require("locale").date(d)+"    ";
    g.drawString(dateStr, g.getWidth()/2, Y+15, true /*clear background*/);

    let filtered = bands.filter((a)=>{
        return (a.endtime.getTime() > d.getTime());});

    filtered.sort((a,b)=>{return a.starttime - b.starttime;});

    for (let index in filtered){
        if (index>=8) break;
        band=filtered[index];
        let starttime=`${zeroPad(band.starttime.getHours(),2)}:${zeroPad(band.starttime.getMinutes(),2)}`;
        g.setFont("6x8");
        g.setFontAlign(-1,1); // align center bottom
        let vertPos=Y+(24+(10*index));
        g.drawString(starttime, 0, vertPos , true /*clear background*/);
        g.drawString(band.stage.substring(0,4), 35, vertPos , true /*clear background*/);
        if(band.highlight){
            g.drawRect(60,vertPos-7,64,vertPos-2);
        }
        g.drawString(band.band, 69, vertPos , true /*clear background*/);
    }
}

// Clear the screen once, at startup
g.clear();
// draw immediately at first
draw();
var secondInterval = setInterval(draw, 30000);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
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