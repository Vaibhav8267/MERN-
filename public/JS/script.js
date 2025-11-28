// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

  const bookBtn = document.querySelector(".book-btn");
  const popupOverlay = document.getElementById("popupOverlay");
  const closePopup = document.getElementById("closePopup");

  // Open popup on Book click
  bookBtn.addEventListener("click", (e) => {
    e.preventDefault(); // stop form submission
    popupOverlay.style.display = "flex";
  });

  // Close popup on X
  closePopup.onclick = () => {
    popupOverlay.style.display = "none";
  };

  // Close when clicking outside popup
  popupOverlay.onclick = (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  };
