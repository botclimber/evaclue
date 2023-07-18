const date = require('date-and-time')

module.exports = class Locations {

  constructor(lat, lng, residence, reviews){
    this.lat = lat
    this.lng = lng
    this.residence = residence
    this.reviews = reviews // array of reviews
  }

  async transform(){

    if(this.reviews.length === 0) this.reviews = ""
    else{

      this.reviews = "<ul id='revContent"+(this.lat+this.lng)+"' class='list-group list-group-flush'>"+this.reviews.map(  comment => {
        const userImage = (comment.anonymous)? "default.gif" : comment.userImage
        const userName  = (comment.anonymous)? "Anonymous" : comment.userName
        
        const rev = (comment.review.length > 20)? "<p>&emsp;"+comment.review.substring(0,20) +"<span id=\"dots"+comment.id+"\">...</span><span style=\"display:none\" id=\"more"+comment.id+"\">"+comment.review.substring(20, comment.review.length)+"</span></p><a href=\"javascript:void(0)\" onclick=\"readMore("+comment.id+")\" id=\"readMore"+comment.id+"\">Read more</a>" :  "<p>&emsp;"+comment.review +"</p>"   

        return "<li class='list-group-item'>"
        +"<div class='row'>"
        +"<div class='col-md-12 resContent"+(this.lat+this.lng)+"'>"
        +(this.getResidenceForRev(comment.residenceId) || '')
        +"</div>"
        +"<div class='col-md-12'>"
        +"<img class='float-left p-2' style='border-radius: 30%;width:50px;height:50px' src='images/userImages/"+userImage+"'><p class='float-left' style='font-weight:normal;margin-top:16px'>"+userName+": </p>"
        +this.getStars(comment.rating)
        +"</div>"
        +"</div>"
        +"<div class='row'>"
        +"<div class='col-md-12'>"
        + rev
        +"</div>"
        +"<div class='col-md-12'>"
        +"<p class='float-right' style='font-size:9pt'>"+date.format(comment.createdOn, "DD/MM/YYYY - HH:mm")+"</p>"
        +"</div>"
        +"</div>"
        +"</li>"
      }
      ).join("")+"</ul>"
    }
  }

  getStars(rating){
    var starBuild = "<div class='wrapper float-right' style='margin-top:12px'>"
    
    var countdown = rating
    do{
      starBuild += "<label style='color:#ffbd00;font-size:8pt' for='st"+countdown+"'></label>"
      countdown -= 1
    }while(countdown > 0)
      
    starBuild += "</div>"

      return starBuild
  }

  getResidenceForRev(resId){

    for (let data of this.residence){
      
      if(data.id == resId && (data.floor != '' || data.direction != '')){
        return "<p>"+data.floor+" - "+data.direction+"</p>"
      }
    }
  }
}
