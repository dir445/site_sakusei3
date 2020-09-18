function setOnImgsLoaded(imgs,onloaded) {
    let count = 0;
    let done = new Array(imgs.length);
    done.fill(false);
    let intervalId = setInterval( function () {
        for(let i = 0; i < imgs.length; i++) {
            if(imgs[i].complete && !done[i]) {
                count++;
                done[i] = true;
            }
        }
        if ( count == imgs.length ) {
            onloaded();
            clearInterval( intervalId ) ;
        }
    }, 500 ) ;
}

class Slider {
    constructor(slideTrack,slideCount,slideWidth) {
        this.current = 0;
        this.animate = false;
        this.trackX = 0;
        this.duration = 0.5;
        this.slideTrack = slideTrack;
        this.slideCount = slideCount;
        this.slideWidth = slideWidth;
    }

    move(moveCount) {
        if(this.animate){
            return;
        }
        const dest = mod(this.current + moveCount,  this.slideCount);
        //selectDot(dest);
        //移動するときだけトランジションを有効にする
        this.slideTrack.style.transition = 'transform ' + this.duration + 's';
        this.slideTrack.style.transform = 'translateX('+  ( this.trackX - moveCount * this.slideWidth ) + 'px)';
        this.animate = true;
        this.slideTrack.addEventListener('transitionend',()=>{            
            this.current = dest;
            this.animate = false;
            this.slideTrack.style.transition ='none';
            this.resetTrackPosition();
        },{once:true});        
    }

    moveTo(dest) {
        if(this.animate || dest == this.current){
            return false;
        }
        const noLoop = dest - this.current;
        const loop = dest > this.current ? noLoop - this.slideCount
                                         : noLoop + this.slideCount;
        const moveCount = Math.abs(noLoop) < Math.abs(loop) ? noLoop : loop;
        this.move(moveCount);
        return true;
    }

    resetTrackPosition() {
        this.trackX = (this.current + Math.floor(this.slideCount/2)) * - this.slideWidth;
        this.slideTrack.style.transform = 'translateX('+  this.trackX + 'px)';
    }
}


let slideshows = document.getElementsByClassName('slideshow');
console.log(slideshows.length);
for(const slideshow of slideshows) {
    let prevButton = document.createElement('button');
    prevButton.classList.add('prev-button');
    let nextButton = document.createElement('button');
    nextButton.classList.add('next-button');
    let slideList = document.createElement('div');
    slideList.classList.add('slide-list');
    let slideTrack = document.createElement('div');
    slideTrack.classList.add('slide-track');
    slideList.appendChild(slideTrack);
    let dotList = document.createElement('ul');
    dotList.classList.add('dots');  
    let dotButtons = [];
    
    let divs = slideshow.getElementsByTagName('div');
    let org_slides = [];
    let slideImgs = [];
    let slideCount = 0;
    console.log('div count:' + divs.length);
    for(let div of divs) {
        let imgs = div.getElementsByTagName('img');
        console.log(div);
        if(imgs.length != 1) {
            continue;
        }
        let img = imgs[0];
        slideImgs.push(img);
        img.draggable = false;
        div.classList.add('slide');
        org_slides.push(div);
        
        slideCount++;
    }

    slideshow.appendChild(prevButton);
    slideshow.appendChild(slideList);
    slideshow.appendChild(nextButton);
    slideshow.appendChild(dotList);

    const sideCloneCount = Math.floor(slideImgs.length / 2);

    setOnImgsLoaded(slideImgs , function(){
        //画像サイズの最大値を取得
        let slideWidth = 0;
        let slideHeight = 0;
        for(const img of slideImgs) {
            if(img.naturalWidth > slideWidth){
                slideWidth = img.naturalWidth;
            }
            if(img.naturalHeight > slideHeight){
                slideHeight = img.naturalHeight;
            }
        }
        let slider = new Slider(slideTrack,slideCount,slideWidth);
        let slides = new Array(org_slides.length + sideCloneCount * 2);
        //スライドの先頭に末尾のスライドの複製を挿入
        for(let i = 0;i<sideCloneCount; i++){
            let clone = org_slides[org_slides.length -1 - i].cloneNode(true);
            slides[sideCloneCount - 1 - i] = clone;
            slideTrack.insertBefore(clone, slideTrack.firstChild);        
        }
        //スライドをトラックの子要素に移動し、ボタンを追加する
        for(let i = 0;i < org_slides.length; i++) {
            slides[sideCloneCount + i] = org_slides[i];
            slideTrack.appendChild(org_slides[i]);
            dotList.appendChild(createDotListElement(i,dotButtons,slider));
        }
        //スライドの末尾に先頭のスライドの複製を追加
        for(let i = 0;i<sideCloneCount; i++){
            let clone = org_slides[i].cloneNode(true);
            slides[sideCloneCount + org_slides.length + i] = clone;
            slideTrack.appendChild(clone);
        }

        //selectDot(slider.current,dotButtons);
        //各div要素の大きさを画像の大きさに合わせて設定する
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
        
        function selectDot(index) {
            const className = 'dot-selected';
            dotButtons.forEach(b => b.classList.remove(className));
            dotButtons[index].classList.add(className);
        }
    });
}

// class LoadCounter {
//     constructor(max,onloaded){
//         this.count = 0;
//         this.max = max;
//         this.onloaded =onloaded;
//     }

//     add() {
//         this.count++;
//         if(this.count == this.max) {
//             this.onloaded();
//         }
//     }
// }

// const sideCloneCount = Math.floor(imgSrcs.length / 2);
// let slides = new Array(sideCloneCount);
// let slideWidth = 0;
// let slideHeight = 0;

// let loadCounter = new LoadCounter(imgSrcs.length , onImagesLoaded);

// function selectDot(index,buttons) {
//     const className = 'dot-selected';
//     buttons.forEach(b => b.classList.remove(className));
//     buttons[index].classList.add(className);
// }

// let slider = {
//     current : 0,
//     animate : false,
//     trackX : 0,
//     duration : 0.5,
//     resetTrackPosition(){
//         this.trackX = (this.current + sideCloneCount) * -slideWidth;
//         slideTrack.style.transform = 'translateX('+  this.trackX + 'px)';
//     },
//     move(moveCount) {
//         if(this.animate){
//             return;
//         }
//         const dest = mod(this.current + moveCount,  imgSrcs.length);
//         selectDot(dest);
//         //移動するときだけトランジションを有効にする
//         slideTrack.style.transition = 'transform ' + this.duration + 's';
//         slideTrack.style.transform = 'translateX('+  ( this.trackX - moveCount * slideWidth ) + 'px)';
//         this.animate = true;
//         slideTrack.addEventListener('transitionend',()=>{            
//             this.current = dest;
//             this.animate = false;
//             slideTrack.style.transition ='none';
//             this.resetTrackPosition();
//         },{once:true});        
//     },
//     moveTo(dest) {
//         if(this.animate || dest == this.current){
//             return false;
//         }
//         const noLoop = dest - this.current;
//         const loop = dest > this.current ? noLoop - imgSrcs.length
//                                          : noLoop + imgSrcs.length;
//         const moveCount = Math.abs(noLoop) < Math.abs(loop) ? noLoop : loop;
//         this.move(moveCount);
//         return true;
//     } 
// };

// for(let i = 0; i < imgSrcs.length; i++) {
//     const src = imgSrcs[i];
//     let img = new Image();
//     img.src = src;
//     img.onload = ()=> {
//         if(img.naturalWidth > slideWidth){
//             slideWidth = img.naturalWidth;
//         }
//         if(img.naturalHeight > slideHeight){
//             slideHeight = img.naturalHeight;
//         }
//         loadCounter.add();
//     };
//     img.draggable = false;
//     let slide = document.createElement('div');
//     slide.classList.add('slide');
//     slide.appendChild(img);
//     slides.push(slide);
//     slideTrack.appendChild(slide);
//     dotList.appendChild(createDotListElement(i,dotButtons));
// }

// selectDot(slider.current);

function mod(a,b) {
    return (a % b + b) % b;
}

function createDotListElement(index,buttons,slider) {
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

// function onImagesLoaded() {
//     //スライドの先頭に末尾のスライドの複製を挿入
//     for(let i = 0;i<sideCloneCount; i++){
//         let topClone = slides[slides.length - i -1].cloneNode(true);
//         slides[sideCloneCount - 1 - i] = topClone;
//         slideTrack.insertBefore(topClone, slideTrack.firstChild);        
//     }
//     //スライドの末尾に先頭のスライドの複製を追加
//     for(let i = 0;i<sideCloneCount; i++){
//         let bottomClone = slides[sideCloneCount + i].cloneNode(true);
//         slides.push(bottomClone);
//         slideTrack.appendChild(bottomClone);
//     }
//     slideTrack.style.width = (slideWidth * slides.length) + 'px';  
//     slideTrack.style.height = slideHeight + 'px';  
//     slideList.style.width = slideWidth + 'px';
//     slideshow.style.width = slideWidth + 'px';
//     slides.forEach((slide,i)=>{
//         slide.style.width = slideWidth + 'px';
//         slides[i].style.left = slideWidth * i +'px';
//     });
//     slider.resetTrackPosition();
//     //ボタンを押したときの動作を設定
//     prevButton.onclick = ()=>slider.move(-1);
//     nextButton.onclick = ()=>slider.move(1);
//     //スライドをドラッグした時の動作を設定
//     slideTrack.onmousedown  = startDrag;
// }

