checkAuth();
displayCards();
displayroom();

function register() {
  let usersArray = getArrayFromFirebase("Users");
  let email = document.getElementById("email").value;
  let isAlreadyRegister = false;
  usersArray.forEach((element) => {
    if (element.data.email === email) {
      isAlreadyRegister = true;
      return;
    }
  });
  if (isAlreadyRegister) {
    displayAlert("Already reigstered email", "try different", "error");
    return;
  }
  let password = document.getElementById("password").value;
  let repeatPassword = document.getElementById("repeatPassword").value;
  if (password !== repeatPassword) {
    displayAlert("Password doesn't match", "try again", "error");
    return;
  }
  let name = document.getElementById("name").value;
  let lastname = document.getElementById("lastname").value;
  let user = {
    name: name,
    lastname: lastname,
    email: email,
    password: password,
    user_type: "guest",
  };
  document.querySelector("button").remove();
  addElementInFirebase("Users/", user);
  displayAlert("Successfully registered", "done", "success");
  setTimeout(() => {
    window.location.href = "logIn.html";
  }, 2000);
}

function showPassword() {
  const eyeShow = `<i class="fa-solid fa-eye"></i>`;
  const eyeClose = `<i class="fa-solid fa-eye-slash"></i>`;
  const password = document.getElementById("password");
  const eye = document.getElementById("eye");
  if (eye.innerHTML == eyeShow) {
    eye.innerHTML = eyeClose;
    password.setAttribute("type", "text");
  } else {
    eye.innerHTML = eyeShow;
    password.setAttribute("type", "password");
  }
}

function login() {
  const usersArray = getArrayFromFirebase("Users");
  setTimeout(() => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let currentUserID = "";
    usersArray.forEach((element) => {
      if (
        element.data.email === email.value &&
        element.data.password === password.value
      ) {
        currentUserID = element.userid;
        return;
      }
    });
    if (currentUserID === "") {
      displayAlert("Wrong data", "try again", "error");
      return;
    } else {
      document.querySelector("button").remove();
      displayAlert("Successfully authorized", "done", "success");
      localStorage.setItem("id", currentUserID);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  }, 1000);
}

function checkAuth() {
  let url = window.location.href.split("/")[3];
  if (localStorage.getItem("id")) {
    if (url === "logIn.html" || url === "register.html") {
      displayAlert(
        "You don't have permission to be here!",
        "you already authorized",
        "info"
      );
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }  
    
    const logoutBTN = document.getElementById("authClear");
      logoutBTN.innerHTML =`
      <ul>
      <li id="a" style="display: none;" ><a href="./register.html">Register</a></li>
      <li onclick='${onclick= 'logout()'}' id="a"><a href="">Log Out</a></li>
    </ul>
      `
      
  } else {
    if (url === "upload.html" || url === "yourHotel.html" || url === "rooms.html" || url === "dashboard.html") {
      displayAlert(
        "You Don't Have Permission To Be Here!",
        "Going To Login Page",
        "error"
      );
      setTimeout(() => {
        window.location.href = "logIn.html";
      }, 1500);
    }
  }
}


function logout() {
  localStorage.removeItem("id");
  window.location.href = "./register.html";
}





//dashboard
function displayTable() {
  const displayData = document.getElementById("displayData");
  const Users = getArrayFromFirebase("Users");
  setTimeout(() => {
    Users.forEach((element, index) => {
      displayData.innerHTML += `
        <tr>
        <td style="text-align: center; padding-top: 17px" scope="col">${index + 1}</td>
        <td style="text-align: center; padding-top: 17px" scope="col">${element.data.name}</td>
        <td style="text-align: center; padding-top: 17px" scope="col">${element.data.lastname}</td>
        <td style="text-align: center; padding-top: 17px" scope="col">${element.data.email}</td>
        <td style="text-align: center; padding-top: 17px" scope="col">${element.data.password}</td>
        <td style="text-align: center; padding-top: 17px" scope="col">${element.data.user_type}</td>
        <td style="text-align: center" scope="col"> <button onclick="switchUserType('${element.userid}')" type="button" class="btn btn-info">Edit</button></td>        
        <th style="text-align: center" id = "delete" scope="col"><button onclick="deleteUser('${element.userid}')" type="button" class="btn btn-danger">Delete</button></th>
        </tr>
      `
    });
  }, 1000);
}

function deleteUser(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "User has been deleted.", "success");
      firebase.database().ref(`Users/${id}`).remove();
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    }
  });
}


// dashboard
async function switchUserType(id) {
  const { value: userType } = await Swal.fire({
    title: "Select field validation",
    input: "select",
    inputOptions: {
      users_type: {
        hotel: "Hotel",
        guest: "Guest",
        admin: "Admin",
      },
    },
    inputPlaceholder: "Select a type",
    showCancelButton: true,
  });

  if (userType) {
    getElementFromFirebaseByID("Users", id);
    let user = {};
    setTimeout(() => {
      user = JSON.parse(localStorage.getItem("user"));
      localStorage.removeItem("user");
      user.data.user_type = userType;
    }, 2000);

    setTimeout(() => {
      changeDataOnFirebaseByID("Users/", id, user.data);
      displayAlert("Edited user type", "success", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 2000);
  }
}

function locationbtn(){
  document.getElementById("location");
  window.location.href = "yourHotel.html";
}

function locationbtn2(){
  document.getElementById("location2");
  window.location.href = "dashboard.html";
}

function locationbtn3(){
  document.getElementById("location3");
  window.location.href = "upload.html";
}

function locationbtn4(){
  document.getElementById("location4");
  window.location.href = "yourHotel.html";
}

function locationbtn5(){
  document.getElementById("location5");
  window.location.href = "rooms.html";
}

function locationbtn6(){
  document.getElementById("location6");
  window.location.href = "event.html";
}

function locationbtn7(){
  document.getElementById("location7");
  window.location.href = "contact.html";
}

function goback(){
  document.getElementById("goback");
  window.location.href = "index.html";
}



//yourhotel
function uploadHotel() {
  const name = document.getElementById("name");
  const address = document.getElementById("address");
  const Number = document.getElementById("Number");
  const url = document.getElementById("url");
  const email = document.getElementById("email");
  const card = {
    name: name.value,
    address: address.value,
    Number: Number.value,
    url: url.value,
    email: email.value,
  };
  addElementInFirebase("Posts/", card);
  displayAlert("Successfully Added Hotel!", "Added to Your Hotel Page", "success");
  setTimeout(() => {
    window.location.href = "yourHotel.html";
  }, 1500);
}


function displayCards() {
  if (location.href.split("/")[3] === "yourHotel.html") {
    const display = document.getElementById("displayCards");
    const cardsArray = getArrayFromFirebase("Posts");
    setTimeout(() => {
      cardsArray.forEach((element) => {
        display.innerHTML += `
        <div style="box-shadow: rgba(0,0,0, 0.4) 0 0 8px 8px" class="card" style="width: 18rem;">
        <img src="${element.data.url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Hotel Name : ${element.data.name}</h5>
          <p class="card-text">Hotel Email : ${element.data.email}</p>
          <p class="card-text">Hotel Number : ${element.data.Number}</p>
          <p class="card-text">Hotel Address : ${element.data.address}</p>
          <button class='btn btn-danger' onclick="deleteCard('${element.userid}')">Delete</button>
          <a style="float: right" href="./uploadRoom.html" class="btn btn-success" onclick="">Add Room</a>
        </div>
      </div>
        `;
      });
    }, 1200);
  } 
}

getDataByID();
function getDataByID() {
  const id = localStorage.getItem("id");
  getElementFromFirebaseByID("Users", id);
  let user = {};
  setTimeout(() => {
    user = JSON.parse(localStorage.getItem("user"));
    localStorage.removeItem("user");
  }, 1000);
}

function deleteCard(id) {
  removeElementFromFirebase("Posts", id, true);
  window.location.reload();
}

function storeDataInLocalStorage(elementIndex) {
  const cardsArray = getArrayFromFirebase("Posts");
  let card = {};
  cardsArray.forEach((element, index) => {
    if (index == elementIndex) {
      card = element;
    }
  });
  localStorage.setItem("currentCard", JSON.stringify(card));
  window.location.href = "rooms.html";
}

let base64Image = "";
function imageToString() {
  const imageinput = document.getElementById("imageInput");
  let reader = new FileReader();
  reader.readAsDataURL(imageinput.files[0]);
  reader.onload = () => {
    base64Image = reader.result;
  };
}

function addRoom(){
  const name = document.getElementById("name");
  const price = document.getElementById("price");
  const email = document.getElementById("email");
  const Number = document.getElementById("Number");
  const bedroom = document.getElementById("bedroom");
  const bathroom = document.getElementById("bathroom");
  const url2 = document.getElementById("url2");
  const room = {
    name: name.value,
    price: price.value,
    bedroom: bedroom.value,
    Number: Number.value,
    bathroom: bathroom.value,
    email: email.value,
    url2: url2.value,
  };
  addElementInFirebase("Rooms/", room);
  displayAlert("Successfully Added Hotel!", "Added to Your Hotel Page", "success");
  setTimeout(() => {
    window.location.href = "rooms.html";
  }, 2000);
}


function displayroom() {
  if (location.href.split("/")[3] === "rooms.html") {
    const displayroom = document.getElementById("displayroom");
    const roomsArray = getArrayFromFirebase("Rooms");
    setTimeout(() => {
      roomsArray.forEach((element) => {
        displayroom.innerHTML += `
        <div class="card" style="width: 18rem;">
        <img src="${element.data.url2}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Apartment Number : ${element.data.name}</h5>
          <p class="card-text">Apartment Area (m2) : ${element.data.email}</p>
          <p class="card-text">Rooms In Apartment : ${element.data.Number}</p>
          <p class="card-text">Bathrooms In Apartment : ${element.data.bathroom}</p>
          <p class="card-text">Bedrooms In Apartment : ${element.data.bedroom}</p>
          <p class="card-text">Price a Day : ${element.data.price}</p>
          <button class='btn btn-danger' onclick="deleteRoom('${element.userid}')">Delete</button>
          <a style="float: right" href="./paying.html" class="btn btn-success" onclick="">Pay Now</a>
        </div>
      </div>
        `;
      });
    }, 1200);
  }
}

function deleteRoom(id){
  removeElementFromFirebase("Rooms", id, true);
  window.location.reload();
}

function paying(){
  displayAlert("Successfully Payed!", "Congrats", "success");
}