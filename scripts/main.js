// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:${
  import.meta.env.REACT_APP_JSON_SERVER_PORT
}`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ***** Constants / Variables ***** //
const userRegisterURL = `${baseServerURL}/register`;
const userLoginURL = `${baseServerURL}/login`;

// register
let registerUserUsername = document.getElementById("register-user-username");
let registerUserFirstname = document.getElementById("register-user-firstname");
let registerUserLastname = document.getElementById("register-user-lastname");
let registerUserEmail = document.getElementById("register-user-email");
let registerUserPassword = document.getElementById("register-user-passowrd");
let registerUserAvatar = document.getElementById("register-user-avatar");
let registerUserLevel = document.getElementById("register-user-level");
let registerUserButton = document.getElementById("register-user");

// login
let loginUserUsername = document.getElementById("login-user-username");
let loginUserPassword = document.getElementById("login-user-passowrd");
let loginUserButton = document.getElementById("login-user");

// getTodo
let getTodoButton = document.getElementById("fetch-todos");

let mainSection = document.getElementById("data-list-wrapper");
let notificationWrapper = document.getElementById("notifications-wrapper");

let userAuthToken = localStorage.getItem("localAccessToken") || null;
let userId = +localStorage.getItem("userId") || null;
const urlAllTodosOfUser = `${baseServerURL}/todos?userId=${userId}`;
const urlTodosBase = `${baseServerURL}/todos/`;

// cats
let empNameInput = document.getElementById("employee-name");
let empImgInput = document.getElementById("employee-image");
let empDeptInput = document.getElementById("employee-dept");
let empSalaryInput = document.getElementById("employee-salary");
let empCreateBtn = document.getElementById("add-employee");
let sortAtoZBtn = document.getElementById("sort-low-to-high");
let sortZtoABtn = document.getElementById("sort-high-to-low");
let catsData = [];

// employees
let updateEmpIdInput = document.getElementById("update-employee-id");
let updateEmpNameInput = document.getElementById("update-employee-name");
let updateEmpImageInput = document.getElementById("update-employee-image");
let updateEmpDeptInput = document.getElementById("update-employee-dept");
let updateEmpSalaryInput = document.getElementById("update-employee-salary");
let updateEmpUpdateBtn = document.getElementById("update-employee");

let updateScoreEmpId = document.getElementById("update-score-employee-id");
let updateScoreEmpSalary = document.getElementById(
  "update-score-employee-salary"
);
let updateScoreEmpSalaryButton = document.getElementById(
  "update-score-employee"
);

let filterLessThan1lakhBtn = document.getElementById("filter-less-than-1L");
let filterMoreThanEqual1lakhBtn = document.getElementById("filter-more-than-equal-1L");





let employeesData = [];

// ***** Event listeners ***** //
window.addEventListener("load", () => {
  fetchAndRenderEmployees();
});


getTodoButton.addEventListener("click",async ()=>{

try{

let res= await fetch(`${baseServerURL}/todos`,{
  method:"GET",
  headers:{
    "Content-type":"application/json",
    "Authorization": `Bearer ${userAuthToken}`
  }
})

let data=await res.json()
mainSection.innerHTML=null;
mainSection.innerHTML=JSON.stringify(data)
}catch(err){

console.log(err)

}


})


loginUserButton.addEventListener("click", async function () {

let username=loginUserUsername.value;
let password=loginUserPassword.value;

loginUser(username,password)


});




function loginUser(username,password){
  fetch(userLoginURL,{
    method:'POST',
    body:JSON.stringify({
     username:username,
     password:password,

    }),
    headers:{
      'Content-type':'application/json',
    }
      
  
  }).then((res)=>res.json())
  .then((data)=>{
    localStorage.setItem("localAccessToken",data.accessToken);
    localStorage.setItem("userId",data.user.id)
    alert("Login Successful")
  })
}






registerUserButton.addEventListener("click", function (e) {
  alert("Register User Successfully")
 
e.preventDefault();

let UserName=registerUserUsername.value;
let Fname=registerUserFirstname.value;
let Lname=registerUserLastname.value;
let email=registerUserEmail.value;
let Password=registerUserPassword.value;
let dept=registerUserLevel.value;
let userimg=registerUserAvatar.value;

registerUser(UserName,Fname,Lname,email,Password,dept,userimg)


});


function registerUser(UserName,Fname,Lname,email,Password,dept,userimg){
  fetch(userRegisterURL,{
    method:'POST',
    body:JSON.stringify({
      username:UserName,
      firstname:Fname,
      lastname:Lname,
      email:email,
      password:Password,
      userlevel:dept,
      avatar:userimg,


    }),
    headers:{
      'Content-type':'application/json',
    }
      
  
  })
}






// ---------------------------------------------------------------------------------------------------------------------------------

// To Fetch the Employeee after Window Loading

function fetchAndRenderEmployees() {

  fetch(`${baseServerURL}/employees`)
    .then((res) => res.json())
    .then((data) => {

      // console.log(data);
      mainSection.innerHTML = renderCardList(data);

       renderCardList(data)
       employeesData=data
       
    });
   
}


// render the data given from the api link

// apply map function to access the item id and item image etc.

// It will return array


function renderCardList(data) {

  let cardList = `

    <div class="card-list">
      ${data.map((item) =>getCard(
            item.id,
            item.name,
            item.salary,
            item.linkText,
            item.linkUrl,
            item.image
          )
        )
        .join("")}
    </div>
  `;

  mainSection.innerHTML = cardList;

  let editLinks = document.getElementsByClassName("card__item card__link");
  for (let editLink of editLinks) {

    editLink.addEventListener("click", (e) => {
      
      e.preventDefault();
      let currentId = e.target.dataset.id;
      populateEditForms(currentId);
    });
  }



 
}

// this code responsible for making single employee card

function getCard(id, title, desc, linkText, linkUrl, imageUrl) {

  let card = `
      <div class="card" data-id=${id} >
        <div class="card__img">
        <img src=${imageUrl} alt="food" />
        </div>
        <div class="card__body">
          <h3 class="card__item card__title">${title}</h3>
          <div class="card__item card__description">
            ${desc}
          </div>
          <a href="Editlink" data-id=${id} class="card__item card__link">EDIT</a>
        </div>
      </div>
  `;

  return card;


}

// ---------------------------------------------------------------------------------------------------------------------------------
// To add the new employeesData to api data


empCreateBtn.addEventListener("click", () => {


  let empNameValue = empNameInput.value;
  let empImgValue = empImgInput.value;
  let empDeptValue = empDeptInput.value;
  let empSalaryVal = +empSalaryInput.value;

// creating obj to passing by making json stringify

  let userObj = {
    name: empNameValue,
    image: empImgValue,
    department: empDeptValue,
    salary: empSalaryVal,
  };

// For adding any data to api data we use post method

  fetch(`${baseServerURL}/employees`, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      'Content-type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    fetchAndRenderEmployees();
  });



});



// ---------------------------------------------------------------------------------------------------------------------------------

// To update the emplyoes data 

function populateEditForms(currentId) {
  let table = "employees";

  fetch(`${baseServerURL}/${table}/${currentId}`)
    .then((res) => res.json())
    .then((data) => {
      updateEmpIdInput.value = data.id;
      updateEmpNameInput.value = data.name;
      updateEmpImageInput.value = data.image;
      updateEmpDeptInput.value = data.department;
      updateEmpSalaryInput.value = data.salary;

      updateScoreEmpId.value = data.id;
      updateScoreEmpSalary.value = data.salary;
    });
}




updateEmpUpdateBtn.addEventListener("click", function () {
  alert("Update the Employee Data Successfully")
  let updateEmpIdValue = updateEmpIdInput.value;
  let updateEmpNameValue = updateEmpNameInput.value;
  let updateEmpImgValue = updateEmpImageInput.value;
  let updateEmpDeptValue = updateEmpDeptInput.value;
  let updateEmpSalaryVal = +updateEmpSalaryInput.value;


  let userObj = {

    name: updateEmpNameValue,
    image: updateEmpImgValue,
    department: updateEmpDeptValue,
    salary: updateEmpSalaryVal,
  };



fetch(`${baseServerURL}/employees/${updateEmpIdValue}`, {
    method: "PATCH",
    body: JSON.stringify(userObj),
    headers: {
      'Content-type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    fetchAndRenderEmployees();
  });





});


// ---------------------------------------------------------------------------------------------------------------------------------
// To Update the salary of the employeesData


updateScoreEmpSalaryButton.addEventListener("click", function () {
alert("Update the Salary Successfully")
  let updateEmpIdValue = updateScoreEmpId.value;
  let updateEmpSalaryVal = +updateScoreEmpSalary.value;

  let userObj = {
    salary: updateEmpSalaryVal,
  };

  fetch(`${baseServerURL}/employees/${updateEmpIdValue}`, {
    method: "PATCH",
    body: JSON.stringify(userObj),
    headers: {
      'Content-type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    fetchAndRenderEmployees();
  });



});


// ---------------------------------------------------------------------------------------------------------------------------------


// Sorting the salary of the employees


sortAtoZBtn.addEventListener("click", () => {

  let sortedData = employeesData.sort((a, b) => a.salary - b.salary);
  renderCardList(sortedData);
// invoke the card function for sorting
});

sortZtoABtn.addEventListener("click", () => {
  let sortedData = employeesData.sort((a, b) => b.salary - a.salary);
  renderCardList(sortedData);
  // invoke the card function for sorting
});


// ---------------------------------------------------------------------------------------------------------------------------------

// Filtering the salary of the employees


filterLessThan1lakhBtn.addEventListener("click", () => {
  let filteredData = employeesData.filter((items) => {
    if (items.salary < 100000) {
      return true;
    } else {
      return false;
    }
  });

  renderCardList(filteredData);
});

filterMoreThanEqual1lakhBtn.addEventListener("click", () => {
  let filterData = employeesData.filter((items) => {
    if (items.salary >= 100000) {
      return true;
    } else {
      return false;
    }
  });
  renderCardList(filterData);
});
