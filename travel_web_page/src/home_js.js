document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    // Initialize Materialize components
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems);

    // Show the home section by default
    sections[0].classList.add('active');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            // Remove active class from all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Get the target section ID
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Add active class to the target section
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});
