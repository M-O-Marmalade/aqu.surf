//TODO
//keep track of which element is currently flipped, and allow it to transition back to its original state when a button on the backside is clicked
//only allow one element to be flipped at a time

document.querySelectorAll('.itemDiv').forEach(item => {
    item.addEventListener('click', function handleClick(e) {
        if (e.currentTarget.classList.contains('clicked')) {return;}
        
        const elem = e.currentTarget;
        const elemRect = elem.getBoundingClientRect();  //store the element's bounding rectangle before any changes are made

        const clone = elem.cloneNode(true); //create and add the clone to be flipped
        document.body.after(clone);

        elem.style.visibility = 'hidden';   //hide the original element
        
        clone.style.position = "fixed"; //set the clone's starting position/size to be transitioned from
        clone.style.margin = '0px';
        clone.style.top = elemRect.top + 'px';
        clone.style.left = elemRect.left + 'px';
        clone.style.width = elemRect.width + 'px';
        clone.style.height = elemRect.height + 'px';


        requestAnimationFrame(function() {  //set the clone's ending position/size to be transitioned to on the next frame, so it will actually transition
            clone.style.width = '90vw';
            clone.style.height = '90vh';
            clone.style.top = '5vh'
            clone.style.left = '5vw';
            clone.classList.add("clicked");            
        });

    });
});