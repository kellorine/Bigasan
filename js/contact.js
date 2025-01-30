// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Here you would typically send this data to a server
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();

    
});

//     // Example of sending data to a server (replace with your actual endpoint)
//     fetch('/submitContactForm', {
//         method: 'POST',
//         body: JSON.stringify({ name, email, message }),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert('Thank you for your message! We will get back to you soon.');
//         contactForm.reset();
//     })
//     .catch(error => {
//         alert('Something went wrong. Please try again later.');
//     });
// });
