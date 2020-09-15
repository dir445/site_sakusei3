let imgSrcs = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg'];
let slides = [null];
let slideList = document.getElementsByClassName('slide-list')[0];
let slideTrack = document.getElementsByClassName('slide-track')[0];
let slideshow = document.getElementsByClassName('slideshow')[0];
let prevButton = document.getElementsByClassName('prev-button')[0];
let nextButton = document.getElementsByClassName('next-button')[0];
let dotList = document.getElementsByClassName('dots')[0];
const cloneCount = 1;
let slideWidth = 0;
let slideHeight = 0;

let loaded = {
    count : 0,
    add() {
        this.count++;
        if(this.count == imgSrcs.length){
            onImagesLoaded();
        }
    }
};

let slider = {
    current : 0,
    animate : false,
    trackX : 0,
    resetTrackPosition(){
        this.trackX = (this.current + cloneCount) * -slideWidth;
        slideTrack.style.transform = 'translateX('+  this.trackX + 'px)';
    },
    move(moveCount) {
        if(this.animate){
            return;
        }
        //移動するときだけトランジションを有効にする
        slideTrack.style.transition = 'transform 0.5s';
        slideTrack.style.transform = 'translateX('+  ( this.trackX - moveCount * slideWidth ) + 'px)';
        this.animate = true;
        slideTrack.addEventListener('transitionend',()=>{            
            this.current = mod(this.current + moveCount,  imgSrcs.length);
            this.animate = false;
            slideTrack.style.transition ='none';
            this.resetTrackPosition();
            console.log('transition end');
        },{once:true});        
    }    
};

for(src of imgSrcs) {
    let img = new Image();
    img.src = src;
    img.onload = ()=> {
        if(img.naturalWidth > slideWidth){
            slideWidth = img.naturalWidth;
        }
        if(img.naturalHeight > slideHeight){
            slideHeight = img.naturalHeight;
        }
        loaded.add();
    };
    img.draggable = false;
    let slide = document.createElement('div');
    slide.classList.add('slide');
    slide.appendChild(img);
    slides.push(slide);
    slideTrack.appendChild(slide);
}

function mod(a,b) {
    return (a % b + b) % b;
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
        slide.style.width =  slideWidth + 'px';
    }
    slideTrack.style.width = (slideWidth * slides.length) + 'px';     
    slideTrack.style.height = slideHeight + 'px';  
    slideList.style.width = slideWidth + 'px';
    slideshow.style.width = slideWidth + 'px';
    for(let i = 0;i < slides.length; ++i) {
        slides[i].style.left = slideWidth * i +'px';
    }
    slider.resetTrackPosition();
    //ボタンを押したときの動作を設定
    prevButton.onclick = ()=>slider.move(-1);
    nextButton.onclick = ()=>slider.move(1);
    //スライドをドラッグした時の動作を設定
    slideTrack.onmousedown  = startDrag;
}

function startDrag(event) {
    if(slider.animate){
        return;
    }
    let dragMin = slideWidth * 0.2;
    let dragMax = slideWidth * 0.4;
    let mousedownX = event.pageX;
    let moveX = 0;
    slideTrack.onmousemove = (event) => {
        moveX = event.pageX - mousedownX;
        if(Math.abs(moveX) > dragMax) {
            endDrag();
            slider.move(Math.sign(-moveX));
            return;
        }
        moveTrack(moveX);
    };
    let onMouseUp = ()=>{
        endDrag();
        if(Math.abs(moveX) >= dragMin) {
            slider.move(Math.sign(-moveX));
        } else if(moveX != 0) {
            slider.move(0);
        }
    };
    slideTrack.onmouseup = onMouseUp;
    slideTrack.onmouseleave = onMouseUp;
}

function endDrag(){
    slideTrack.onmousemove = null;  
    slideTrack.onmouseup = null;
    slideTrack.onmouseleave = null;
}

function moveTrack(move) {
    slideTrack.style.transform = 'translateX('+ ( slider.trackX + move ) + 'px)';
    console.log(move);
}
