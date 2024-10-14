document.addEventListener('DOMContentLoaded', () => {
    const randomCarList = document.querySelector('.car-list'); // Section for displaying 3 random cars (only for home.html)
    const carList = document.getElementById('carList');// Section for displaying all cars (for cars.html)
     const brandFilter = document.getElementById('brandFilter');
    const yearFilter = document.getElementById('yearFilter');
    const searchInput = document.getElementById('searchInput');
    const kmFilter = document.getElementById('kmFilter');
    const engineFilter = document.getElementById('engineFilter');
    

    let cars = []; // Αποθήκευση των αυτοκινήτων από το JSON

   
    
    
    // Φόρτωση δεδομένων από το cars.json
    fetch('cars.json')
        .then(response => response.json())
        .then(data => {
            cars = data; // Αποθήκευση των αυτοκινήτων στον πίνακα
            if (window.location.pathname.endsWith('home.html')) {
                displayRandomCars(); // Εμφάνιση τυχαίων αυτοκινήτων στην αρχική σελίδα
            } else if (window.location.pathname.endsWith('cars.html')) {
              
                displayCars(cars); // Εμφάνιση όλων των αυτοκινήτων στη σελίδα cars.html
                initializeFilters(); // Ενεργοποίηση φίλτρων

            }
        })
        .catch(error => console.error('Σφάλμα στη φόρτωση των δεδομένων:', error));






    // Συνάρτηση για την αρχικοποίηση των φίλτρων
function initializeFilters() {
    // Εφαρμογή φίλτρων και αναζήτησης όταν αλλάζει κάτι στα φίλτρα ή στο input αναζήτησης
    brandFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    kmFilter.addEventListener('change', applyFilters); // Φίλτρο χιλιομέτρων
    engineFilter.addEventListener('change', applyFilters); // Φίλτρο κυβικών
    searchInput.addEventListener('input', applyFilters);
}
function applyFilters() {
    const selectedBrand = brandFilter.value.toLowerCase(); // Μετατροπή σε πεζά
    const selectedYear = yearFilter.value;
    const selectedKm = kmFilter.value; // Φίλτρο χιλιομέτρων
    const selectedEngine = engineFilter.value; // Φίλτρο κυβικών
    const searchTerm = searchInput.value.toLowerCase();

    const filteredCars = cars.filter(car => {
        // Έλεγχος αν το όνομα περιέχει τη μάρκα (αφού δεν υπάρχει πεδίο brand)
        const matchBrand = selectedBrand === "" || car.name.toLowerCase().includes(selectedBrand);

        // Φιλτράρισμα ανά έτος
        const matchYear = selectedYear === "" || car.year.toString() === selectedYear;

        // Φιλτράρισμα ανά χιλιόμετρα - Αφαίρεση κόμματων και μετατροπή σε ακέραιο
        const carKm = parseInt(car.km.replace(/,/g, ''));
        const matchKm = selectedKm === "" || carKm <= parseInt(selectedKm);

        // Φιλτράρισμα ανά κυβικά (κινητήρας) - Απλή σύγκριση ως αριθμός ακέραιος (π.χ. 1500)
        const carEngine = parseInt(car.engine); // Χωρίς "L", π.χ. 1500
        const matchEngine = selectedEngine === "" || carEngine <= parseInt(selectedEngine);

        // Αναζήτηση με βάση το όνομα του αυτοκινήτου
        const matchSearch = car.name.toLowerCase().includes(searchTerm);

        // Το αυτοκίνητο πρέπει να ταιριάζει με όλα τα κριτήρια
        return matchBrand && matchYear && matchKm && matchEngine && matchSearch;
    });

    displayCars(filteredCars); // Εμφάνιση των φιλτραρισμένων αυτοκινήτων
}

function displayCars(cars) {
    if (!carList) return; // Αποφυγή σφάλματος αν carList δεν υπάρχει
    carList.innerHTML = ''; // Καθαρισμός λίστας

    if (cars.length === 0) {
        // Προσθήκη κλάσης empty αν δεν υπάρχουν αυτοκίνητα
        carList.classList.add('empty');
        return; // Έξοδος από τη συνάρτηση
    } else {
        // Αφαίρεση κλάσης empty αν υπάρχουν αυτοκίνητα
        carList.classList.remove('empty');
    }

    cars.forEach(car => {
        const carDiv = document.createElement('div');
        carDiv.classList.add('car');
        carDiv.setAttribute('data-brand', car.brand);
        carDiv.setAttribute('data-year', car.year);
        carDiv.setAttribute('data-images', JSON.stringify(car.images));
        // Πρόσθεσε τα νέα χαρακτηριστικά
        carDiv.setAttribute('data-fuel-consumption', car.fuelConsumption);
        carDiv.setAttribute('data-horse-power', car.horsePower);
        carDiv.setAttribute('data-acceleration', car.acceleration);
        carDiv.innerHTML = `
            <img src="${car.images[0]}" alt="${car.name}">
            <h3>${car.name}</h3>
            <p>Έτος: ${car.year}</p>
            <p>Χιλιόμετρα: ${car.km}</p>
            <p>Κινητήρας: ${car.engine} cc</p>
            <p class="price">Τιμή: ${car.price}</p>
            <button onclick="viewDetails(this)">Περισσότερα</button>
        `;

        carList.appendChild(carDiv);
    });
}


    // Συνάρτηση για εμφάνιση 3 τυχαίων αυτοκινήτων στην home.html
function getRandomCars(cars, count) {
     const shuffled = cars.sort(() => 0.5 - Math.random()); // Shuffle the cars array
     return shuffled.slice(0, count); // Get the first 'count' cars
    }
// Συνάρτηση για εμφάνιση 3 τυχαίων αυτοκινήτων στην home.html
function displayRandomCars() {
    if (!randomCarList) return; // Αν δεν υπάρχει το section για τα τυχαία αμάξια, δεν κάνουμε τίποτα
    const randomCars = getRandomCars(cars, 3); // Get three random cars
    
    randomCarList.innerHTML = ''; // Clear previous entries
    
    randomCars.forEach(car => {
        const carDiv = document.createElement('div');
        carDiv.classList.add('car');

        // Ορισμός των δεδομένων, συμπεριλαμβανομένου του έτους στο data-year attribute
        carDiv.setAttribute('data-year', car.year); // Εδώ αποθηκεύουμε το έτος
        carDiv.setAttribute('data-images', JSON.stringify(car.images)); // Αποθήκευση εικόνων

        carDiv.innerHTML = `
            <img src="${car.images[0]}" alt="${car.name}">
            <h3>${car.name}</h3>
            <p>Έτος: ${car.year}</p>
            <p>Χιλιόμετρα: ${car.km}</p>
            <p>Κινητήρας: ${car.engine}</p>
            <p class="price">Τιμή: ${car.price}</p>
            <button onclick="viewDetails(this)">Περισσότερα</button>
        `;

        randomCarList.appendChild(carDiv);
    });
}

window.viewDetails = function(button) {
    const car = button.closest('.car');
    const images = JSON.parse(car.getAttribute('data-images')); // Ανάκτηση των εικόνων από το data-images attribute

    if (images && images.length > 0) {
        const carData = {
            name: car.getElementsByTagName('h3')[0].innerText,
            year: car.getAttribute('data-year'), // Ανακτάμε το έτος από το data-year
            km: car.getElementsByTagName('p')[1].innerText.split(': ')[1],
            engine: car.getElementsByTagName('p')[2].innerText.split(': ')[1],
            price: car.getElementsByTagName('p')[3].innerText.split(': ')[1],
            image: images[0], // Κύρια εικόνα
            images: images,    // Όλες οι εικόνες
            fuelConsumption: car.getAttribute('data-fuel-consumption'), // Νέα προσθήκη
            horsePower: car.getAttribute('data-horse-power'),           // Νέα προσθήκη
            acceleration: car.getAttribute('data-acceleration')         // Νέα προσθήκη
        };

        // Αποθήκευση δεδομένων στο localStorage για χρήση στη car.html
        localStorage.setItem('selectedCar', JSON.stringify(carData));
        window.location.href = 'car.html'; // Ανακατεύθυνση στη σελίδα λεπτομερειών
    } else {
        alert("Δεν υπάρχουν διαθέσιμες εικόνες για το συγκεκριμένο αυτοκίνητο.");
    }
};

    // Συνάρτηση εμφάνισης δεδομένων στη σελίδα car.html
    if (window.location.pathname.endsWith("car.html")) {
        const carData = JSON.parse(localStorage.getItem('selectedCar'));
        if (carData) {
            displayCar(carData); // Εμφάνιση των λεπτομερειών του αυτοκινήτου
        } else {
            alert('Δεν βρέθηκαν δεδομένα για το αυτοκίνητο.');
        }
    }
function displayCar(carData) {
    document.getElementById('mainImage').src = carData.image;
    document.getElementById('carName').textContent = carData.name;
    document.getElementById('carYear').textContent = ` ${carData.year}`;
    document.getElementById('carKm').textContent = ` ${carData.km}`;
    document.getElementById('carEngine').textContent = ` ${carData.engine}`;
    document.getElementById('carPrice').textContent = ` ${carData.price}`;

    // Νέα χαρακτηριστικά
    document.getElementById('carFuelConsumption').textContent = `${carData.fuelConsumption}`;
    document.getElementById('carHorsePower').textContent = `${carData.horsePower}`;
    document.getElementById('carAcceleration').textContent = `${carData.acceleration}`;

    // Carousel
    const imageCarousel = document.getElementById('imageCarousel');
    imageCarousel.innerHTML = ''; // Καθαρισμός προηγούμενων εικόνων
    carData.images.forEach(image => {
        const thumbImg = document.createElement('img');
        thumbImg.src = image;
        thumbImg.alt = "Εικόνα του αυτοκινήτου";
        thumbImg.classList.add('thumb');
        thumbImg.onclick = () => changeImage(thumbImg); // Αλλαγή εικόνας όταν κάνεις κλικ
        imageCarousel.appendChild(thumbImg);
    });
}

function changeImage(element) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = element.src;
}

});
