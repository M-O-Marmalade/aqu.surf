let isACardFlipped = false;
let flipCardUniqueIDCounter = 0;

const cardClass = "itemDiv";
const closeButtonClass = "closeCardButton";
const frontClass = "frontDiv";
const backClass = "backDiv";


document.querySelectorAll('.' + cardClass).forEach(item => {
    item.addEventListener('click', function(e) {        
        if (!this.id) {this.id = "flipCardUniqueID" + flipCardUniqueIDCounter++;}
        console.log(this.id + " clicked!");
        
        if (isACardFlipped) {return;}   //exit if a card is already flipped
        isACardFlipped = true;  //record that we have a card flipped

        const origRect = this.getBoundingClientRect();  //store the element's bounding rectangle before any changes are made

        const clone = this.cloneNode(true); //create and add the clone to be flipped
        clone.id = clone.id + "clone";
        clone.querySelector('.' + closeButtonClass).addEventListener('click', closeFlipCard);

        document.body.insertBefore(clone, document.body.firstChild);

        this.style.visibility = 'hidden';   //hide the original element
        
        clone.style.position = 'fixed'; //set the clone's starting position/size to be transitioned from
        clone.style.margin = '0px';
        clone.style.top = origRect.top + 'px';
        clone.style.left = origRect.left + 'px';
        clone.style.width = origRect.width + 'px';
        clone.style.height = origRect.height + 'px';


        requestAnimationFrame(function() {  //set the clone's ending position/size to be transitioned to on the next frame, so it will actually transition
            requestAnimationFrame(function() {
                clone.style.width = '90vw';
                clone.style.height = '80vh';
                clone.style.top = '10vh'
                clone.style.left = '5vw';
                clone.style.transform = 'rotateY(180deg)';
                clone.style.zIndex = '10';
                clone.querySelector('.' + frontClass).style.position = 'absolute';
                clone.querySelector('.' + backClass).style.position = 'static';
                clone.style.position = 'fixed';
            });
        });

    });
});

function closeFlipCard() {

    if (!isACardFlipped) {return;}
    isACardFlipped = false;

    //find .cardClass ancestor of this button
    let clone = this.parentElement;
    while (1) {
        if (clone.classList.contains(cardClass)) {
            break;
        }
        clone = clone.parentElement;
    }
    
    console.log(clone.id + "'s close button clicked!");
    console.log(clone.style.position);

    const origCard = document.getElementById(clone.id.slice( 0, -5 ));
    const container = origCard.parentElement;

    const cloneTop = clone.getBoundingClientRect().top;
    const cloneLeft = clone.getBoundingClientRect().left;
    const origTop = origCard.getBoundingClientRect().top;
    const origLeft = origCard.getBoundingClientRect().left;
    const origWidth = origCard.getBoundingClientRect().width;
    const origHeight = origCard.getBoundingClientRect().height;
    const containerTop = origCard.parentElement.getBoundingClientRect().top;
    const containerLeft = origCard.parentElement.getBoundingClientRect().left;

    clone.style.top = '0px';
    clone.style.left = '0px';
    clone.style.margin = (cloneTop - containerTop) + 'px 0px 0px ' + (cloneLeft - containerLeft) + 'px';
    clone.style.position = 'absolute';
    container.insertBefore(clone, container.firstChild);

    requestAnimationFrame(function() {  //set the clone's ending position/size to be transitioned to on the next frame, so it will actually transition
        requestAnimationFrame(function() {
            clone.style.width = origWidth + 'px';
            clone.style.height = origHeight + 'px';
            clone.style.margin = clone.style.margin = (origTop - containerTop) + 'px 0px 0px ' + (origLeft - containerLeft) + 'px';
            clone.style.transform = 'rotateY(0deg)';
            clone.addEventListener('transitionend', function() {
                origCard.style.visibility = 'visible';
                clone.remove();
            });
        });
    });
};
