var classbtn = $('.allclass>li'); //获取分类按钮
var bookbox = $(".allbook");
var bookmes= $(".allbook>li")

class Book {
    constructor({src, name}) {
      this.src = src;
      this.name = name;
      this.init();
    }
    init() {
        this.creatdom()
    }
    creatdom(){
        var li = document.createElement("li");
        li.innerHTML=
            `<div class="bookboxs">
                <img src="${this.src}"></img>
                <p>${this.name}</p>
            </div>`
        
        bookbox.append(li)
    }
}

function getinformation(){
    return new Promise((resolve,reject)=>{
        $.post("/api/getimg",{},(res)=>{
            // console.log(res.arr_img);
            for(let i = 0;i<res.arr_img.length;i++){
                // console.log(res.arr_img[i]);
                // console.log(res.arr_name[i]);
                // console.log(res.writer[i]);
                // console.log(res.introduce[i]);
                new Book({src:res.arr_img[i],name:res.arr_name[i]})
                
            }
        })
    })
}

classbtn.on('click',()=>{
    getinformation()
    
})