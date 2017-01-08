function fixImage(image){
    if (image){
        function findExtIndex(word){
           var ext = ['.jpg','.jpeg','.png','.gif'];
           var returnIndex = null;
           ext.some(function(element){
             var index = word.indexOf(element);
             if (index > -1){
               returnIndex = index;
               return
             }
           })
           if (returnIndex){
             return returnIndex
           } else {
             return null;
           }

        }

        var num = findExtIndex(image)
        if (num > -1){
          image = [image.slice(0,num), "_medium", image.slice(num)].join('');
          return image
        }

      }
      else{
        image = null;
        return image
      }
}

module.exports = fixImage
