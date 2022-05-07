document.querySelectorAll('.projectCard').forEach(card => {
    card.addEventListener('click', function handleClick(e) {
        const element = e.currentTarget;
        console.log(element.id + " projectCard clicked!")

        const eBoundRect = element.getBoundingClientRect();
        // these are relative to the viewport, i.e. the window
        console.log("top: " + eBoundRect.top);
        console.log("left: " + eBoundRect.left);
        console.log("width: " + eBoundRect.width);
        console.log("height: " + eBoundRect.height);


        const placeholderDiv = document.createElement("div");
        const newContent = document.createTextNode("hi there");
        placeholderDiv.appendChild(newContent);
        placeholderDiv.style.width = eBoundRect.width + 'px';
        placeholderDiv.style.height = eBoundRect.height + 'px';
        placeholderDiv.style.margin = 'clamp(5px, 25px, 25px)';
        document.getElementById("projects").insertBefore(placeholderDiv, element);

        element.style.position = 'fixed';
        element.style.top = eBoundRect.top + 'px';
        element.style.left = eBoundRect.left + 'px';
        element.style.width = eBoundRect.width + 'px';
        element.style.height = eBoundRect.height + 'px';
        element.style.transition = '1s';
        element.style.zIndex = 10;

        requestAnimationFrame(function() {
            element.classList.add("clicked");
            element.style.top = '5vh';
            element.style.left = '5vw';
            element.style.width = '90vw';
            element.style.height = '90vh';
            element.style.margin = '0px';
        });

    });
});









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