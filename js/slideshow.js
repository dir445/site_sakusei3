
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
    
    const divs = slideshow.getElementsByTagName('div');
    let org_slides = [];
    let slideImgs = [];
    for(const div of divs) {
        const imgs = div.getElementsByTagName('img');
        console.log(div);
        if(imgs.length != 1) {
            continue;
        }
        div.classList.add('slide');
        const img = imgs[0];
        img.draggable = false;
        slideImgs.push(img);        
        org_slides.push(div);
    }

    slideshow.appendChild(prevButton);
    slideshow.appendChild(slideList);
    slideshow.appendChild(nextButton);
    slideshow.appendChild(dotList);

    //const sideCloneCount = Math.floor(slideImgs.length / 2);

    waitOnComplete(slideImgs , function(){
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
        let slider = new Slider(slideTrack,slideImgs.length,slideWidth,0.5,selectDot);
        let slides = new Array(slider.allCount);
        //スライドの先頭に末尾のスライドの複製を挿入
        for(let i = 0;i<slider.sideCloneCount; i++){
            let clone = org_slides[org_slides.length -1 - i].cloneNode(true);
            slides[slider.sideCloneCount - 1 - i] = clone;
            slideTrack.insertBefore(clone, slideTrack.firstChild);        
        }
        //スライドをトラックの子要素に移動し、ボタンを追加する
        for(let i = 0;i < org_slides.length; i++) {
            slides[slider.sideCloneCount + i] = org_slides[i];
            slideTrack.appendChild(org_slides[i]);
            dotList.appendChild(createDotListElement(i,dotButtons,slider));
        }
        //スライドの末尾に先頭のスライドの複製を追加
        for(let i = 0;i<slider.sideCloneCount; i++){
            let clone = org_slides[i].cloneNode(true);
            slides[slider.sideCloneCount + org_slides.length + i] = clone;
            slideTrack.appendChild(clone);
        }        
        //各div要素の大きさを画像の大きさに合わせて設定する
        slideshow.style.maxWidth = slideWidth + 'px';
        slideList.style.maxWidth = slideWidth + 'px';

        slideTrack.style.width = (slides.length * 100) + '%';
        slideTrack.style.paddingBottom = (slideHeight / slideWidth * 100) + '%';
        
        slides.forEach((slide,i)=>{
            slide.style.maxWidth = (100 / slides.length) + '%';
        });

        slider.resetTrackPosition();
        selectDot(slider.current);
        //ボタンを押したときの動作を設定
        prevButton.onclick = ()=>slider.move(-1);
        nextButton.onclick = ()=>slider.move(1);
        //スライドをドラッグした時の動作を設定
        slideTrack.onmousedown  = startDrag;

        slideshow.classList.add('slideshow-initialized');

        function startDrag(event) {
            if(slider.animate){
                return;
            }
            const dragMin = 0.2;
            const dragMax = 0.4;
            const mousedownX = event.pageX;
            let moveX = 0;
            slideTrack.onmousemove = event => {
                moveX = (event.pageX - mousedownX) /slideList.clientWidth;
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
        
        function moveTrack(moveX) {
            slideTrack.style.transform = 'translateX('+ ( slider.trackX + moveX /slider.allCount * 100  ) + '%)';
        }        
        
        function createDotListElement(index) {
            let dot = document.createElement('li');
            dot.classList.add('dot');
            let button = document.createElement('button');
            button.onclick = () => slider.moveTo(index);
            dotButtons.push(button);
            dot.appendChild(button);
            return dot;
        }

        function selectDot(index) {
            const className = 'dot-selected';
            dotButtons.forEach(b => b.classList.remove(className));
            dotButtons[index].classList.add(className);
        }
    });
}

function mod(a,b) {
    return (a % b + b) % b;
}

function waitOnComplete(elements,onComplete) {
    let elemSet = new Set(elements);
    let intervalId = setInterval( function () {
        elemSet.forEach(e => {
            if(e.complete) {
                elemSet.delete(e);
            }
        });
        if ( elemSet.size == 0) {
            onComplete();
            clearInterval( intervalId ) ;
        }
    }, 500 ) ;
}

class Slider {
    constructor(slideTrack,slideCount,slideWidth,duration,selectDot) {
        this.current = 0;
        this.animate = false;
        this.trackX = 0;
        this.duration = duration;
        this.slideTrack = slideTrack;
        this.slideCount = slideCount;
        this.slideWidth = slideWidth;
        this.selectDot = selectDot;
    }

    get allCount() {
        return this.slideCount + this.sideCloneCount * 2;
    }

    get sideCloneCount() {
        return Math.floor(this.slideCount / 2);
    }

    move(moveCount) {
        if(this.animate){
            return;
        }
        const dest = mod(this.current + moveCount,  this.slideCount);
        this.selectDot(dest);
        //移動するときだけトランジションを有効にする
        this.slideTrack.style.transition = 'transform ' + this.duration + 's';
        this.slideTrack.style.transform = 'translateX('+  ( this.trackX - moveCount / this.allCount * 100 ) + '%)';
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
        this.trackX = -(this.current + this.sideCloneCount) / this.allCount * 100;
        this.slideTrack.style.transform = 'translateX('+  this.trackX + '%)';
    }
}
