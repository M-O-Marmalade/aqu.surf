document.querySelectorAll('.itemDiv').forEach(div => {
    div.addEventListener('click', function handleClick(e) {
        const element = e.currentTarget;

        if (element.classList.contains('clicked')) {return;}

        const eBoundRect = element.getBoundingClientRect();

        const placeholderDiv = document.createElement("div");
        placeholderDiv.style.width = eBoundRect.width + 'px';
        placeholderDiv.style.height = eBoundRect.height + 'px';
        placeholderDiv.style.margin = '25px';
        document.getElementById("flexDiv").insertBefore(placeholderDiv, element);

        element.style.position = 'fixed';
        element.style.top = eBoundRect.top + 'px';
        element.style.left = eBoundRect.left + 'px';
        element.style.width = eBoundRect.width + 'px';
        element.style.height = eBoundRect.height + 'px';
        element.style.transition = '0.75s';
        element.style.zIndex = 10;

        element.style.border = "1px solid black";

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