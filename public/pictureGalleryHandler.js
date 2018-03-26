function ImageGallery(){
                this.PICTURES = document.getElementsByClassName('yoda');
                var elem = document.getElementById("largeImageContainer");
                elem.addEventListener("click", stopEvent, false);
                this.current = 1;
          }

            ImageGallery.prototype.changePic = function (x){

                this.current = (this.current+x)%this.PICTURES.length;
                if(this.current < 0) this.current = this.PICTURES.length-1;



                document.getElementById("largeImage").setAttribute('src', this.PICTURES[this.current].getAttribute('src'));
            }


          ImageGallery.prototype.closeModal = function(){
                document.getElementById('myModal').style.display = "none";
          }

          ImageGallery.prototype.openModal = function(source) {
            
                var theModal = document.getElementById('myModal');
                theModal.style.display = "block";
                
                var firstPic = source.replace('http://localhost:5000', '.');
            


                var i;
                for(i = 0; i < this.PICTURES.length; i++){
                    if(this.PICTURES[i].getAttribute('src') == firstPic){ break;}      
                }
                alert(i + " " + firstPic);

                this.current = i;

                document.getElementById("largeImage").setAttribute('src', this.PICTURES[this.current].getAttribute('src'));
                alert(this.PICTURES[this.current].getAttribute('src'));
            }

            var imageGal = new ImageGallery();


           function stopEvent (ev) {
                // this ought to keep myModal from getting the click.
                ev.stopPropagation();
                }
    
            $('document').ready(function() {
                
                size_li = $("#myList li").length;
                 
                if(size_li <=9 ) $('#loadMore').hide();
                else $('#loadMore').show();
                 x=9;
                 $('#myList li:lt('+x+')').show();
                 $('#loadMore').click(function (e) {
                    e.preventDefault();
                 x= (x+9 <= size_li) ? x+9 : size_li;
                 if(x >= size_li) $('#loadMore').hide();
                 $('#myList li:lt('+x+')').show();
                 });
            });


                