
import renderPixi from './pixiScript'


const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

myScript(size);

//window.addEventListener("resize", myScript);

function myScript() {
    console.log('document.body.addEventListener("resize", myScript);')
    renderPixi({
        width: window.innerWidth,
        height: window.innerHeight
    });
}


