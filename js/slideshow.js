let imgSrcs = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg'];
let slides = [];
let slideList = document.getElementsByClassName('slide-list')[0];
let maxWidth = 0;

let loaded = {
    count : 0
};
loaded.add = function() {
    this.count++;
    if(this.count == imgSrcs.length){
        slideList.setAttribute('width', maxWidth * imgSrcs.length);
        for(let slide of slides) {
            slide.setAttribute('width', maxWidth);
        }
    }
};

for(src of imgSrcs) {
    let img = new Image();
    img.src = src;
    img.onload = ()=> {
        if(img.width > maxWidth){
            maxWidth = img.width;
        }
        loaded.add();
    };
    let slide = document.createElement('div');
    slide.classList.add('slide');
    slide.appendChild(img);
    slides.push(slide);
    slideList.appendChild(slide);
}

