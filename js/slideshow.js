let imgSrcs = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg'];
let slides = [];
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

let slider = {
    current : 0,
    animate : false,
    prev() {
        return (this.current - 1) % slides.length;
    },
    next() {
        return (this.current + 1) % slides.length;
    },
    slideRight() {
        this.current++;
        if(this.current >= slides.length){
            this.current = 0;
            slideTrack.style.transition = 'transform : 0s';
            slideTrack.style.transform = 'translateX('+ maxWidth + 'px)';
            slideTrack.addEventListener('ontransitionend',()=>{
                console.log('end');
                slideTrack.style.transition = 'transform : 0.5s';
                slideTrack.style.transform = 'translateX('+ (this.current * -maxWidth) + 'px)';
            },{once:true});
        }
        else {
            slideTrack.style.transform = 'translateX('+ (this.current * -maxWidth) + 'px)';
        }
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

console.log(slider.next());

function onImagesLoaded() {
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
    //slides[slides.length - 1].style.left = -maxWidth + 'px';


    document.getElementsByClassName('next-button')[0].addEventListener('click',()=>slider.slideRight());
}
