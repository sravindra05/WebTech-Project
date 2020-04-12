function gen_request(type,url,port,data,callback){
    var delay = 2000;
    var object = {
        xhr: new XMLHttpRequest(),
        send: function(){
            this.xhr.open(type,url,true);
            this.xhr.onreadystatechange = callback;
            this.xhr.withCredentials=true;
            this.xhr.timeout = delay;
            this.xhr.ontimeout = this.backoff;
            if (data == {}){
                this.xhr.send();
            }else{
                 this.xhr.send(data);
            }
        },
        backoff: function(){
            delay = delay*2;
            object.send();
        }
    }
    object.send();
}
export default gen_request;