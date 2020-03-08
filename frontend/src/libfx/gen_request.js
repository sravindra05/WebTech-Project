function gen_request(type,url,port,data,callback){
    var object = {
        xhr: new XMLHttpRequest(),
        send: function(){
            this.xhr.open(type,url,true);
            this.xhr.onreadystatechange = callback;
            this.xhr.withCredentials=true;
            if (data == {}){
                this.xhr.send();
            }else{
                 this.xhr.send(data);
            }
           
        }
    }
    object.send();
}
export default gen_request;