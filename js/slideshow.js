let imgSrcs = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg'];
let slides = [null];
let slideList = document.getElementsByClassName('slide-list')[0];
let slideTrack = document.getElementsByClassName('slide-track')[0];
let slideshow = document.getElementsByClassName('slideshow')[0];
let maxWidth = 0;
let maxHeight = 0;

let loaded = {
    count : 0,
    add() {
        this.count++;
        if(this.count == imgSrcs.length){
            onImagesLoaded();
        }
    }
};

console.log(5%5);
console.log(-1%5);

let slider = {
    current : 0,
    animate : false,

    move(moveCount) {
        if(this.animate){
            return;
        }
        //移動するときだけトランジションを有効にする
        slideTrack.style.transition = 'transform 0.5s';
        slideTrack.style.transform = 'translateX('+ ((this.current + moveCount + 1) * -maxWidth) + 'px)';
        this.animate = true;
        slideTrack.addEventListener('transitionend',()=>{            
            this.current = (this.current + moveCount) % imgSrcs.length;
            this.animate = false;
            slideTrack.style.transition ='none';
            slideTrack.style.transform = 'translateX('+  (this.current + 1) * -maxWidth + 'px)';
            console.log(this.current);
        },{once:true});        
    }    
};

console.log(slider.current);

for(src of imgSrcs) {
    let img = new Image();
    img.src = src;
    img.onload = ()=> {
        if(img.naturalWidth > maxWidth){
            maxWidth = img.naturalWidth;
        }
        if(img.naturalHeight > maxHeight){
            maxHeight = img.naturalHeight;
        }
        loaded.add();
    };
    let slide = document.createElement('div');
    slide.classList.add('slide');
    slide.appendChild(img);
    slides.push(slide);
    slideTrack.appendChild(slide);
}

function onImagesLoaded() {
    //スライドの先頭に末尾のスライドの複製を挿入
    let topClone = slides[slides.length - 1].cloneNode(true);
    slides[0] = topClone;
    slideTrack.insertBefore(topClone, slideTrack.firstChild);
    //スライドの末尾に先頭のスライドの複製を追加
    let bottomClone = slides[1].cloneNode(true);
    slides.push(bottomClone);
    slideTrack.appendChild(bottomClone);

    for(let slide of slides) {
        slide.style.width =  maxWidth + 'px';
    }
    slideTrack.style.width = (maxWidth * slides.length) + 'px';     
    slideTrack.style.height = maxHeight + 'px';  
    slideList.style.width = maxWidth + 'px';
    slideshow.style.width = maxWidth + 'px';
    for(let i = 0;i < slides.length; ++i) {
        slides[i].style.left = maxWidth * i +'px';
    }

    slideTrack.style.transform = 'translateX('+  -maxWidth + 'px)';

    document.getElementsByClassName('next-button')[0].addEventListener('click',()=>slider.move(1));
    document.getElementsByClassName('prev-button')[0].addEventListener('click',()=>slider.move(-1));
}
