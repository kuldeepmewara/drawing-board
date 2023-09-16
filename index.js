const canvas = document.querySelector("canvas");
const toolBtns=document.querySelectorAll(".tool");
const sizeSlider=document.querySelector("#size-slider");
const colorBtns=document.querySelectorAll(".colors .option");
const fillColor=document.querySelector("#fill-color");
const colorPicker=document.querySelector("#color-picker")
const saveImg=document.querySelector(".save-img")

const clearCanvas=document.querySelector(".clear-canvas")
const ctx = canvas.getContext("2d");

let preMouseX,preMouseY;
let isdrawing = false;
let brushWidth=5;
let selectedTool="brush";
let snapshot;
let selectedColor='#000';

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackgroundColor()
});
const setCanvasBackgroundColor=()=>{
    //setting whole canvas background to white, so the downloaded img background will be white;
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;

}
const drawRec=(e)=>{
    if(!fillColor.checked)
    return ctx.strokeRect(e.offsetX,e.offsetY,preMouseX-e.offsetX,preMouseY-e.offsetY);
    ctx.fillRect(e.offsetX,e.offsetY,preMouseX-e.offsetX,preMouseY-e.offsetY);
    
}
const drawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow(preMouseX-e.offsetX,2)+Math.pow(preMouseY-e.offsetY,2));
    ctx.arc(preMouseX,preMouseY,radius,0,2*Math.PI);
    fillColor.checked ?ctx.fill():ctx.stroke();   
}

const drawTriangle=(e)=>{
    ctx.beginPath();//creating new path
    ctx.moveTo(preMouseX,preMouseY);//moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX,e.offsetY);//creating first line acc to mouse pointer
    ctx.lineTo(preMouseX*2-e.offsetX,e.offsetY);//creating bottom line of triangle
    ctx.closePath()//closing path so 3rd line draw automatically
    fillColor.checked ?ctx.fill():ctx.stroke();
    
}
const drawing = (e) => {
  if (!isdrawing) return;  
  ctx.putImageData(snapshot,0,0); //adding copied canvas data on to this canvas;
  if(selectedTool==="brush"||selectedTool==="eraser")
  {
    ctx.strokeStyle=selectedTool==="eraser"?"#fff":selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); //create line
    ctx.stroke();
  }
  else if(selectedTool==="rectangle")
  {
    drawRec(e)
  }
  else if(selectedTool==="circle")
  {
    drawCircle(e)
  }
  else if(selectedTool==="triangle")
  {
    drawTriangle(e)
  }
 
};
const startDrawing = (e) => {
  isdrawing = true;
  preMouseX=e.offsetX;
  preMouseY=e.offsetY;
  ctx.beginPath();
  ctx.lineWidth=brushWidth;
  ctx.strokeStyle=selectedColor;
  ctx.fillStyle=selectedColor;
//copying canvas data & passing as snapshot value.. this avoids dragging the image
  snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
};
const stopDrawing = () => {
  isdrawing = false;
};

toolBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(btn)
    })

})
colorBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected")?.classList.remove("selected");
        btn.classList.add("selected");
        selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})
colorPicker.addEventListener("change",()=>{
    //passing picked color value to last color btn background
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackgroundColor();
})
saveImg.addEventListener("click",()=>{
    //setCanvasBackgroundColor();
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
})
sizeSlider.addEventListener("change",()=>brushWidth=sizeSlider.value)
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);
