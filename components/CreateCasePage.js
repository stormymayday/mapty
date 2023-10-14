import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import Router from "../services/Router.js";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../services/API.js";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default class CreateCasePage extends HTMLElement {

    constructor() {

        super();

        // Used for image name
        this.name = new Date().getTime();
        this.downloadURL;
        this.latitude;
        this.longitude;

    }

    async logOut() {

        await signOut(auth);

        Router.go(`/login`);

    }

    createCase = async (e) => {

        // e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));

        try {

            const response = await addDoc(collection(db, "cases"), {

                creationTime: serverTimestamp(),
                completionTime: '',
                reporterId: user.uid,
                driverID: '',
                coordinates: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                },
                address: '',
                image: this.downloadURL,
                status: 'active',
                notes: '',

            });

        } catch (error) {

            console.error(error);

        }

    }

    initializeMedia() {

        // Custom Polyfills - Start
        // Checking if there is no 'mediaDevices' in navigator
        if (!('mediaDevices' in navigator)) {

            console.log(`There are no Media Devices in the Navigator`);

            // Creating mediaDevices object on navigator
            navigator.mediaDevices = {};


        }

        // Checking if there is 'getUserMedia' property
        if (!('getUserMedia' in navigator.mediaDevices)) {

            console.log(`There is no 'getUserMedia' property`);

            // Implementing our own getUserMedia function
            navigator.mediaDevices.getUserMedia = function (constrains) {

                // Binding Safari's OR Mozilla's implementation of getUserMedia 
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Checking if getUserMedia is undefined
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented!'));
                }

                return new Promise(function (resolve, reject) {

                    getUserMedia.call(navigator, constrains, resolve, reject);

                });

            }

        }
        // Custom Polyfills - End

        // Getting access to the device camera
        navigator.mediaDevices.getUserMedia({
            video: {
                width: {
                    min: 1280,
                    ideal: 1920,
                    max: 2560,
                },
                height: {
                    min: 720,
                    ideal: 1080,
                    max: 1440
                },
                facingMode: 'environment'
            }
        }).then((stream) => {

            // Access granted
            // Outputting the stream
            document.querySelector('#player').srcObject = stream;
            document.querySelector('#player').style.display = 'block';

        }).catch(function (error) {

            // Access denied OR there is no media access
            // Displaying image picker
            document.querySelector('#pick-image').style.display = 'block';

        });

    }
    // End of initializeMedia method

    stopMedia() {

        let videoPlayer = this.querySelector('#player');

        // Stopping the video stream
        videoPlayer.srcObject.getVideoTracks().forEach((track) => {

            track.stop();

        });

    }
    // End of stopMedia method

    // This method converts a base64 url into a BLOB
    base64toBLOB(dataURI) {

        let byteString = atob(dataURI.split(',')[1]);

        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        let ab = new ArrayBuffer(byteString.length);

        let ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        let blob = new Blob([ab], { type: mimeString });

        return blob;
    }
    // End of dataURItoBlob method

    connectedCallback() {

        // console.log(name);

        // Getting template from the DOM
        const template = document.getElementById('create-case-page-template');

        // Cloning the template
        const content = template.content.cloneNode(true);

        // Appending content to the DOM
        this.appendChild(content);

        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {

            this.querySelector('h1').innerHTML = `Welcome ${user.email}`;

            // Testing if navigator.geolocation is supported by the browser
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {

                    // Succuss Callback Code:

                    // Destructuring latitude and longitude from position.coords object
                    const { latitude } = position.coords;
                    const { longitude } = position.coords;
                    const coordinates = [latitude, longitude];

                    // Leaflet Code - Start
                    // Rendering map centered on a current user location (coordinates) with max zoom-in setting
                    const map = L.map('map').setView(coordinates, 18);

                    // Tilelayer
                    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    // Displaying a Marker with current user coordinates
                    L.marker(coordinates).addTo(map)
                        .bindPopup(
                            L.popup({
                                autoClose: false,
                                closeOnClick: false,
                                className: 'running-popup',
                            })
                        )
                        .setPopupContent('You are currently here')
                        .openPopup();

                    // Variable for tracking user clicks on the map
                    let clickMarker = {};

                    // Adding 'click' eventListener to the map 
                    map.on('click', (mapEvent) => {

                        // Destructuring latitude and longitude from mapEvent.latlng object
                        const { lat, lng } = mapEvent.latlng;

                        this.latitude = lat;
                        this.longitude = lng;

                        // Checking if clickMarker already on the map
                        if (clickMarker != undefined) {

                            // Removing clickMarker from the map
                            map.removeLayer(clickMarker);

                        }

                        //Adding clickMarker to the map
                        clickMarker = L.marker([lat, lng]).addTo(map)
                            .bindPopup(
                                L.popup({
                                    autoClose: false,
                                    closeOnClick: false,
                                    className: 'running-popup',
                                })
                            )
                            .setPopupContent('Incident location')
                            .openPopup();

                        console.log(`User clicked on ${lat} ${lng} coordinates`);

                    });

                    // Leaflet Code - End

                }, () => {

                    // Error Callback Code:

                    alert(`Unfortunately, TowTackle was not able to pick up your position.`);

                });

            }
            // end of navigator / Leaflet

            // Image Capture - Start
            let videoPlayer = this.querySelector('#player');
            let canvasElement = this.querySelector('#canvas');
            let captureBtn = this.querySelector('#capture-btn');
            let imagePicker = this.querySelector('#image-picker');
            let imagePickerDiv = this.querySelector('#pick-image');
            let picture;

            this.initializeMedia();

            captureBtn.addEventListener('click', (event) => {

                // Showing the canvas
                canvasElement.style.display = 'block';

                // Hiding the video player
                videoPlayer.style.display = 'none';

                // Hiding the capture button
                captureBtn.style.display = 'none';

                // Creating context for the canvas
                const context = canvasElement.getContext('2d');

                // Drawing image on the canvas
                context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));

                // Stopping the video stream
                videoPlayer.srcObject.getVideoTracks().forEach((track) => {

                    track.stop();

                });

                // Converting canvasElement into a BLOB
                picture = this.base64toBLOB(canvasElement.toDataURL());

                console.log(picture);

                const storageRef = ref(storage, `${this.name}`);

                // 'file' comes from the Blob or File API
                uploadBytes(storageRef, picture).then((snapshot) => {

                    getDownloadURL(snapshot.ref).then((downloadURL) => {

                        this.downloadURL = downloadURL;

                        console.log('File available at', downloadURL);
                    });

                });

            });
            // Image Capture - End

        }

        this.querySelector("#back-btn").addEventListener("click", async (event) => {

            // Stopping the video stream
            this.stopMedia();

            Router.go(`/`);

        });

        this.querySelector("#submit-btn").addEventListener("click", async (event) => {

            // Stopping the video stream
            this.stopMedia();

            this.createCase();

        });

        this.querySelector("#logout-btn").addEventListener("click", async (event) => {

            // Stopping the video stream
            this.stopMedia();

            localStorage.clear();

            await this.logOut();

        });

    }

}

customElements.define("create-case-page", CreateCasePage);
