// Store DOM-elements in variables
const pendingInvitations = document.querySelector("#pending-invitations");
const cardsGrid = document.querySelector("#cards-grid");

// Store profiles-data in array
const profiles = [];

// Load profile-data from API
function loadDatafromApi(count, start) {
  fetch("https://dummy-apis.netlify.app/api/contact-suggestions?count=" + count)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.warn("404 - resource not found");
      }
    })
    .then((data) => {
      data.forEach((obj) => {
        obj.id = createId(obj.name.first + obj.name.last);
        profiles.push(obj);
      });
      renderProfiles(start);
    });
}

// Create ID for single profile-card to use it in the delete-function
function createId(profileName) {
  return profileName.trim().replaceAll(" ", "").toLowerCase();
}

// Create DOM-elements with API
function renderProfiles(start) {
  for (i = start; i < profiles.length; i++) {
    // Store single profile in a variable
    const profile = profiles[i];

    // Build the DOM
    const profileCard = document.createElement("li");
    profileCard.classList.add("profile");

    const profileHero = document.createElement("header");
    profileHero.classList.add("profile__intro");

    const backgroundImg = document.createElement("img");
    backgroundImg.src = profile.backgroundImage;
    backgroundImg.classList.add("profile__intro--background-img");

    const profilePicture = document.createElement("img");
    profilePicture.src = profile.picture;
    profilePicture.classList.add("profile__intro--picture");

    const backgroundEmpty = document.createElement("div");
    backgroundEmpty.classList.add("profile__intro--background-empty");

    const btnDelete = document.createElement("button");
    btnDelete.innerText = "X";
    btnDelete.classList.add("profile__intro--delete");
    btnDelete.addEventListener("click", deleteProfile);

    const profileInfo = document.createElement("div");
    profileInfo.classList.add("profile__info");

    const profileName = document.createElement("h2");
    profileName.classList.add("profile__info--name");
    profileName.innerText = profile.name.first + " " + profile.name.last;

    const profilePosition = document.createElement("p");
    profilePosition.classList.add("profile__info--position");
    profilePosition.innerText = profile.title;

    const connections = document.createElement("p");
    connections.classList.add("profile__info--connections");
    connections.innerText =
      " " + profile.mutualConnections + " mutual connections";

    const btnConnect = document.createElement("button");
    btnConnect.classList.add("profile__info--connect");
    btnConnect.innerText = "Connect";
    btnConnect.addEventListener("click", connectWithProfile);

    cardsGrid.append(profileCard);
    profileCard.append(profileHero, profileInfo);
    profileHero.append(
      backgroundImg,
      profilePicture,
      backgroundEmpty,
      btnDelete
    );
    profileInfo.append(profileName, profilePosition, connections, btnConnect);
  }
}

// Build a connection with a profile; using localstorage

let numberOfInvitations = loadData() || 0;
storeData(numberOfInvitations);

if (numberOfInvitations === 0) {
  pendingInvitations.innerText = "No pending invitations";
} else {
  pendingInvitations.innerText = numberOfInvitations + " pending invitations";
}

function connectWithProfile(e) {
  const btnConnect = e.target;

  if (btnConnect.innerText === "Connect") {
    btnConnect.innerText = "Pending";
    numberOfInvitations++;
    pendingInvitations.innerHTML = numberOfInvitations + " pending invitations";
    storeData(numberOfInvitations);
  } else {
    btnConnect.innerText = "Connect";
    numberOfInvitations--;
    pendingInvitations.innerText = numberOfInvitations + " pending invitations";
    storeData(numberOfInvitations);
  }
}

function storeData(numberOfInvitations) {
  localStorage.setItem("numberOfInvitations", numberOfInvitations);
}

function loadData() {
  return localStorage.getItem("numberOfInvitations");
}

// Delete contact and load a new one

function deleteProfile(e) {
  const profileCard = e.target.parentElement.parentElement;
  const id = e.target.id;
  const index = profiles.findIndex((profile) => profile.id === id);

  profiles.splice(index, 1);
  profileCard.remove();
  loadDatafromApi(1, 7);
}

loadDatafromApi(8, 0);
// renderInvitations();
