object = "";
object = [];
loaded = false;
object_name = "";
searching = false;
delay = 0;
spoken = false;

function search()
{   if (document.getElementById('search').value != "")
    {
        searching = true
    }
}

function preload()
{

}

function setup()
{
    canvas = createCanvas(480, 380);
    canvas.center();
    video =  createCapture(VIDEO);
    video.size(480, 380);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    synth = window.speechSynthesis;
}

function draw()
{
    if (loaded==true)
    {
        if (searching == false)
        {
            image(video, 0, 0, 480, 380);
        }
        objectDetector.detect(video, gotResults);
        for (i = 0; i<object.length; i++)
        {
            document.getElementById('status').innerHTML='Status : '+object.length+" "+"Detected";
            if (searching == false)
            {
                fill("red");
                var percent = floor(object[i].confidence*100);
                text(object[i].label+" "+percent+"%", object[i].x+15, object[i].y+15);
                noFill();
                stroke("red");
                rect(object[i].x, object[i].y, object[i].width, object[i].height);
            }
            if (document.getElementById('search').value != "" && searching == true)
            {
                objectDetector.detect(gotResults);
                if (object[i].label==document.getElementById('search').value)
                {
                    if (searching == true)
                    {
                        if (spoken == false)
                        {
                            spoken = true;
                            utterThis = new SpeechSynthesisUtterance("Found "+document.getElementById('search').value);
                            synth.speak(utterThis);
                        }
                        delay++;
                        if (delay > 100)
                        {
                            utterThis = "";
                            searching = false;
                            delay = 0;
                            spoken = false;
                        }
                    }
                }
                else
                {
                    if (searching == true)
                    {
                        if (spoken == false)
                        {
                            spoken = true;
                            utterThis = new SpeechSynthesisUtterance("Failed to find target");
                            synth.speak(utterThis);                            
                        }
                        delay++;
                        if (delay > 100)
                        {
                            utterThis = "";
                            searching = false;
                            delay = 0;
                            spoken = false;
                        }
                    }
                }
            }
        }
    }
    
}

function modelLoaded()
{
    console.log('cocossd loaded');
    // objectDetector.detect(video, gotResults);
    loaded = true;
}

function gotResults(error, results)
{
    if (error)
    {
        console.error(error);
    }
    else
    {
        console.log(results);
        object = results;
    }
}