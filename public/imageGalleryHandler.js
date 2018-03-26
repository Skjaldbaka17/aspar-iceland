// CAROUSEL OBJECT
                function Carousel(containerID) {
                    this.container = document.getElementById(containerID) || document.body;
                    this.slides = this.container.querySelectorAll('.slides');
                    this.total = this.slides.length;
                    this.current = 0;
                    this.interval = 5000;
                    
                    // start on slide 1
                    this.slide(this.current);
                }
                
                

                // NEXT
                Carousel.prototype.next = function () {
                    this.current = (this.current+1)%this.total;
                    
                    this.stop();	
                    this.slide(this.current);
                    
                    var context = this;
                    this.run = setTimeout(function() {
                        context.next();
                    }, this.interval);
                    
                };

                // PREVIOUS
                Carousel.prototype.prev = function () {	
                    (this.current <= 0) ? this.current = this.total-1 : this.current -= 1;

                    alert(this.current);
                        
                    this.stop();	
                    this.slide(this.current);
                    
                    

                        var context = this;
                        this.run = setTimeout(function() {
                            context.prev();
                        }, this.interval);
                    };

                // STOP PLAYING
                Carousel.prototype.stop = function () {
                    clearTimeout(this.run);
                };
                // SELECT SLIDE
                Carousel.prototype.slide = function (index) {	
                    if (index >= 0 && index < this.total) { 
                        this.stop();
                        for (var s = 0; s < this.total; s++) {
                            if (s === index) {
                                this.moveToBig(this.slides[s].getAttribute('src'));
                            } 
                        }
                    } else {
                        alert("Index " + index + " doesn't exist. Available : 0 - " + this.total);
                    }
                };

                Carousel.prototype.op = function(cl) {
                    for(var i = 0; i < this.total; i++){
                        this.slides[i].style.opacity = 0.8;
                        }
                        this.slides[cl].style.opacity = 1.0;

                }

                Carousel.prototype.moveToBig = function (source){
                    var i;
                    var newPic = source.replace('http://localhost:5000', '.');

                    for(i = 0; i < this.total; i++){
                        if(this.slides[i].getAttribute('src').match(newPic)){ 
                            /* To make scroll move with pictures!
                            var el = document.getElementById('carousel');
                            el.scrollLeft = i*this.slides[i].width;*/
                            this.op(i);
                            break;
                        }
                     }

                     this.current = i%this.total;
                     fadeOutAndCallback(document.getElementById('showPic'),
                        function(){
                            document.getElementById('showPic').setAttribute('src', source);
                            fadeIn(document.getElementById('showPic'));
                        }
                        
                    );
                    
                };
                    

                var car = new Carousel('carousel');
                car.next();          

            function fadeIn(element) {
                var op = 0.2;  // initial opacity
                var timer = setInterval(function () {
                    if (op >= 1){
                        clearInterval(timer);
                    }
                    element.style.opacity = op;
                    op += 0.1;
                }, 50);
            }
            
            function fadeOutAndCallback(image, callback){
                var opacity = 1;
                var timer = setInterval(function(){
                    if(opacity < 0.2){
                        clearInterval(timer);
                        callback(); //this executes the callback function!
                    }
                    image.style.opacity = opacity;
                    opacity -=  0.1;
                }, 30);
            }