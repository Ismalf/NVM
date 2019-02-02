    /       @ismalfmp
            function findPlacesWithLife(){
                var placesWithLife = [];
                places.forEach(place =>{
                    /*Where there is love...*/
                    if(place.hasLove())
                        /*there is life...*/
                        placesWithLife.push(place);
                });
                return placesWithLife;
            }
//          - Mahatma Gandhi

