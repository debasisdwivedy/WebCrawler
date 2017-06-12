var method=Set.prototype;


function Set() {
    this.arr=[];
}
method.addObj=function (obj) {
    if(!this.contains(obj))
    {
        this.arr.push(obj)
        return true;
    }
    return false;

}

method.contains=function (obj) {
    for(var i=0;i<this.arr.length;i++)
    {
        if(obj==this.arr[i])
        {
            return true;
        }
    }
    return false;
}

method.deleteObj=function (obj)
{
    var i=0;
    this.arr.forEach((function(element)
    {
        if(obj==element)
        {
            this.arr.splice(i,1);
        }
        i += 1;
    }).bind(this));
}

method.details=function ()
{
    return this.arr;
}

module.exports = Set;
