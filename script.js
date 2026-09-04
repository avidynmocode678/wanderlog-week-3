const tripForm = document.getElementById("tripForm");

const titleInput = document.getElementById("title");
const destinationInput = document.getElementById("destination");
const dateInput = document.getElementById("date");
const notesInput = document.getElementById("notes");
const imageInput = document.getElementById("image");

const imagePreview = document.getElementById("imagePreview");

const tripIdInput = document.getElementById("tripId");
const tripList = document.getElementById("tripList");
const emptyMessage = document.getElementById("emptyMessage");

const submitText = document.getElementById("submitText");
const cancelBtn = document.getElementById("cancelBtn");


// Get trips from localStorage

function getTrips() {
    return JSON.parse(localStorage.getItem("wanderlogTrips")) || [];
}


// Save trips to localStorage

function saveTrips(trips) {
    localStorage.setItem("wanderlogTrips", JSON.stringify(trips));
}


// IMAGE PREVIEW

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        imageInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        imagePreview.innerHTML = "";

        const img = document.createElement("img");
        img.src = event.target.result;
        img.alt = "Selected trip photo";

        imagePreview.appendChild(img);
    };

    reader.readAsDataURL(file);
});


// DISPLAY TRIPS

function displayTrips() {

    const trips = getTrips();

    tripList.innerHTML = "";

    if (trips.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";


    trips.forEach(function (trip) {

        const card = document.createElement("article");
        card.className = "trip-card";


        // IMAGE

        const image = document.createElement("img");
        image.className = "trip-image";

        image.src = trip.image || "https://via.placeholder.com/600x400?text=Wanderlog";

        image.alt = trip.title;

        image.onerror = function () {
            image.src =
                "https://via.placeholder.com/600x400?text=Image+Unavailable";
        };


        // CONTENT

        const content = document.createElement("div");
        content.className = "trip-content";


        const title = document.createElement("h3");
        title.textContent = trip.title;


        const destination = document.createElement("p");
        destination.className = "destination";
        destination.textContent = trip.destination;


        const date = document.createElement("p");
        date.className = "trip-date";
        date.textContent = trip.date;


        const notes = document.createElement("p");
        notes.className = "trip-notes";
        notes.textContent = trip.notes || "No notes added.";


        // BUTTONS

        const buttons = document.createElement("div");
        buttons.className = "card-buttons";


        const editButton = document.createElement("button");
        editButton.className = "edit";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editTrip(trip.id);
        });


        const deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteTrip(trip.id);
        });


        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);


        content.appendChild(title);
        content.appendChild(destination);
        content.appendChild(date);
        content.appendChild(notes);
        content.appendChild(buttons);

        card.appendChild(image);
        card.appendChild(content);

        tripList.appendChild(card);
    });
}


// ADD / EDIT TRIP

tripForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const trips = getTrips();

    const existingId = tripIdInput.value;

    const saveTrip = function (imageData) {

        if (existingId) {

            const index = trips.findIndex(function (trip) {
                return trip.id == existingId;
            });

            if (index !== -1) {

                trips[index].title = titleInput.value;
                trips[index].destination = destinationInput.value;
                trips[index].date = dateInput.value;
                trips[index].notes = notesInput.value;

                // Only replace image if a new image was selected
                if (imageData) {
                    trips[index].image = imageData;
                }
            }

        } else {

            const newTrip = {
                id: Date.now(),
                title: titleInput.value,
                destination: destinationInput.value,
                date: dateInput.value,
                notes: notesInput.value,
                image: imageData || ""
            };

            trips.push(newTrip);
        }


        saveTrips(trips);

        displayTrips();

        resetForm();
    };


    // New image selected

    if (imageInput.files[0]) {

        const reader = new FileReader();

        reader.onload = function (event) {
            saveTrip(event.target.result);
        };

        reader.readAsDataURL(imageInput.files[0]);

    } else {

        // Existing image / no image
        saveTrip(null);
    }

});


// EDIT

function editTrip(id) {

    const trips = getTrips();

    const trip = trips.find(function (item) {
        return item.id == id;
    });

    if (!trip) {
        return;
    }

    tripIdInput.value = trip.id;

    titleInput.value = trip.title;
    destinationInput.value = trip.destination;
    dateInput.value = trip.date;
    notesInput.value = trip.notes;


    if (trip.image) {

        imagePreview.innerHTML = "";

        const img = document.createElement("img");
        img.src = trip.image;
        img.alt = "Current trip photo";

        imagePreview.appendChild(img);

    } else {

        imagePreview.innerHTML =
            "<span>No photo selected</span>";
    }


    submitText.textContent = "Update Trip";

    cancelBtn.style.display = "inline-block";

    document.getElementById("add-trip").scrollIntoView({
        behavior: "smooth"
    });
}


// DELETE

function deleteTrip(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this trip?"
    );

    if (!confirmed) {
        return;
    }

    let trips = getTrips();

    trips = trips.filter(function (trip) {
        return trip.id != id;
    });

    saveTrips(trips);

    displayTrips();
}


// CANCEL EDIT

cancelBtn.addEventListener("click", function () {
    resetForm();
});


// RESET FORM

function resetForm() {

    tripForm.reset();

    tripIdInput.value = "";

    submitText.textContent = "Save Trip";

    cancelBtn.style.display = "none";

    imagePreview.innerHTML =
        "<span>Photo preview will appear here</span>";
}


// LOAD TRIPS WHEN PAGE OPENS

displayTrips();