// Initialize all popovers
document.addEventListener('DOMContentLoaded', function () {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        // Create a new popover instance with manual trigger
        const popover = new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'manual', // Control showing and hiding manually
        });

        // Toggle the popover on click
        popoverTriggerEl.addEventListener('click', function () {
            if (popoverTriggerEl.getAttribute('aria-describedby')) {
                // If popover is visible, hide it
                popover.hide();
            } else {
                // If popover is hidden, show it
                popover.show();

                // Add event listener for mouseleave on the popover and button
                const popoverElement = document.querySelector('.popover');

                const hideOnMouseLeave = (event) => {
                    if (
                        !popoverTriggerEl.contains(event.target) && 
                        (!popoverElement || !popoverElement.contains(event.target))
                    ) {
                        popover.hide();
                        document.removeEventListener('mousemove', hideOnMouseLeave);
                    }
                };

                // Attach a one-time mousemove listener to hide the popover
                document.addEventListener('mousemove', hideOnMouseLeave);
            }
        });
    });
});
