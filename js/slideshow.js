let imgSrcs = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg'];

let slideList = document.getElementsByClassName('slide-list')[0];
let slideTrack = document.getElementsByClassName('slide-track')[0];
let slideshow = document.getElementsByClassName('slideshow')[0];
let prevButton = document.getElementsByClassName('prev-button')[0];
let nextButton = document.getElementsByClassName('next-button')[0];
let dotList = document.getElementsByClassName('dots')[0];
let dotButtons = [];

let aaa='aaa';
function Test(str) {
    this.log = function (){
        console.log('test:' + str);
    }
    this.setbbb = function() {
        str = 'bbb';
    }
}
let test = new Test(aaa);
test.log();
aaa = 'bbb';
test.log();
test.setbbb();
test.log();

function LoadCounter(max, onloaded) {
    this.count = 0;
    this.add = function() {
        this.count++;
        if(this.count == max) {
            onloaded();
        }
    }
}

// function Slider(slideTrack,slideCount,slideWidth) {
//     this.current = 0;
//     this.animate = false;
//     this.trackX = 0;
//     this.duration = 0.5;

//     this.resetTrackPosition = function() {
//         this.trackX = (this.current + sideCloneCount) * -slideWidth;
//         this.slideTrack.style.transform = 'translateX('+  this.trackX + 'px)';
//     };
    
//     this.move = function(moveCount) {
//         if(this.animate){
//             return;
//         }
//         const dest = mod(this.current + moveCount,  slideCount);
//         selectDot(dest);
//         //移動するときだけトランジションを有効にする
//         this.slideTrack.style.transition = 'transform ' + this.duration + 's';
//         this.slideTrack.style.transform = 'translateX('+  ( this.trackX - moveCount * slideWidth ) + 'px)';
//         this.animate = true;
//         slideTrack.addEventListener('transitionend',()=>{            
//             this.current = dest;
//             this.animate = false;
//             this.slideTrack.style.transition ='none';
//             this.resetTrackPosition();
//         },{once:true});        
//     };
    
//     this.moveTo = function(dest) {
//         if(this.animate || dest == this.current){
//             return false;
//         }
//         const noLoop = dest - this.current;
//         const loop = dest > this.current ? noLoop - slideCount
//                                          : noLoop + slideCount;
//         const moveCount = Math.abs(noLoop) < Math.abs(loop) ? noLoop : loop;
//         this.move(moveCount);
//         return true;
//     };
// }

// let slideshows = document.getElementsByClassName('slideshow');
// for(const slideshow of slideshows) {
//     let slides = slideshow.children('div');



//     let prevButton = document.createElement('button');
//     prevButton.classList.add('prev-button');
//     let nextButton = document.createElement('button');
//     nextButton.classList.add('next-button');
//     let slideList = document.createElement('div');
//     slideList.classList.add('slide-list');
//     let slideTrack = document.createElement('div');
//     slideTrack.className.add('slide-track');
//     slideList.appendChild(slideTrack);
//     let dotList = document.createElement('ul');
//     dotList.classList.add('dots');  
//     slideshow.appendChild(prevButton);
//     slideshow.appendChild(slideList);
//     slideshow.appendChild(nextButton);
//     slideshow.appendChild(dots);
    
    
// }




const sideCloneCount = Math.floor(imgSrcs.length / 2);
let slides = new Array(sideCloneCount);
let slideWidth = 0;
let slideHeight = 0;

let loadCounter = new LoadCounter(imgSrcs.length , onImagesLoaded);
// let loadCounter = {
//     count : 0,
//     add() {
//         this.count++;
//         if(this.count == imgSrcs.length){
//             onImagesLoaded();
//         }
//     }
// };

function selectDot(index) {
    const className = 'dot-selected';
    dotButtons.forEach(b => b.classList.remove(className));
    dotButtons[index].classList.add(className);
}

let slider = {
    current : 0,
    animate : false,
    trackX : 0,
    duration : 0.5,
    resetTrackPosition(){
        this.trackX = (this.current + sideCloneCount) * -slideWidth;
        slideTrack.style.transform = 'translateX('+  this.trackX + 'px)';
    },
    move(moveCount) {
        if(this.animate){
            return;
        }
        const dest = mod(this.current + moveCount,  imgSrcs.length);
        selectDot(dest);
        //移動するときだけトランジションを有効にする
        slideTrack.style.transition = 'transform ' + this.duration + 's';
        slideTrack.style.transform = 'translateX('+  ( this.trackX - moveCount * slideWidth ) + 'px)';
        this.animate = true;
        slideTrack.addEventListener('transitionend',()=>{            
            this.current = dest;
            this.animate = false;
            slideTrack.style.transition ='none';
            this.resetTrackPosition();
        },{once:true});        
    },
    moveTo(dest) {
        if(this.animate || dest == this.current){
            return false;
        }
        const noLoop = dest - this.current;
        const loop = dest > this.current ? noLoop - imgSrcs.length
                                         : noLoop + imgSrcs.length;
        const moveCount = Math.abs(noLoop) < Math.abs(loop) ? noLoop : loop;
        this.move(moveCount);
        return true;
    } 
};

for(let i = 0; i < imgSrcs.length; i++) {
    const src = imgSrcs[i];
    let img = new Image();
    img.src = src;
    img.onload = ()=> {
        if(img.naturalWidth > slideWidth){
            slideWidth = img.naturalWidth;
        }
        if(img.naturalHeight > slideHeight){
            slideHeight = img.naturalHeight;
        }
        loadCounter.add();
    };
    img.draggable = false;
    let slide = document.createElement('div');
    slide.classList.add('slide');
    slide.appendChild(img);
    slides.push(slide);
    slideTrack.appendChild(slide);
    dotList.appendChild(createDotListElement(i,dotButtons));
}

selectDot(slider.current);

function mod(a,b) {
    return (a % b + b) % b;
}

function createDotListElement(index,buttons) {
    let dot = document.createElement('li');
    dot.classList.add('dot');
    let button = document.createElement('button');
    button.onclick = () =>{
        if(!slider.moveTo(index)){
            return;
        }        
    };
    buttons.push(button);
    dot.appendChild(button);
    return dot;
}

function onImagesLoaded() {
    //スライドの先頭に末尾のスライドの複製を挿入
    for(let i = 0;i<sideCloneCount; i++){
        let topClone = slides[slides.length - i -1].cloneNode(true);
        slides[sideCloneCount - 1 - i] = topClone;
        slideTrack.insertBefore(topClone, slideTrack.firstChild);        
    }
    //スライドの末尾に先頭のスライドの複製を追加
    for(let i = 0;i<sideCloneCount; i++){
        let bottomClone = slides[sideCloneCount + i].cloneNode(true);
        slides.push(bottomClone);
        slideTrack.appendChild(bottomClone);
    }
    slideTrack.style.width = (slideWidth * slides.length) + 'px';  
    slideTrack.style.height = slideHeight + 'px';  
    slideList.style.width = slideWidth + 'px';
    slideshow.style.width = slideWidth + 'px';
    slides.forEach((slide,i)=>{
        slide.style.width = slideWidth + 'px';
        slides[i].style.left = slideWidth * i +'px';
    });
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
    const dragMin = slideWidth * 0.2;
    const dragMax = slideWidth * 0.4;
    const mousedownX = event.pageX;
    let moveX = 0;
    slideTrack.onmousemove = event => {
        moveX = event.pageX - mousedownX;
        if(Math.abs(moveX) > dragMax) {
            endDrag();
            slider.move(Math.sign(-moveX));
            return;
        }
        moveTrack(moveX);
    };
    let onMouseUpOrLeave = ()=> {
        endDrag();
        if(Math.abs(moveX) >= dragMin) {
            slider.move(Math.sign(-moveX));
        } else if(moveX != 0) {
            slider.move(0);
        }
    };
    slideTrack.onmouseup = onMouseUpOrLeave;
    slideTrack.onmouseleave = onMouseUpOrLeave;
}

function endDrag(){
    slideTrack.onmousemove = null;  
    slideTrack.onmouseup = null;
    slideTrack.onmouseleave = null;
}

function moveTrack(move) {
    slideTrack.style.transform = 'translateX('+ ( slider.trackX + move ) + 'px)';
}
