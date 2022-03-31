const firebaseConfig = {
    apiKey: "AIzaSyBlMkxZaL0UhalZOnU8GwJM2K3MjvlKULQ",
    authDomain: "frontend-4c8b7.firebaseapp.com",
    databaseURL: "https://frontend-4c8b7-default-rtdb.firebaseio.com",
    projectId: "frontend-4c8b7",
    storageBucket: "frontend-4c8b7.appspot.com",
    messagingSenderId: "624383787512",
    appId: "1:624383787512:web:42400ac214d7095b3dd60d",
    measurementId: "G-WW4KQ2QY79"
};

firebase.initializeApp(firebaseConfig);

function randomID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0;
        let v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

function genereteFirebaseItem(ID, value){
    return {
        userid: ID,
        data: value,
      };
}

function addElementInFirebase(REF, data){
    firebase
    .database()
    .ref(REF + randomID())
    .set(data);
}

function getArrayFromFirebase(REF) {
  let tempArray = [];
  firebase
    .database()
    .ref(REF)
    .on("value", (response) => {
      response.forEach((element) => {
        tempArray.push(genereteFirebaseItem(element.key, element.val()));
      });
    });
  return tempArray;
}
  
  function removeElementFromFirebase(REF, id = "", option = false) {
    if (option) {
      firebase.database().ref(`${REF}/${id}`).remove();
    } else {
      firebase.database().ref(`${REF}/`).remove();
    }
  }
  
  function getElementFromFirebaseByID(REF, id) {
    const tempArray = getArrayFromFirebase(REF);
    let User = {};
    setTimeout(() => {
      tempArray.forEach((element) => {
        if (element.userid === id) {
          User = element;
        }
      });
      localStorage.setItem("user", JSON.stringify(User));
    }, 1000);
  }
  
  function changeDataOnFirebaseByID(REF, ID, data) {
    firebase
      .database()
      .ref(REF + ID)
      .set(data);
  }
  
  function displayAlert(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }