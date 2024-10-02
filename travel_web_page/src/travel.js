
        let map;
        let markers = [];
        let routePolylines = [];

        // Initialize the map
        document.addEventListener('DOMContentLoaded', function() {
            map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Initialize trip type UI
            toggleTripType();
        });

        // Function to toggle trip type and adjust input fields
        function toggleTripType() {
            const tripType = document.querySelector('input[name="tripType"]:checked').value;
            const addBtn = document.getElementById('add-destination-btn');
            const destinationFields = document.getElementById('destination-fields');
            const additionalDates = document.getElementById('additional-dates');

            if (tripType === 'multi-city') {
                addBtn.style.display = 'block';
                additionalDates.innerHTML = '';
                // Show date for each destination
                document.querySelectorAll('.destination-date').forEach(input => {
                    input.placeholder = "Enter date";
                    input.classList.remove('hidden');
                });
            } else if (tripType === 'round-trip') {
                addBtn.style.display = 'none';
                destinationFields.innerHTML = `
                    <div class="destination-segment relative">
                        <input type="text" class="destination-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="Enter destination">
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                            <input type="date" class="departure-date w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                `;
                // Add return date field
                additionalDates.innerHTML = `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                        <input type="date" id="return-date" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="Enter return date">
                    </div>
                `;
            } else { // one-way
                addBtn.style.display = 'none';
                destinationFields.innerHTML = `
                    <div class="destination-segment relative">
                        <input type="text" class="destination-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="Enter destination">
                        <div class="mt-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                            <input type="date" class="travel-date w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                `;
                additionalDates.innerHTML = '';
            }

            // Show or hide remove buttons based on trip type
            const segments = destinationFields.querySelectorAll('.destination-segment');
            segments.forEach(segment => {
                const removeBtn = segment.querySelector('button');
                if (tripType === 'multi-city') {
                    if (removeBtn) removeBtn.classList.remove('hidden');
                } else {
                    if (removeBtn) removeBtn.classList.add('hidden');
                }
            });
        }

        function addDestinationField() {
            const destinationFields = document.getElementById('destination-fields');
            const currentSegments = destinationFields.querySelectorAll('.destination-segment').length;
            const maxSegments = 5;

            if (currentSegments >= maxSegments) {
                alert(`You can add up to ${maxSegments} destinations.`);
                return;
            }

            const newSegment = document.createElement('div');
            newSegment.className = 'destination-segment relative';
            newSegment.innerHTML = `
                <input type="text" class="destination-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter destination">
                <div class="mt-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" class="destination-date w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="button" class="absolute top-0 right-0 mt-2 mr-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition duration-200" onclick="removeDestinationField(this)">
                    &times;
                </button>
            `;
            destinationFields.appendChild(newSegment);
        }

        function removeDestinationField(button) {
            button.parentElement.remove();
        }

    async function displayRoute() {
    const tripType = document.querySelector('input[name="tripType"]:checked').value;
    const source = document.getElementById('source').value.trim();
    clearMap();

    if (!source) {
        alert('Please enter the source location.');
        return;
    }

    // Show loading state
    document.getElementById('route-info').classList.remove('hidden');
    document.getElementById('travel-options').classList.remove('hidden');
    showLoadingState();

    try {
        // Collect destinations and dates
        const destinationInputs = document.querySelectorAll('.destination-input');
        let destinations = Array.from(destinationInputs).map(input => input.value.trim());
        let dates = [];
        let retDate = null;

        if (tripType === 'one-way') {
            dates = [document.querySelector('.travel-date').value];
        } else if (tripType === 'round-trip') {
            dates = [document.querySelector('.departure-date').value];
            retDate = document.getElementById('return-date').value;
        } else { // multi-city
            dates = Array.from(document.querySelectorAll('.destination-date')).map(input => input.value);
        }

        // Get travel mode
        const travelMode = document.querySelector('input[name="travelMode"]:checked').value;

        // Validate input
        if (!validateTrip(tripType, destinations, dates, retDate)) return;

        // Get coordinates
        const allLocations = [source, ...destinations];
        if (tripType === 'round-trip') {
            allLocations.push(source); // Return to source
        }
        const routePoints = await getRouteCoordinates(allLocations);
        if (!routePoints.length) {
            throw new Error('Could not find coordinates for one or more locations');
        }

        // Draw route on map
        drawRouteOnMap(routePoints, tripType);

        // Calculate route details
        const routeDetails = calculateRouteDetails(routePoints, tripType, travelMode);

        // Update route display
        updateRouteDisplay(routeDetails, source, destinations, dates, retDate, travelMode, tripType);

    } catch (error) {
        document.getElementById('route-details').innerHTML = `
            <div class="text-red-600">
                Error calculating route: ${error.message}
            </div>
        `;
        document.getElementById('distance').textContent = '-';
        document.getElementById('estimated-time').textContent = '-';
        document.getElementById('travel-options').classList.add('hidden');
    }
}

        function clearMap() {
            markers.forEach(marker => map.removeLayer(marker));
            routePolylines.forEach(line => map.removeLayer(line));
            markers = [];
            routePolylines = [];
        }

        async function getRouteCoordinates(locations) {
            const coordinates = [];
            for (const location of locations) {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
                    const data = await response.json();
                    if (data.length > 0) {
                        coordinates.push([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    } else {
                        throw new Error(`Location not found: ${location}`);
                    }
                } catch (error) {
                    console.error(`Error fetching coordinates for ${location}:`, error);
                    throw error;
                }
            }
            return coordinates;
        }

        function drawRouteOnMap(coordinates, tripType) {
    if (coordinates.length < 2) return; // Ensure there are at least 2 points to connect

    // Fit map to show all points with padding for better visibility
    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds.pad(0.1));

    // Clear previous markers and polylines if any
    markers.forEach(marker => map.removeLayer(marker));
    routePolylines.forEach(polyline => map.removeLayer(polyline));
    
    markers = [];
    routePolylines = [];

    // Add markers for each point with a custom icon
    coordinates.forEach((coord, index) => {
        const marker = L.marker(coord, { 
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/Leaflet/Leaflet/master/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            })
        }).addTo(map);
        markers.push(marker);
    });

    // Function to generate semi-circle points that connect start and end
    function generateSemiCircle(start, end, numPoints = 50) {
        const latlngs = [];

        // Midpoint between the two locations
        const latMid = (start[0] + end[0]) / 2;
        const lngMid = (start[1] + end[1]) / 2;

        // Calculate the angle and radius for the semi-circle arc
        const offset = 0.1; // Arc height (adjust this value to change the curve)
        const midPoint = [(latMid + offset), lngMid]; // Adjust to create a vertical curve

        // Calculate the step for the interpolation (for smooth arc)
        for (let t = 0; t <= 1; t += 1 / numPoints) {
            const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * midPoint[0] + t * t * end[0];
            const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * midPoint[1] + t * t * end[1];
            latlngs.push([lat, lng]);
        }

        return latlngs;
    }

    // Draw routes based on trip type
    if (tripType === 'multi-city') {
        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];
            const semiCircleCoords = generateSemiCircle(start, end);

            const polyline = L.polyline(semiCircleCoords, {
                color: 'blue',
                weight: 4,
                dashArray: '10, 10', // Dotted line style
                opacity: 0.8,
                className: 'animated-route'
            }).addTo(map);

            routePolylines.push(polyline);
        }
    } else {
        // Connect source and destination directly for one-way
        const start = coordinates[0];
        const end = coordinates[coordinates.length - 1];

        // Draw direct connection for one-way trips
        const routePolyline = L.polyline([start, end], {
            color: 'blue',
            weight: 4,
            opacity: 0.8,
            className: 'animated-route'
        }).addTo(map);
        routePolylines.push(routePolyline);
    }

    // Apply animation to the polyline with CSS
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .animated-route {
            stroke-dasharray: 10, 10;
            animation: dash 2s linear infinite; /* Speed of the animation */
        }
        @keyframes dash {
            to {
                stroke-dashoffset: -20; /* Adjust to increase speed */
            }
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
}



        function calculateRouteDetails(coordinates, tripType, travelMode) {
            let totalDistance = 0;
            let segments = [];

            for (let i = 0; i < coordinates.length - 1; i++) {
                const distance = calculateDistance(coordinates[i], coordinates[i + 1]);
                totalDistance += distance;
                segments.push({
                    distance: distance,
                    time: calculateTravelTime(distance, travelMode)
                });
            }

            if (tripType === 'round-trip') {
                // The last segment is return to source
                const returnDistance = calculateDistance(coordinates[coordinates.length -1], coordinates[0]);
                totalDistance += returnDistance;
                segments.push({
                    distance: returnDistance,
                    time: calculateTravelTime(returnDistance, travelMode)
                });
            }

            return {
                segments: segments,
                totalDistance: totalDistance
            };
        }

        function calculateDistance(coord1, coord2) {
            const R = 6371; // Radius of Earth in kilometers
            const lat1 = coord1[0] * Math.PI / 180;
            const lat2 = coord2[0] * Math.PI / 180;
            const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
            const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;

            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1) * Math.cos(lat2) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        function calculateTravelTime(distance, travelMode) {
            let speed;
            switch(travelMode) {
                case 'car':
                    speed = 60; // km/h
                    break;
                case 'bus':
                    speed = 40; // km/h
                    break;
                case 'train':
                    speed = 80; // km/h
                    break;
                case 'plane':
                    speed = 600; // km/h
                    break;
                default:
                    speed = 60;
            }

            const timeInHours = distance / speed;
            const hours = Math.floor(timeInHours);
            const minutes = Math.round((timeInHours - hours) * 60);

            return `${hours}h ${minutes}m`;
        }

        function calculateTravelCost(distance, travelMode) {
            let ratePerKm;
            switch(travelMode) {
                case 'car':
                    ratePerKm = 10; // INR
                    break;
                case 'bus':
                    ratePerKm = 5; // INR
                    break;
                case 'train':
                    ratePerKm = 8; // INR
                    break;
                case 'plane':
                    ratePerKm = 20; // INR
                    break;
                default:
                    ratePerKm = 10;
            }

            return `₹${distance * ratePerKm}`;
        }

        function updateRouteDisplay(routeDetails, source, destinations, dates, retDate, travelMode, tripType) {
            const routeDetailsDiv = document.getElementById('route-details');
            const distanceSpan = document.getElementById('distance');
            const timeSpan = document.getElementById('estimated-time');
            const optionsList = document.getElementById('options-list');
            const travelOptionsContainer = document.getElementById('travel-options-list'); // Make sure this matches your HTML
        
            let html = `<div class="space-y-4">
                <h3 class="text-xl font-semibold mb-2">Trip Summary</h3>`;
        
            // Calculate total distance and time based on travel mode
            let totalTime = 0;
            routeDetails.segments.forEach(segment => {
                // Parse time string to add to totalTime
                const [hours, minutes] = segment.time.split('h').map(s => parseInt(s));
                totalTime += hours + (isNaN(minutes) ? 0 : minutes / 60);
            });
        
            // Display each segment
            routeDetails.segments.forEach((segment, index) => {
                const fromLocation = index === 0 ? source : destinations[index - 1];
                const toLocation = destinations[index] || (tripType === 'round-trip' ? source : null);
                const date = dates[index] || retDate || 'N/A';
                if (toLocation) {
                    html += `
                        <div class="bg-gray-100 p-4 rounded-lg">
                            <p class="font-semibold">${fromLocation} → ${toLocation}</p>
                            <p>Date: ${date}</p>
                            <p>Distance: ${segment.distance.toFixed(1)} km</p>
                            <p>Travel Mode: ${capitalizeFirstLetter(travelMode)}</p>
                            <p>Estimated Time: ${segment.time}</p>
                            <button class="book-now-button mt-2 px-4 py-2 bg-blue-600 text-white rounded"  
        onclick="redirectToPayment(event)">Book Now</button>

                        </div>
                    `;
                }
            });
        
            // Total trip summary
            html += `
                <div class="mt-4 p-4 bg-blue-100 rounded-lg">
                    <h4 class="font-bold mb-2">Total Trip Summary</h4>
                    <p><strong>Total Distance:</strong> ${routeDetails.totalDistance.toFixed(1)} km</p>
                    <p><strong>Total Estimated Time:</strong> ${formatTotalTime(totalTime)}</p>
                </div>
            </div>`;
        
            routeDetailsDiv.innerHTML = html;
            distanceSpan.textContent = `${routeDetails.totalDistance.toFixed(1)} km`;
            timeSpan.textContent = formatTotalTime(totalTime);
        
            // Display travel options based on travel mode
            displayTravelOptions(routeDetails.totalDistance, travelMode);
        }

        function redirectToPayment(event) { 
            event.preventDefault(); // Prevent any default action 
            console.log("Redirecting to payment page..."); // Debug line
            window.location.href = './payment.html'; // Redirect to payment.html 
        }
        
        

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function formatTotalTime(totalTime) {
            const hours = Math.floor(totalTime);
            const minutes = Math.round((totalTime - hours) * 60);
            return `${hours}h ${minutes}m`;
        }

        function displayTravelOptions(distance, travelMode) {
            const optionsList = document.getElementById('options-list');
            optionsList.innerHTML = '';

            // Define travel options based on travel mode
            let travelOptionsData = [];

            switch(travelMode) {
                case 'car':
                    travelOptionsData = [
                        {
                            mode: 'Express Car',
                            time: calculateTravelTime(distance, 'car'),
                            price: calculateTravelCost(distance, 'car'),
                            icon: 'fa-car'
                        },
                        {
                            mode: 'Luxury Car',
                            time: calculateTravelTime(distance, 'car') - 0.5 + 'h', // Faster option
                            price: `₹${distance * 15}`, // Higher cost
                            icon: 'fa-car'
                        }
                    ];
                    break;
                case 'bus':
                    travelOptionsData = [
                        {
                            mode: 'Regular Bus',
                            time: calculateTravelTime(distance, 'bus'),
                            price: calculateTravelCost(distance, 'bus'),
                            icon: 'fa-bus'
                        },
                        {
                            mode: 'Express Bus',
                            time: calculateTravelTime(distance, 'bus') - 1 + 'h', // Faster option
                            price: `₹${distance * 7}`, // Slightly higher cost
                            icon: 'fa-bus'
                        }
                    ];
                    break;
                case 'train':
                    travelOptionsData = [
                        {
                            mode: 'Sleeper Train',
                            time: calculateTravelTime(distance, 'train'),
                            price: calculateTravelCost(distance, 'train'),
                            icon: 'fa-train'
                        },
                        {
                            mode: 'AC Train',
                            time: calculateTravelTime(distance, 'train') - 0.5 + 'h', // Faster option
                            price: `₹${distance * 10}`, // Higher cost
                            icon: 'fa-train'
                        }
                    ];
                    break;
                case 'plane':
                    travelOptionsData = [
                        {
                            mode: 'Economy Flight',
                            time: calculateTravelTime(distance, 'plane'),
                            price: calculateTravelCost(distance, 'plane'),
                            icon: 'fa-plane'
                        },
                        {
                            mode: 'Business Flight',
                            time: calculateTravelTime(distance, 'plane') - 0.5 + 'h', // Faster option
                            price: `₹${distance * 25}`, // Higher cost
                            icon: 'fa-plane'
                        }
                    ];
                    break;
                default:
                    travelOptionsData = [];
            }

            // Populate travel options
            travelOptionsData.forEach(option => {
                optionsList.innerHTML += `
                    <li class="border-b pb-4 flex flex-col sm:flex-row justify-between items-center">
                        <div class="flex items-center space-x-3">
                            <i class="fas ${option.icon} text-blue-600 text-2xl"></i>
                            <div>
                                <h3 class="text-lg font-semibold">${option.mode}</h3>
                                <p class="text-gray-600">Time: ${option.time}</p>
                                <p class="text-gray-600">Price: ${option.price}</p>
                            </div>
                        </div>
                        <button class="book-now-button mt-2 px-4 py-2 bg-blue-600 text-white rounded"  
        onclick="redirectToPayment(event)">Book Now</button>
                    </li>
                `;
            });
        }

        function showLoadingState() {
            document.getElementById('route-details').innerHTML = `
                <div class="flex items-center justify-center space-x-2">
                    <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Calculating route...</span>
                </div>
            `;
        }

        function validateTrip(tripType, destinations, dates, retDate) {
            if (destinations.some(dest => !dest)) {
                alert('Please enter all destinations.');
                return false;
            }

            switch(tripType) {
                case 'one-way':
                    if (destinations.length !== 1) {
                        alert('Please enter exactly one destination for a One-Way Trip.');
                        return false;
                    }
                    if (!dates[0]) {
                        alert('Please select a travel date.');
                        return false;
                    }
                    break;
                case 'round-trip':
                    if (destinations.length !== 1) {
                        alert('Please enter exactly one destination for a Round Trip.');
                        return false;
                    }
                    if (!dates[0] || !retDate) {
                        alert('Please select both departure and return dates.');
                        return false;
                    }
                    if (dates[0] > retDate) {
                        alert('Return date cannot be earlier than departure date.');
                        return false;
                    }
                    break;
                case 'multi-city':
                    if (destinations.length < 1) {
                        alert('Please enter at least one destination for a Multi-City Trip.');
                        return false;
                    }
                    if (dates.some(date => !date)) {
                        alert('Please select dates for all destinations.');
                        return false;
                    }
                    break;
            }
            return true;
        }
        
   