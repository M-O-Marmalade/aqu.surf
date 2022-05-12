document.querySelectorAll('.projectCard').forEach(card => {
    card.addEventListener('click', function handleClick(e) {
        const element = e.currentTarget;
        if (element.classList.contains('clicked')) {return;}
        const eBoundRect = element.getBoundingClientRect();

        const placeholderDiv = document.createElement("div");
        placeholderDiv.style.width = eBoundRect.width + 'px';
        placeholderDiv.style.height = eBoundRect.height + 'px';
        placeholderDiv.style.margin = '25px';
        document.getElementById("projects").insertBefore(placeholderDiv, element);

        element.style.position = 'fixed';
        element.style.top = eBoundRect.top + 'px';
        element.style.left = eBoundRect.left + 'px';
        // element.style.width = eBoundRect.width + 'px';
        // element.style.height = eBoundRect.height + 'px';
        // element.style.zIndex = 10;

        element.style.border = "1px solid red";

        requestAnimationFrame(function() {
            element.classList.add("clicked");
            element.style.top = '7.5vh';
            element.style.left = '10vw';
            element.style.width = '80vw';
            element.style.height = '80vh';
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