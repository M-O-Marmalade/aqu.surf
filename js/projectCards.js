let isACardFlipped = false;
let flipCardUniqueIDCounter = 0;

const cardClass = "projectCard";
const closeButtonClass = "closeCardButton";
const frontClass = "projectCardFront";
const backClass = "projectCardBack";


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
                clone.style.height = '90vh';
                clone.style.top = '5vh'
                clone.style.left = '5vw';
                clone.style.transform = 'rotateY(180deg) translateZ(-43px)';
                clone.style.zIndex = 10;
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









// This is the important part!

// function collapseSection(element) {
//     // get the height of the element's inner content, regardless of its actual size
//     var sectionHeight = element.scrollHeight;
    
//     // temporarily disable all css transitions
//     var elementTransition = element.style.transition;
//     element.style.transition = '';
    
//     // on the next frame (as soon as the previous style change has taken effect),
//     // explicitly set the element's height to its current pixel height, so we 
//     // aren't transitioning out of 'auto'
//     requestAnimationFrame(function() {
//       element.style.height = sectionHeight + 'px';
//       element.style.transition = elementTransition;
      
//       // on the next frame (as soon as the previous style change has taken effect),
//       // have the element transition to height: 0
//       requestAnimationFrame(function() {
//         element.style.height = 0 + 'px';
//       });
//     });
    
//     // mark the section as "currently collapsed"
//     element.setAttribute('data-collapsed', 'true');
//   }
  
//   function expandSection(element) {
//     // get the height of the element's inner content, regardless of its actual size
//     var sectionHeight = element.scrollHeight;
    
//     // have the element transition to the height of its inner content
//     element.style.height = sectionHeight + 'px';
  
//     // when the next css transition finishes (which should be the one we just triggered)
//     element.addEventListener('transitionend', function(e) {
//       // remove this event listener so it only gets triggered once
//       element.removeEventListener('transitionend', arguments.callee);
      
//       // remove "height" from the element's inline styles, so it can return to its initial value
//       element.style.height = null;
//     });
    
//     // mark the section as "currently not collapsed"
//     element.setAttribute('data-collapsed', 'false');
//   }
  
//   document.querySelector('#toggle-button').addEventListener('click', function(e) {
//     var section = document.querySelector('.section.collapsible');
//     var isCollapsed = section.getAttribute('data-collapsed') === 'true';
      
//     if(isCollapsed) {
//       expandSection(section)
//       section.setAttribute('data-collapsed', 'false')
//     } else {
//       collapseSection(section)
//     }
//   });